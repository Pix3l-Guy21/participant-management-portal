import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { AuthResponse } from '@interfaces/auth-response';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../app.config';
import { Router } from '@angular/router';
import { getErrorMessage } from '../../interceptors/error-interceptor';

@Service()
export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);
    tokenSignal = signal<string | null>(localStorage.getItem('access_token'));
    errorMessage = signal<string | null>(null);
    expiresAt = signal<number | null>(this.getStoredExpiresAt());
    private tokenTimer: ReturnType<typeof setTimeout> | null = null;

    readonly isAuthenticated = computed(() => {
        const token = this.tokenSignal();
        const expiresAt = this.expiresAt();
        return !!token && expiresAt !== null && Date.now() < expiresAt;
    });

    constructor () {
        this.initAuth();
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkSession();
            }
        });
        window.addEventListener('storage', (event) => {
            if (event.key === 'access_token' || event.key === 'expires_at') {
                this.checkSession();
            }
        });
    }

    private getStoredExpiresAt(): number | null {
        const expiresAt = localStorage.getItem('expires_at');
        if (!expiresAt) return null;
        const parsed = Number(expiresAt);
        return Number.isFinite(parsed) ? parsed : null;
    }

    private checkSession(): void {
        const token = localStorage.getItem('access_token');
        const expiresAt = this.getStoredExpiresAt();

        if (!token || expiresAt === null) {
            if (this.tokenSignal()) {
                this.logout();
            }
            return;
        }

        const timeLeft = expiresAt - Date.now();
        if (timeLeft <= 0) {
            this.logout();
            return;
        }

        this.tokenSignal.set(token);
        this.expiresAt.set(expiresAt);
        this.startTokenTimer(timeLeft);
    }

    private initAuth(){
        const token = localStorage.getItem('access_token');
        if (token) {
            this.checkSession();
        }
    }

    private startTokenTimer(durationMs: number) {
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer);
        }
        this.tokenTimer = setTimeout(() => {
            this.checkSession();
        }, durationMs);
    }

    saveToken(token: string) {
        localStorage.setItem('access_token', token);
        this.tokenSignal.set(token);
    }

    public login(credentials: {username: string, password: string, grant_type: "password", client_id: "acs_apis_client_api"}): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${API_BASE_URL}/api/v1/auth/login`, credentials).pipe(
            tap(response => {
                this.saveToken(response.access_token);
                const expiresAt = Date.now() + response.expires_in * 1000;
                localStorage.setItem('expires_at', expiresAt.toString());
                this.expiresAt.set(expiresAt);
                this.errorMessage.set(null);
                this.startTokenTimer(response.expires_in * 1000);
            }),
            catchError((error: HttpErrorResponse) => {
               let message = getErrorMessage(error);
                if(error.status === 401){
                    message = "Invalid Username or Password";
                }
                console.log(message);
                this.errorMessage.set(message);
                return throwError(() => error);
            })
        )
    }
    getToken(){
        return this.tokenSignal()
    }

    public logout(): void{
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer);
            this.tokenTimer = null;
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_at");
        this.tokenSignal.set(null);
        this.expiresAt.set(null);
        this.router.navigate(['/login'])
    }
}
