import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service';
import { Router } from '@angular/router';
import { ParticipantService } from '@services/participant/participant-service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private loginService = inject(AuthService);
  private router = inject(Router);
  private pService = inject(ParticipantService);
  
  username = '';
  password = '';
  submitted = signal(false);
  errorMessage = this.loginService.errorMessage;
  onSubmit() {
    this.loginService.login(this.username, this.password);
    this.submitted.set(true);
    if (!this.errorMessage()) {
      this.pService.bannerType.set("success");
      this.pService.bannerMessage.set("Welcome back.");
      this.router.navigate(['/participants']);
    }
  } 
}
