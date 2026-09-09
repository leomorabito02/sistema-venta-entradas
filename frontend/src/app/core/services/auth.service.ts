import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, throwError, switchMap, EMPTY, shareReplay, finalize } from 'rxjs';
import { ApiResponse, TokenResponse, User } from '../models/api.models';
import { getApiUrl } from '../utils/env.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get baseUrl(): string {
    return `${getApiUrl()}/api/auth`;
  }
  private readonly router = inject(Router);

  // OWASP Best Practice: Store access token ONLY in memory (Signals/Service properties), NEVER in localStorage/sessionStorage
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isInitializingSignal = signal<boolean>(true);

  // Single-flight deduplicated refresh token observable
  private refreshInFlight$: Observable<ApiResponse<TokenResponse>> | null = null;

  readonly accessToken = computed(() => this.accessTokenSignal());
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.accessTokenSignal() && !!this.currentUserSignal());
  readonly isInitializing = computed(() => this.isInitializingSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  readonly isSeller = computed(() => this.currentUserSignal()?.role === 'SELLER' || this.isAdmin());

  constructor(private readonly http: HttpClient) {}

  googleLogin(idToken: string): Observable<ApiResponse<TokenResponse>> {
    return this.http.post<ApiResponse<TokenResponse>>(
      `${this.baseUrl}/google`,
      { id_token: idToken },
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data.access_token, res.data.user);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<TokenResponse>> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.http.post<ApiResponse<TokenResponse>>(
      `${this.baseUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data.access_token, res.data.user);
        } else {
          this.clearSession(false);
        }
      }),
      catchError((err) => {
        this.clearSession(false);
        return throwError(() => err);
      }),
      finalize(() => {
        this.refreshInFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.refreshInFlight$;
  }

  /**
   * Safe Mutex-queued 401 token refresh handler to prevent race conditions on parallel endpoints.
   * If refresh fails (revoked/expired refresh token), clears session and redirects cleanly to /login without throwing console errors.
   */
  handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return this.refreshToken().pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return next(this.addTokenHeader(req, res.data.access_token));
        }
        this.clearSession(true);
        return EMPTY;
      }),
      catchError(() => {
        this.clearSession(true);
        return EMPTY;
      })
    );
  }

  private addTokenHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    });
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.clearSession(true)),
      catchError(() => {
        this.clearSession(true);
        return of({ success: true, message: 'Logged out locally' });
      })
    );
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private setSession(accessToken: string, user: User): void {
    this.accessTokenSignal.set(accessToken);
    this.currentUserSignal.set(user);
    this.isInitializingSignal.set(false);
  }

  clearSession(redirect: boolean = true): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.isInitializingSignal.set(false);
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }
}
