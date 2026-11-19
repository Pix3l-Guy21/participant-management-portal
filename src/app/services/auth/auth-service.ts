import { Service, signal } from '@angular/core';

@Service()
export class AuthService {
    errorMessage = signal<string | null>(null);

    public login(username: string, password: string) {
        if (username === "admin" && password === "Admin@123") {
            this.errorMessage.set(null);
        } else {
            this.errorMessage.set("Invalid Credentials!");
        }
    }
}
