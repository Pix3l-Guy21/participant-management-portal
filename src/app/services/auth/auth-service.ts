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
    tokenSignal = signal<string | null>(sessionStorage.getItem('access_token'));
    errorMessage = signal<string | null>(null);
    private tokenTimer: ReturnType<typeof setTimeout> | null = null;

    readonly isAuthenticated = computed(() => !!this.tokenSignal() );

    saveToken(token: string) {
        sessionStorage.setItem('access_token', token);
        this.tokenSignal.set(token);
    }

    public login(credentials: {username: string, password: string, grant_type: "password", client_id: "acs_apis_client_api"}): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials).pipe(
            tap(response => {
                this.saveToken(response.access_token);
                this.errorMessage.set(null);
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
        sessionStorage.removeItem("access_token");
        this.tokenSignal.set(null);
        this.router.navigate(['/login'])
    }
}
