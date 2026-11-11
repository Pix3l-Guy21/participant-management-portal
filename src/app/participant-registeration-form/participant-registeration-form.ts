import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ParticipantService } from '../participant-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-participant-registeration-form',
  styleUrl: './participant-registeration-form.css',
  templateUrl: './participant-registeration-form.html',
})
export class ParticipantRegisterationForm {
  private pRegister = inject(ParticipantService);
  private router = inject(Router);

  private name: string = '';
  private bic: string = '';
  private email: string = '';
  private shortName: string = '';
  private phoneNumber: string = '';

  submitted = signal(false);
  isActive = signal(false);
  onToggleChange(){
    this.isActive.set(!this.isActive());
  }
  onSubmit(form: NgForm){
    this.submitted.set(true);

    if(form.invalid){
      form.form.markAllAsTouched();
      return;
    }

    this.pRegister.addParticipant(
      this.name,
      this.bic,
      this.shortName,
      this.email,
      "+251".concat(this.phoneNumber),
      this.isActive()? 'ACTIVE': 'INACTIVE'
    );
    this.router.navigate(['/participants']);
  }
  cancel(){
    this.router.navigate(['/participants']);
  }
}
