import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Participants } from '../participants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../participant-service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-participantspage',
  styleUrl: './participantspage.css',
  templateUrl: './participantspage.html',
})
export class Participantspage {
  
  private router = inject(Router);
  private pService = inject(ParticipantService);

  searchTerm: string = '';

  banks: Participants[] = this.pService.getParticipants();
  filteredBanks: Participants[] = this.banks;
  
  public logout() {
    this.router.navigate(['/login']);
  }

  public filterResults(text: string) {
    if(!text || text.trim() === '') {
      this.filteredBanks = this.banks;
      return;
    }
    const searchTerm = text.toLowerCase().trim();
    this.filteredBanks = this.banks.filter((bank) => {
      const filteredByName = bank.name.toLowerCase().includes(searchTerm); 
      const filteredByStatus = bank.status.toLowerCase() === searchTerm;
      return filteredByName || filteredByStatus;
    }
      );
  }

  public participantEdit(id: number){
    this.router.navigate(['/participants/edit', id])
  }
}
