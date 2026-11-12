import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantService } from '../participant-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-participant-registeration-form',
  styleUrl: './participant-registeration-form.css',
  templateUrl: './participant-registeration-form.html',
})
export class ParticipantRegisterationForm implements OnInit {
  private pService = inject(ParticipantService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  participantForm = this.formBuilder.group({
    name: ['', Validators.required],
    bic: ['', [Validators.required, Validators.minLength(11), Validators.pattern('^[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$')]],
    email: ['', [Validators.required, Validators.email]],
    shortName: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    status: [false]
  })
  
  private bankId = this.activatedRoute.snapshot.params['id'] | 0;

  submitted = signal(false);
  isEditMode = signal(false);

  // getter for each field
  getField(field: string){
    return this.participantForm.get(field);
  }

  // setter for each field
  setField(field: string, value: string) {
    this.participantForm.get(field)?.setValue(value);
  }


  onSubmit(){
    this.submitted.set(true);

    const formattedPhoneNumber = "+251".concat(this.getField('phoneNumber')?.value.toString());

    if(this.isEditMode()){
      const isEditted = this.pService.updateParticipant(this.bankId, {
        name: this.getField('name')?.value,
        bic: this.getField('bic')?.value.toUpperCase(),
        shortName: this.getField('shortName')?.value,
        email: this.getField('email')?.value,
        phoneNumber: formattedPhoneNumber,
        status: this.getField('status')?.value? 'ACTIVE': 'INACTIVE'
      });
      
    } else {
      this.pService.addParticipant(
        this.getField('name')?.value,
        this.getField('bic')?.value.toUpperCase(),
        this.getField('shortName')?.value,
        this.getField('email')?.value,
        
        formattedPhoneNumber,
        this.getField('status')?.value? 'ACTIVE': 'INACTIVE'
      );
    }
    // route back
    this.router.navigate(['/participants']);
  }

  ngOnInit() {
    this.participantForm.get('phoneNumber')?.valueChanges.subscribe(value => {
      if (value) {
        const numericValue = value.replace(/\D/g, '');
        
        if (numericValue !== value) {
          this.participantForm.get('phoneNumber')?.setValue(numericValue, { emitEvent: false });
        }
      }
    });
  }

  constructor() {

    if ((this.activatedRoute.snapshot.url[1].path === 'edit') && this.bankId) {
      this.isEditMode.set(true);
      const selectedBank = this.pService.getParticipantById(this.bankId);
      this.setField('name', selectedBank.name);
      this.setField('bic', selectedBank.bic);
      this.setField('shortName', selectedBank.shortName);
      this.setField('email', selectedBank.email);
      this.setField('phoneNumber', selectedBank.phoneNumber.replace(/^\+?251/, ''));
  
      selectedBank.status === 'ACTIVE'? this.participantForm.get('status')?.setValue(true): this.participantForm.get('status')?.setValue(false);
    }
  }

  cancel(){
    this.router.navigate(['/participants']);
  }
}
