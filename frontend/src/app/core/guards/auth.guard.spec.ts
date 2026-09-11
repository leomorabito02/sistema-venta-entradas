import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authGuard, guestGuard, adminGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ApiResponse, TokenResponse } from '../models/api.models';

describe('Navigation Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = { url: '/protected-page' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin', 'refreshToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  describe('authGuard', () => {
    it('should allow access if user is already authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should attempt refresh token and allow access if refresh succeeds and user becomes authenticated', (done) => {
      authServiceSpy.isAuthenticated.and.returnValues(false, true);
      authServiceSpy.refreshToken.and.returnValue(of({ success: true } as ApiResponse<TokenResponse>));

      const obs$ = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState)) as any;

      obs$.subscribe((allowed: boolean) => {
        expect(allowed).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should redirect to /login with returnUrl query parameter if unauthenticated and refresh fails', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      authServiceSpy.refreshToken.and.returnValue(of({ success: false } as ApiResponse<TokenResponse>));

      const obs$ = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState)) as any;

      obs$.subscribe((allowed: boolean) => {
        expect(allowed).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected-page' } });
        done();
      });
    });
  });

  describe('guestGuard', () => {
    it('should redirect to /dashboard and block access if user is authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should allow access to guest route if unauthenticated and refresh fails', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      authServiceSpy.refreshToken.and.returnValue(throwError(() => new Error('No refresh token')));

      const obs$ = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState)) as any;

      obs$.subscribe((allowed: boolean) => {
        expect(allowed).toBeTrue();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('adminGuard', () => {
    it('should allow access if user is admin', () => {
      authServiceSpy.isAdmin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));

      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should block access and redirect to /tickets if user is not admin', () => {
      authServiceSpy.isAdmin.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));

      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tickets']);
    });
  });
});
