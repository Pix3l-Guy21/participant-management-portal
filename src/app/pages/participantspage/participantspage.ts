import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Participants } from '@interfaces/participants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '@services/participant/participant-service';
import { finalize } from 'rxjs';
import { AlertCard } from '@sharedComponents/alert-card/alert-card';
import { LoadingSpinner } from '@sharedComponents/loading-spinner/loading-spinner';
import { StatusBanner } from '@sharedComponents/status-banner/status-banner';
import { Notification } from '@services/notification/notification';
import { AuthService } from '@services/auth/auth-service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, AlertCard, LoadingSpinner, StatusBanner],
  selector: 'app-participantspage',
  styleUrl: './participantspage.css',
  templateUrl: './participantspage.html',
})
export class Participantspage {
  
  private router = inject(Router);
  private pService = inject(ParticipantService);
  private nService = inject(Notification);
  private authService = inject(AuthService);

  timer: any = null;

  isLoading = signal(true);
  searchTerm = signal('');
  loadingError = signal('');
  bannerType = this.nService.type;
  bannerMessage = this.nService.message;
  checkLogout = signal(false);
  
  participantToDelete = signal<number | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  banks = signal<Participants[]>([]);
  logoVersion = signal(Date.now());

  filteredBanks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const banks = this.banks();

    if (!term) return banks;

    return banks.filter(bank =>
      bank.name?.toLowerCase().includes(term) ||
      bank.status?.toLowerCase() === term
    );
  });

  loadParticipants() {
    this.pService.getParticipants().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.logoVersion.set(Date.now());
        this.banks.set(data);
        console.log(this.bannerType(), this.bannerMessage())
      },
      error: () => this.loadingError.set("Failed to load data.")
    });
  }

  ngOnInit(): void {
    this.loadParticipants();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
        this.bannerType.set(null);
      }, 3000);
    
  }
  
  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  public confirmLogout(){
    this.checkLogout.set(true);
  }
  public cancelLogout(){
    this.checkLogout.set(false);
  }
  public executeLogout() {
    this.authService.logout();
  }

  filterResults(text: string) {
    this.searchTerm.set(text);
  }

  confirmDelete(id: number){
    this.participantToDelete.set(id);
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  cancelDelete(){
    this.participantToDelete.set(null);
  }

  public executeDelete(){
    const id = this.participantToDelete();
    if (id === null) return;
    this.pService.deleteParticipantById(id).subscribe(
      () => {
        this.participantToDelete.set(null);
        this.successMessage.set('Record deleted successfully');
        this.nService.type.set('error');
        this.nService.message.set('Participant Deleted.');
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.bannerType.set(null);
          }, 3000);
        this.loadParticipants()
    })
    
  }
  public participantEdit(id: number){
    this.router.navigate(['/participants/edit', id])
  }
}
