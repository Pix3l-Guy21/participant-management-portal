import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantService } from '../participant-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertCard } from '../alert-card/alert-card';
import { of, switchMap } from 'rxjs';

@Component({
  imports: [CommonModule, ReactiveFormsModule, AlertCard],
  selector: 'app-participant-registeration-form',
  styleUrl: './participant-registeration-form.css',
  templateUrl: './participant-registeration-form.html',
})
export class ParticipantRegisterationForm implements OnInit {
  private pService = inject(ParticipantService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  formData = new FormData();
  selectedFile: File | null = null;
  imagePreview = signal<string | ArrayBuffer | null>(null);
  
  dismissed = output<void>();

  participantForm = this.formBuilder.group({
    name: ['', Validators.required],
    bic: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$')]],
    email: ['', [Validators.required, Validators.email]],
    shortName: ['', Validators.required],
    address: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    status: [false],
    logo: this.formBuilder.control<File | null>(null)
  });
  
  private bankId = this.activatedRoute.snapshot.params['id'] || 0;

  submitted = signal(false);
  isEditMode = signal(false);
  confirmEdit = signal(false);

  // getter for each field
  getField(field: string){
    return this.participantForm.get(field);
  }

  // setter for each field
  setField(field: string, value: string | null) {
    this.participantForm.get(field)?.setValue(value);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      this.selectedFile = file;
      this.participantForm.patchValue({ logo: file });
      this.participantForm.get('logo')?.markAsTouched();
      const logoFile = this.selectedFile;
      if(logoFile) {
        this.formData.append('logo', logoFile)
      }
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview.set(reader.result);
      };
      reader.readAsDataURL(file);
    }

  }

  executeEdit(){
    const formattedPhoneNumber = "+251".concat(this.getField('phoneNumber')?.value.toString());
    this.pService.updateParticipant(this.bankId, {
        name: this.getField('name')?.value,
        bic: this.getField('bic')?.value.toUpperCase(),
        shortName: this.getField('shortName')?.value,
        address: this.getField('address')?.value,
        email: this.getField('email')?.value,
        phoneNumber: formattedPhoneNumber,
        status: this.getField('status')?.value? 'ACTIVE': 'INACTIVE'
      }).pipe(
        switchMap(() => {
          const participantId = this.bankId;
          return this.selectedFile
            ? this.pService.addLogo(participantId, this.formData)
            : of(true);
        })
      ).subscribe({
          next: () => {
          this.pService.bannerType.set("success");
          this.pService.bannerMessage.set("Saved changes successfully.");
          this.router.navigate(['/participants']);
        }
      });
  }

  onSubmit(){
    this.submitted.set(true);
    
    if(this.isEditMode()){
      this.confirmEdit.set(true);
    } else {
      const formattedPhoneNumber = "+251".concat(this.getField('phoneNumber')?.value.toString());
      this.pService.addParticipant({
        name: this.getField('name')?.value,
        bic: this.getField('bic')?.value.toUpperCase(),
        shortName: this.getField('shortName')?.value,
        address: this.getField('address')?.value,
        email: this.getField('email')?.value,
        phoneNumber: formattedPhoneNumber,
        status: this.getField('status')?.value? 'ACTIVE': 'INACTIVE'
      }).pipe(
        switchMap((createdParticipant: any) => {
          const participantId = createdParticipant.institution.id;
          return this.selectedFile
            ? this.pService.addLogo(participantId, this.formData)
            : of(true);
        })
      ).subscribe({
        next: () => {
          this.pService.bannerType.set("success");
          this.pService.bannerMessage.set("New participant added successfully.");
          this.router.navigate(['/participants']);
        },
        error: (err) => console.error('Failed to add participant', err)
      });
    }
  }

  ngOnInit() {
    if ((this.activatedRoute.snapshot.url[1].path === 'edit') && this.bankId) {
      this.isEditMode.set(true);
      this.pService.getParticipantById(this.bankId).subscribe({
        next: (selectedBank) => {
          if (!selectedBank) {
            this.router.navigate(['/participants']);
            return;
          }
          this.participantForm.patchValue({
            name: selectedBank.name,
            bic: selectedBank.bic,
            shortName: selectedBank.shortName,
            address: selectedBank.address,
            email: selectedBank.email,
            phoneNumber: selectedBank.phoneNumber?.replace(/^\+?251/, ''),
            status: selectedBank.status === 'ACTIVE'
          });
        },
        error: (err: unknown) => console.error(err)
      });
    }

    this.participantForm.get('phoneNumber')?.valueChanges.subscribe(value => {
      if (value) {
        const numericValue = value.replace(/\D/g, '');
        
        if (numericValue !== value) {
          this.participantForm.get('phoneNumber')?.setValue(numericValue, { emitEvent: false });
        }
      }
    });
  }

  cancel(){
    this.router.navigate(['/participants']);
  }
}
