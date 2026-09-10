import {
  Router
} from "./chunk-ADJ2KLCM.js";
import {
  EMPTY,
  HttpClient,
  Injectable,
  catchError,
  computed,
  finalize,
  getApiUrl,
  inject,
  of,
  setClassMetadata,
  shareReplay,
  signal,
  switchMap,
  tap,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-SFLJKOAY.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  http;
  get baseUrl() {
    return `${getApiUrl()}/api/auth`;
  }
  router = inject(Router);
  // OWASP Best Practice: Store access token ONLY in memory (Signals/Service properties), NEVER in localStorage/sessionStorage
  accessTokenSignal = signal(null);
  currentUserSignal = signal(null);
  isInitializingSignal = signal(true);
  // Single-flight deduplicated refresh token observable
  refreshInFlight$ = null;
  accessToken = computed(() => this.accessTokenSignal());
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.accessTokenSignal() && !!this.currentUserSignal());
  isInitializing = computed(() => this.isInitializingSignal());
  isAdmin = computed(() => this.currentUserSignal()?.role === "ADMIN");
  isSeller = computed(() => this.currentUserSignal()?.role === "SELLER" || this.isAdmin());
  constructor(http) {
    this.http = http;
  }
  googleLogin(idToken) {
    return this.http.post(`${this.baseUrl}/google`, { id_token: idToken }, { withCredentials: true }).pipe(tap((res) => {
      if (res.success && res.data) {
        this.setSession(res.data.access_token, res.data.user);
      }
    }));
  }
  refreshToken() {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }
    this.refreshInFlight$ = this.http.post(`${this.baseUrl}/refresh`, {}, { withCredentials: true }).pipe(tap((res) => {
      if (res.success && res.data) {
        this.setSession(res.data.access_token, res.data.user);
      } else {
        this.clearSession(false);
      }
    }), catchError((err) => {
      this.clearSession(false);
      return throwError(() => err);
    }), finalize(() => {
      this.refreshInFlight$ = null;
    }), shareReplay(1));
    return this.refreshInFlight$;
  }
  /**
   * Safe Mutex-queued 401 token refresh handler to prevent race conditions on parallel endpoints.
   * If refresh fails (revoked/expired refresh token), clears session and redirects cleanly to /login without throwing console errors.
   */
  handle401Error(req, next) {
    return this.refreshToken().pipe(switchMap((res) => {
      if (res.success && res.data) {
        return next(this.addTokenHeader(req, res.data.access_token));
      }
      this.clearSession(true);
      return EMPTY;
    }), catchError(() => {
      this.clearSession(true);
      return EMPTY;
    }));
  }
  addTokenHeader(req, token) {
    return req.clone({
      setHeaders: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Content-Type-Options": "nosniff",
        "Authorization": `Bearer ${token}`
      },
      withCredentials: true
    });
  }
  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(tap(() => this.clearSession(true)), catchError(() => {
      this.clearSession(true);
      return of({ success: true, message: "Logged out locally" });
    }));
  }
  getAccessToken() {
    return this.accessTokenSignal();
  }
  setSession(accessToken, user) {
    this.accessTokenSignal.set(accessToken);
    this.currentUserSignal.set(user);
    this.isInitializingSignal.set(false);
  }
  clearSession(redirect = true) {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.isInitializingSignal.set(false);
    if (redirect) {
      this.router.navigate(["/login"]);
    }
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-4HMK5Z4R.js.map
