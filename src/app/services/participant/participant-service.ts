import { inject, Service, signal } from '@angular/core';
import { Participants } from '@interfaces/participants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Service()
export class ParticipantService {
  
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl.concat('/participants');
  bannerType = signal<'info' | 'success' | 'error' | 'warning' | null>(null);
  bannerMessage = signal<string>('');

  public getParticipants(): Observable<Participants[]> {
    return this.http.get<{ institutions: Participants[] }>(`${this.baseUrl}`).pipe(
        map(response => response.institutions)
      );
  }
  public addParticipant(body: Omit<Participants, 'id' | 'logoPath'>): Observable<Participants> {
    return this.http.post<Participants>(this.baseUrl, body)
  }

  public addLogo(id: number, logo: FormData): Observable<boolean> {
    return this.http.post<{status: string}>(`${this.baseUrl}/${id}/logo`, logo).pipe(
      map(res => res.status === 'SUCCESS')
    )
  }

  public getParticipantById(id: number): Observable<Participants> {
     return this.http.get<Participants>(`${this.baseUrl}/${id}`);
  }

  // public getParticipantByBic(bic: string): Observable<Participants> {
  //   return this.http.get<Participants>(`${this.baseUrl}/bic/${bic}`);
  // }

  public updateParticipant(id: number, updatedData: Partial<Participants>): Observable<boolean> {
    return this.http.put<{status: string}> (`${this.baseUrl}/${id}`, updatedData).pipe(
      map(res => res.status === 'SUCCESS')
    )
  }
  public deleteParticipantById(id: number): Observable<boolean> {
    return this.http.delete<{status: string}> (`${this.baseUrl}/${id}`).pipe(
      map(res => res.status === 'SUCCESS')
    )
  }
}
