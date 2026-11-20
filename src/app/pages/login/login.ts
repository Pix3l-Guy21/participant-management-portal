import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth/auth-service';
import { Router } from '@angular/router';
import { ParticipantService } from '@services/participant/participant-service';
import { Notification } from '@services/notification/notification';

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
  private nService = inject(Notification);
  
  username = '';
  password = '';
  submitted = signal(false);
  errorMessage = this.loginService.errorMessage;
  onSubmit() {
    this.submitted.set(true);
    this.loginService.login({
      username: this.username,
      password: this.password,
      grant_type: "password",
      client_id: "acs_apis_client_api",
    }).subscribe(() => {
      if (!this.errorMessage()) {
        this.nService.type.set("success");
        this.nService.message.set("Welcome back.");
        this.router.navigate(['/participants']);
        
      }
    });
    
  } 
}
