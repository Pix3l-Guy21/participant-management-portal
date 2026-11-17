import { Component, Input, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-loading-spinner',
  styleUrl: './loading-spinner.css',
  templateUrl: './loading-spinner.html',
})
export class LoadingSpinner {
  @Input() message?: string;
}
