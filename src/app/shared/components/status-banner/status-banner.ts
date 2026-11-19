import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-status-banner',
  styleUrl: './status-banner.css',
  templateUrl: './status-banner.html',
})
export class StatusBanner {

  type = input<'info' | 'success' | 'error' | 'warning' | null>(null);
  message = input<string>('');

  getBannerClass = computed(() => {
    switch (this.type()) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      default: return 'alert-primary';
    }
  });
}
