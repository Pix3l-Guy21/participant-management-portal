import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Participants } from '../participants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../participant-service';
import { finalize, Observable } from 'rxjs';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-participantspage',
  styleUrl: './participantspage.css',
  templateUrl: './participantspage.html',
})
export class Participantspage {
  
  private router = inject(Router);
  private pService = inject(ParticipantService);

  isLoading = signal(true);
  searchTerm = signal('');
  loadingError = signal('');

  banks = signal<Participants[]>([]);

  filteredBanks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const banks = this.banks();

    if (!term) return banks;

    return banks.filter(bank =>
      bank.name?.toLowerCase().includes(term) ||
      bank.status?.toLowerCase() === term
    );
  });

  ngOnInit(): void {
    this.pService.getParticipants().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.banks.set(data);
      },
      error: (err) => this.loadingError.set("Failed to load data.")
    });
  }
  
  public logout() {
    this.router.navigate(['/login']);
  }

  filterResults(text: string) {
    this.searchTerm.set(text);
  }

  public participantEdit(id: number){
    this.router.navigate(['/participants/edit', id])
  }
}
