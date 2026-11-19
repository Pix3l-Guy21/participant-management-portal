import { Service, signal } from '@angular/core';

@Service()
export class Notification {
    type = signal<'info' | 'success' | 'error' | 'warning' | null>(null);
    message = signal('');

    showError(message: string) {
        this.type.set('error');
        this.message.set(message);
    }
}
