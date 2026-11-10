import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-participantspage',
  styleUrl: './participantspage.css',
  templateUrl: './participantspage.html',
})
export class Participantspage {
  private router = inject(Router);
  public logout() {
    this.router.navigate(['/login']);
  }
}
