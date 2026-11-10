import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private loginService = inject(AuthService);
  private router = inject(Router);
  
  username = '';
  password = '';
  submitted = signal(false);
  errorMessage = this.loginService.errorMessage;
  onSubmit() {
    this.loginService.login(this.username, this.password);
    this.submitted.set(true);
    if (!this.errorMessage()) {
      this.router.navigate(['/participants']);
    }
  } 
}
