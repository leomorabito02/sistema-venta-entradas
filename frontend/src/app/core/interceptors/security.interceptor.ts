import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, catchError, retry, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const securityInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    toastService.warning('Sin Conexión', 'Comprueba tu conexión a internet.');
    return throwError(() => new Error('Sin conexión a internet'));
  }

  const token = authService.getAccessToken();

  let headersConfig: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff'
  };

  if (token) {
    headersConfig['Authorization'] = `Bearer ${token}`;
  }

  const secureReq = req.clone({
    setHeaders: headersConfig,
    withCredentials: true
  });

  return next(secureReq).pipe(
    retry({
      count: 1,
      delay: (error: HttpErrorResponse) => {
        if (req.method === 'GET' || (error.status >= 502 && error.status <= 504)) {
          return timer(1000);
        }
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = error.url?.includes('/api/auth/refresh') || error.url?.includes('/api/auth/google');

      if (error.status === 401 && !isAuthEndpoint) {
        return authService.handle401Error(req, next);
      }

      let errorMsg = 'Ha ocurrido un error inesperado en el servidor.';
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMsg = error.error.message;
      } else if (error.error && typeof error.error === 'object' && error.error.error) {
        errorMsg = error.error.error;
      } else if (typeof error.error === 'string') {
        errorMsg = error.error;
      }

      const skipToast =
        req.headers.has('X-Skip-Toast') ||
        req.url?.includes('/validate') ||
        error.url?.includes('/validate');

      if (!skipToast) {
        if (error.status >= 500) {
          toastService.error('Error de Servidor', errorMsg);
        } else if (error.status === 403) {
          toastService.error('Acceso Denegado (403)', 'No tienes permisos suficientes para realizar esta acción.');
        } else if (error.status === 400 || error.status === 409 || error.status === 422) {
          toastService.error('Error de Solicitud', errorMsg);
        }
      }

      return throwError(() => error);
    })
  );
};

