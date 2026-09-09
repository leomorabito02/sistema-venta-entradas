import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Attempt silent refresh via HTTP-only cookie when entering a protected route
  return authService.refreshToken().pipe(
    map((res) => {
      if (res.success && authService.isAuthenticated()) {
        return true;
      }
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }),
    catchError(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Attempt silent refresh to check if user has a valid refresh token cookie
  return authService.refreshToken().pipe(
    map((res) => {
      if (res.success && authService.isAuthenticated()) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      return of(true);
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/tickets']);
  return false;
};
