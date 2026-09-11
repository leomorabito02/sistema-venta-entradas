import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse, TokenResponse, User } from '../models/api.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ADMIN',
    status: 'ACTIVE'
  };

  const mockTokenResponse: TokenResponse = {
    access_token: 'mock-access-token',
    user: mockUser
  };

  const mockSuccessResponse: ApiResponse<TokenResponse> = {
    success: true,
    data: mockTokenResponse
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Black-Box & State Tests: Initial State
  it('should initialize with default empty authentication state', () => {
    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.isInitializing()).toBeTrue();
    expect(service.isAdmin()).toBeFalse();
    expect(service.isSeller()).toBeFalse();
  });

  // Black-Box & State Tests: Google Login State Transition
  it('should handle googleLogin successfully and update state signals', () => {
    const idToken = 'google-id-token';

    service.googleLogin(idToken).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data?.access_token).toBe('mock-access-token');
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/auth/google'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id_token: idToken });
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockSuccessResponse);

    expect(service.accessToken()).toBe('mock-access-token');
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isInitializing()).toBeFalse();
    expect(service.isAdmin()).toBeTrue();
    expect(service.isSeller()).toBeTrue();
  });

  // White-Box Tests: Single-Flight Deduplicated Refresh Token
  it('should deduplicate simultaneous refreshToken requests using single-flight pattern', () => {
    let res1: ApiResponse<TokenResponse> | undefined;
    let res2: ApiResponse<TokenResponse> | undefined;

    service.refreshToken().subscribe((r) => (res1 = r));
    service.refreshToken().subscribe((r) => (res2 = r));

    const reqs = httpMock.match((r) => r.url.endsWith('/api/auth/refresh'));
    expect(reqs.length).toBe(1);
    expect(reqs[0].request.method).toBe('POST');
    reqs[0].flush(mockSuccessResponse);

    expect(res1).toEqual(mockSuccessResponse);
    expect(res2).toEqual(mockSuccessResponse);
    expect(service.accessToken()).toBe('mock-access-token');
  });

  // State Transition & White-Box Tests: Refresh Token Failure
  it('should clear session and not throw when refreshToken returns an error response', () => {
    const errorResponse: ApiResponse<TokenResponse> = {
      success: false,
      error: 'Invalid refresh token'
    };

    service.refreshToken().subscribe((res) => {
      expect(res.success).toBeFalse();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/auth/refresh'));
    req.flush(errorResponse);

    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // White-Box Tests: handle401Error success branch
  it('should refresh token and retry request with updated Authorization header on handle401Error', (done) => {
    const originalReq = new HttpRequest<unknown>('GET', '/api/tickets');
    const dummyNextHandler: HttpHandlerFn = (req) => {
      expect(req.headers.get('Authorization')).toBe('Bearer mock-access-token');
      expect(req.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
      return of({} as HttpEvent<unknown>);
    };

    service.handle401Error(originalReq, dummyNextHandler).subscribe(() => {
      done();
    });

    const refreshReq = httpMock.expectOne((r) => r.url.endsWith('/api/auth/refresh'));
    refreshReq.flush(mockSuccessResponse);
  });

  // State Transition Tests: logout
  it('should clear session state and navigate to /login on logout', () => {
    const logoutResponse: ApiResponse<null> = {
      success: true,
      message: 'Logged out'
    };

    service.logout().subscribe();

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/auth/logout'));
    expect(req.request.method).toBe('POST');
    req.flush(logoutResponse);

    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
