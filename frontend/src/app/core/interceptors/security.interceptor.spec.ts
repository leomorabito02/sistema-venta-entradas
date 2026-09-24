import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { securityInterceptor } from './security.interceptor';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

describe('securityInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken', 'handle401Error']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'warning']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([securityInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // White-Box Branch 1: Injects headers & bearer token
  it('should add security headers and Bearer token when user is authenticated', () => {
    authServiceSpy.getAccessToken.and.returnValue('token-abc-123');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
    expect(req.request.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-abc-123');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({});
  });

  // White-Box Branch 2: Handle 401 delegating to authService.handle401Error
  it('should delegate 401 error to authService.handle401Error for non-auth endpoints', () => {
    authServiceSpy.getAccessToken.and.returnValue('expired-token');
    authServiceSpy.handle401Error.and.returnValue(of({} as any));

    httpClient.post('/api/tickets', {}).subscribe();

    const req = httpMock.expectOne('/api/tickets');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.handle401Error).toHaveBeenCalled();
  });

  // White-Box Branch 3: Server error toast trigger
  it('should display error toast on 500 Internal Server Error when skipToast is false', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.post('/api/tickets', {}).subscribe({
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/tickets');
    req.flush({ message: 'Internal Server Error Details' }, { status: 500, statusText: 'Server Error' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Error de Servidor', 'Internal Server Error Details');
  });

  // White-Box Branch 4: Skip toast on /validate endpoint
  it('should NOT display error toast when url contains /validate', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.post('/api/tickets/validate', {}).subscribe({
      error: (err) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('/api/tickets/validate');
    req.flush({ error: 'Code already used' }, { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).not.toHaveBeenCalled();
  });

  // White-Box Branch 5: 403 Forbidden Toast
  it('should display access denied toast on 403 response', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.post('/api/admin/users', {}).subscribe({
      error: (err) => expect(err.status).toBe(403)
    });

    const req = httpMock.expectOne('/api/admin/users');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith(
      'Acceso Denegado (403)',
      'No tienes permisos suficientes para realizar esta acción.'
    );
  });

  // White-Box Branch 6: 400/409/422 Bad Request Toast with string error
  it('should display error toast on 400 Bad Request with string payload', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.post('/api/tickets/buy', {}).subscribe({
      error: (err) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('/api/tickets/buy');
    req.flush('Stock insuficiente', { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Error de Solicitud', 'Stock insuficiente');
  });

  // White-Box Branch 7: Skip toast when X-Skip-Toast header is present
  it('should NOT display toast when X-Skip-Toast header is set', () => {
    authServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.get('/api/tickets', { headers: { 'X-Skip-Toast': 'true' } }).subscribe({
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/tickets');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(toastServiceSpy.error).not.toHaveBeenCalled();
  });

  // White-Box Branch 8: Offline handling
  it('should trigger warning toast and return error when offline', () => {
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    let caughtError: Error | undefined;
    httpClient.get('/api/offline-test').subscribe({
      error: (err) => (caughtError = err)
    });

    expect(toastServiceSpy.warning).toHaveBeenCalledWith('Sin Conexión', 'Comprueba tu conexión a internet.');
    expect(caughtError?.message).toBe('Sin conexión a internet');

    Object.defineProperty(navigator, 'onLine', { value: originalOnLine, configurable: true });
  });
});
