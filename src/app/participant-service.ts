import { Service } from '@angular/core';
import { Participants } from './participants';

@Service()
export class ParticipantService {
    private participants: Participants[] = [
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
  public getParticipants() {
    return this.participants;
  }
  public addParticipant(name: string, bic: string, shortName: string, email: string, phoneNumber: string, status: 'ACTIVE' | 'INACTIVE') {
    this.participants.push(
        {
            id: this.participants.length +1,
            name: name,
            bic: bic.toUpperCase(),
            shortName: shortName,
            email: email,
            phoneNumber: phoneNumber,
            status: status
        }
    )
  }
}
