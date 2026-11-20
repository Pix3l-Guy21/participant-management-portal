import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error-interceptor';
import { authInterceptor } from './interceptors/auth-interceptor';

export const API_BASE_URL = 'http://localhost:9081/api/v1';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([errorInterceptor, authInterceptor]))
  ]
};
