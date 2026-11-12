import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ParticipantService } from '../participant-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-participant-registeration-form',
  styleUrl: './participant-registeration-form.css',
  templateUrl: './participant-registeration-form.html',
})
export class ParticipantRegisterationForm {
  private pService = inject(ParticipantService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private name: string = '';
  private bic: string = '';
  private email: string = '';
  private shortName: string = '';
  private phoneNumber: number = 0;
  
  private bankId = this.activatedRoute.snapshot.params['id'] | 0;

  submitted = signal(false);
  isActive = signal(false);
  isEditMode = signal(false);

  toggleStatus(){
    this.isActive.update(value => !value);
  }
  onSubmit(form: NgForm){
    this.submitted.set(true);

    if(form.invalid){
      form.form.markAllAsTouched();
      return;
    }

    const formattedPhoneNumber = "+251".concat(this.phoneNumber.toString());
    const participantStatus = this.isActive() ? 'ACTIVE' : 'INACTIVE';

    if(this.isEditMode()){
      const isEditted = this.pService.updateParticipant(this.bankId, {
        name: this.name,
        bic: this.bic,
        shortName: this.shortName,
        email: this.email,
        phoneNumber: formattedPhoneNumber,
        status: participantStatus
      });
      
    } else {
      this.pService.addParticipant(
        this.name,
        this.bic,
        this.shortName,
        this.email,
        formattedPhoneNumber,
        this.isActive()? 'ACTIVE': 'INACTIVE'
      );
    }
    this.router.navigate(['/participants']);
  }

  constructor() {
    if ((this.activatedRoute.snapshot.url[1].path === 'edit') && this.bankId) {
      this.isEditMode.set(true);
      const selectedBank = this.pService.getParticipantById(this.bankId);
      this.name = selectedBank.name;
      this.bic = selectedBank.bic;
      this.shortName = selectedBank.shortName;
      this.email = selectedBank.email;
      this.phoneNumber = Number(selectedBank.phoneNumber.replace(/^\+?251/, ''));
      selectedBank.status === 'ACTIVE'? this.isActive.set(true): this.isActive.set(false);
    }
  }

  cancel(){
    this.router.navigate(['/participants']);
  }
}
