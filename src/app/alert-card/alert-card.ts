import { Component, computed, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-alert-card',
  styleUrl: './alert-card.css',
  templateUrl: './alert-card.html',
})
export class AlertCard {
  type = input<'info' | 'success' | 'error' | 'warning'>('info');
  title = input<string>('');
  dismissible = input<boolean>(false);
  isModal = input<boolean>(false);
  
  dismissed = output<void>();

  getAlertClass = computed(() => {
    switch (this.type()) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      default: return 'alert-primary';
    }
  });

  getHeaderClass = computed(() => {
    switch (this.type()) {
      case 'success': return 'bg-success text-white';
      case 'error': return 'bg-danger text-white';
      case 'warning': return 'bg-warning text-dark';
      default: return 'bg-primary text-white';
    }
  });

  onDismiss() {
    this.dismissed.emit();
  }

  onBackdropClick() {
    if (this.dismissible()) {
      this.dismissed.emit();
    }
  }
}
