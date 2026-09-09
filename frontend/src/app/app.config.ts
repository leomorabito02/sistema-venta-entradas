import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { routes } from './app.routes';
import { securityInterceptor } from './core/interceptors/security.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([securityInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: '-0300' } },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};


