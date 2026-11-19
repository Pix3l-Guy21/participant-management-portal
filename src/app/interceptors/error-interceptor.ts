import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Notification } from '@services/notification/notification';
import { catchError, throwError } from 'rxjs';

const defaultErrorMessages: Record<number, string> = {
  0: 'Unable to connect to the server. Please check your internet connection.',
  400: 'The request was invalid.',
  401: 'You are not authorized. Please sign in and try again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource could not be found.',
  408: 'The request timed out. Please try again.',
  409: 'The request conflicts with the current state of the resource.',
  422: 'The submitted data could not be processed.',
  429: 'Too many requests. Please wait and try again.',
  500: 'The server encountered an error.',
  502: 'The server received an invalid response.',
  503: 'The service is temporarily unavailable.',
  504: 'The server took too long to respond.',
};

export function getErrorMessage(error: HttpErrorResponse): string {
  
  if (error.error instanceof ErrorEvent) {
    return `Error: ${error.error.message}`;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (
    error.error &&
    typeof error.error === 'object' &&
    'message' in error.error &&
    typeof error.error.message === 'string' &&
    error.error.message.trim()
  ) {
    return error.error.message;
  }

  return defaultErrorMessages[error.status] ?? 'An unexpected error occurred.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(Notification);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      notifications.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
