import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { errorInterceptor, getErrorMessage } from './error-interceptor';
import { throwError } from 'rxjs';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should use a default message for common HTTP errors', () => {
    expect(
      getErrorMessage(new HttpErrorResponse({ status: 404 }))
    ).toBe('The requested resource could not be found.');
  });

  it('should prefer a message returned by the server', () => {
    expect(
      getErrorMessage(
        new HttpErrorResponse({
          status: 500,
          error: { message: 'Participant already exists.' },
        })
      )
    ).toBe('Participant already exists.');
  });

  it('should log the friendly message and rethrow the original error', () => {
    const error = new HttpErrorResponse({ status: 401 });
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let receivedError: HttpErrorResponse | undefined;

    interceptor(
      {} as never,
      () => throwError(() => error)
    ).subscribe({ error: received => (receivedError = received) });

    expect(log).toHaveBeenCalledWith(
      'You are not authorized. Please sign in and try again.'
    );
    expect(receivedError).toBe(error);
    log.mockRestore();
  });
});
