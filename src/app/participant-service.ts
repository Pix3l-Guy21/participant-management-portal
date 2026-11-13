import { inject, Service } from '@angular/core';
import { Participants } from './participants';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './app.config';
import { map, Observable, tap } from 'rxjs';

@Service()
export class ParticipantService {
  // private participants: Participants[] = [];
  private newParticipant!: Omit<Participants, 'id'>;
  private http = inject(HttpClient);
  private baseUrl = API_BASE_URL.concat('/api/v1/participants');

  public getParticipants(): Observable<Participants[]> {
    return this.http.get<{ institutions: Participants[] }>(`${this.baseUrl}`).pipe(
        map(response => response.institutions)
      );
  }
  public addParticipant(name: string, bic: string, shortName: string, address: string, email: string, phoneNumber: string, status: 'ACTIVE' | 'INACTIVE') {
    this.newParticipant = {
      'name': name,
      'bic': bic,
      'shortName': shortName,
      'address': address,
      'email': email,
      'phoneNumber': phoneNumber,
      'status': status
    };
    this.http.post<Participants>(this.baseUrl, this.newParticipant, {
      'responseType': 'json'
    }).subscribe( data => {
      this.newParticipant = data;
    })
  }

  public getParticipantById(id: number): Observable<Participants> {
     return this.http.get<Participants>(`${this.baseUrl}/${id}`);
  }

  public updateParticipant(id: number, updatedData: Partial<Participants>): Observable<boolean> {
    return this.http.put<{status: string}> (`${this.baseUrl}/${id}`, updatedData).pipe(
      map(res => res.status === 'SUCCESS')
    )
  }
}
