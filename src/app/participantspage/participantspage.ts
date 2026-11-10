import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Participants } from '../participants';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-participantspage',
  styleUrl: './participantspage.css',
  templateUrl: './participantspage.html',
})
export class Participantspage {
   banks: Participants[] = [
    {
      id: 1,
      name: "Commercial Bank of Ethiopia",
      bic: "CBETETAABOL",
      shortName: "CBE",
      email: "CBEcontactcenter@cbe.com.et",
      phoneNumber: "+251113000000",
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "Dashen Bank S.C.",
      bic: "DASHETAAKAZ",
      shortName: "Dashen",
      email: "info@dashenbanksc.com",
      phoneNumber: "+251114661380",
      status: "INACTIVE"
    },
    {
      id: 3,
      name: "Bank of Abyssinia S.C.",
      bic: "ABYSETAAPIA",
      shortName: "BOA",
      email: "info@bankofabyssinia.com",
      phoneNumber: "+251115583667",
      status: "ACTIVE"
    },
    {
      id: 4,
      name: "Awash Bank S.C.",
      bic: "AWINETAAMEX",
      shortName: "Awash",
      email: "contactcenter@awashbank.com",
      phoneNumber: "+251115570087",
      status: "ACTIVE"
    },
    {
      id: 5,
      name: "Cooperative Bank of Oromia",
      bic: "CBORETAASAR",
      shortName: "Coopbank",
      email: "info@coopbankoromia.com.et",
      phoneNumber: "+251114674087",
      status: "ACTIVE"
    }
  ];
  filteredBanks: Participants[] = this.banks;
  private router = inject(Router);
  public logout() {
    this.router.navigate(['/login']);
  }
  public filterResults(text: string) {
    if(!text) {
      this.filteredBanks = this.banks;
      return;
    }
    this.filteredBanks = this.banks.filter((banks) => 
      banks.name.toLowerCase().includes(text.toLowerCase()));
  }
}
