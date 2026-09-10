import {
  AuthService
} from "./chunk-4HMK5Z4R.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideRouter
} from "./chunk-ADJ2KLCM.js";
import {
  CommonModule,
  Component,
  DATE_PIPE_DEFAULT_OPTIONS,
  ErrorHandler,
  Injectable,
  Injector,
  LOCALE_ID,
  NgClass,
  NgForOf,
  NgIf,
  NgZone,
  catchError,
  inject,
  map,
  of,
  provideHttpClient,
  provideZoneChangeDetection,
  registerLocaleData,
  retry,
  setClassMetadata,
  signal,
  throwError,
  timer,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-SFLJKOAY.js";

// src/app/shared/components/navbar/navbar.component.ts
function NavbarComponent_nav_0_li_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "a", 23);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_li_25_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(2, "Usuarios Admin");
    \u0275\u0275elementEnd()();
  }
}
function NavbarComponent_nav_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "nav", 1)(1, "div", 2)(2, "div", 3);
    \u0275\u0275element(3, "img", 4);
    \u0275\u0275elementStart(4, "span", 5);
    \u0275\u0275text(5, "Pe\xF1a Seminario 2026");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 6);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleMenu());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(7, "svg", 7);
    \u0275\u0275element(8, "line", 8)(9, "line", 9)(10, "line", 10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "div", 11)(12, "ul", 12)(13, "li")(14, "a", 13);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_a_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(15, "Dashboard");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "li")(17, "a", 14);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_a_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(18, "Tickets");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "li")(20, "a", 15);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_a_click_20_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(21, "Validar Entrada");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "li")(23, "a", 16);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_a_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(24, "Validar Comida");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, NavbarComponent_nav_0_li_25_Template, 3, 0, "li", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 18)(27, "span", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(28, "svg", 7);
    \u0275\u0275element(29, "path", 20)(30, "circle", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(32, "button", 22);
    \u0275\u0275listener("click", function NavbarComponent_nav_0_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.onLogout();
      return \u0275\u0275resetView(ctx_r1.closeMenu());
    });
    \u0275\u0275text(33, "Salir");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275classProp("mobile-open", ctx_r1.menuOpen());
    \u0275\u0275advance(14);
    \u0275\u0275property("ngIf", ctx_r1.authService.isAdmin());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2(" ", (tmp_3_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_3_0.name, " (", (tmp_3_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_3_0.role, ") ");
  }
}
var NavbarComponent = class _NavbarComponent {
  authService = inject(AuthService);
  menuOpen = signal(false);
  toggleMenu() {
    this.menuOpen.update((val) => !val);
  }
  closeMenu() {
    this.menuOpen.set(false);
  }
  onLogout() {
    this.authService.logout().subscribe();
  }
  static \u0275fac = function NavbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarComponent, selectors: [["app-navbar"]], decls: 1, vars: 1, consts: [["class", "navbar", 4, "ngIf"], [1, "navbar"], [1, "nav-header"], [1, "nav-brand"], ["src", "assets/logo-seminario-removebg-preview.png", "alt", "Logo Pe\xF1a", 1, "nav-logo-img"], [1, "brand-title"], ["aria-label", "Abrir Men\xFA", 1, "mobile-toggle", 3, "click"], ["viewBox", "0 0 24 24", 1, "icon"], ["x1", "3", "y1", "12", "x2", "21", "y2", "12"], ["x1", "3", "y1", "6", "x2", "21", "y2", "6"], ["x1", "3", "y1", "18", "x2", "21", "y2", "18"], [1, "nav-content"], [1, "nav-links"], ["routerLink", "/dashboard", "routerLinkActive", "active", 3, "click"], ["routerLink", "/tickets", "routerLinkActive", "active", 3, "click"], ["routerLink", "/validar-entrada", "routerLinkActive", "active", 3, "click"], ["routerLink", "/validar-comida", "routerLinkActive", "active", 3, "click"], [4, "ngIf"], [1, "auth-area"], [1, "user-chip"], ["d", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"], ["cx", "12", "cy", "7", "r", "4"], [1, "btn-logout", 3, "click"], ["routerLink", "/admin/users", "routerLinkActive", "active", 3, "click"]], template: function NavbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, NavbarComponent_nav_0_Template, 34, 5, "nav", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.authService.isAuthenticated());
    }
  }, dependencies: [CommonModule, NgIf, RouterLink, RouterLinkActive], styles: ['\n\n.navbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.9rem 2rem;\n  background: var(--bg-cream-card, #F4EFE6);\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), var(--neu-shadow-outer-sm);\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n}\n.nav-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  font-size: 1.25rem;\n  color: var(--color-bordo, #7A001E);\n}\n.nav-logo-img[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 6px rgba(122, 0, 30, 0.12));\n}\n.nav-links[_ngcontent-%COMP%] {\n  display: flex;\n  list-style: none;\n  gap: 1rem;\n  margin: 0;\n  padding: 0;\n}\n.nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n  font-size: 0.92rem;\n  padding: 0.5rem 1rem;\n  border-radius: var(--radius-sm, 8px);\n  transition: all 0.2s ease;\n  text-decoration: none;\n}\n.nav-links[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%], \n.nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n}\n.auth-area[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.user-chip[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n  padding: 0.4rem 0.9rem;\n  border-radius: 20px;\n}\n.btn-logout[_ngcontent-%COMP%] {\n  padding: 0.45rem 1rem;\n  border-radius: var(--radius-sm, 8px);\n  font-weight: 700;\n  cursor: pointer;\n  font-size: 0.85rem;\n  background: var(--color-bordo, #7A001E);\n  color: #FFFFFF;\n  border: 1px solid rgba(212, 175, 55, 0.4);\n  box-shadow: var(--neu-shadow-outer-sm);\n  transition: all 0.2s ease;\n}\n.btn-logout[_ngcontent-%COMP%]:hover {\n  background: var(--color-bordo-hover, #5C0016);\n  color: var(--color-gold, #D4AF37);\n}\n.nav-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 2rem;\n}\n.mobile-toggle[_ngcontent-%COMP%] {\n  display: none;\n  background: transparent;\n  border: none;\n  color: var(--color-bordo, #7A001E);\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0.5rem;\n  min-width: 44px;\n  min-height: 44px;\n}\n.nav-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n@media (max-width: 860px) {\n  .navbar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n    padding: 0.8rem 1rem;\n  }\n  .nav-header[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .mobile-toggle[_ngcontent-%COMP%] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    background: var(--bg-cream-base, #F7F3EB);\n    border: 1px solid var(--color-bordo-light);\n    border-radius: var(--radius-sm, 8px);\n    box-shadow: var(--neu-shadow-outer-sm);\n  }\n  .nav-content[_ngcontent-%COMP%] {\n    display: none;\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n    gap: 1rem;\n    padding-top: 1rem;\n    border-top: 1px solid var(--color-bordo-light);\n    margin-top: 0.5rem;\n  }\n  .nav-content.mobile-open[_ngcontent-%COMP%] {\n    display: flex;\n  }\n  .nav-links[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n    width: 100%;\n  }\n  .nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    display: block;\n    width: 100%;\n    text-align: center;\n    padding: 0.75rem 1rem;\n    min-height: 44px;\n    line-height: 1.5;\n  }\n  .auth-area[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 0.75rem;\n    width: 100%;\n  }\n  .user-chip[_ngcontent-%COMP%] {\n    text-align: center;\n  }\n  .btn-logout[_ngcontent-%COMP%] {\n    min-height: 44px;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=navbar.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarComponent, [{
    type: Component,
    args: [{ selector: "app-navbar", standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive], template: '<nav *ngIf="authService.isAuthenticated()" class="navbar">\n  <div class="nav-header">\n    <div class="nav-brand">\n      <img src="assets/logo-seminario-removebg-preview.png" alt="Logo Pe\xF1a" class="nav-logo-img">\n      <span class="brand-title">Pe\xF1a Seminario 2026</span>\n    </div>\n\n    <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Abrir Men\xFA">\n      <svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>\n    </button>\n  </div>\n\n  <div class="nav-content" [class.mobile-open]="menuOpen()">\n    <ul class="nav-links">\n      <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a></li>\n      <li><a routerLink="/tickets" routerLinkActive="active" (click)="closeMenu()">Tickets</a></li>\n      <li><a routerLink="/validar-entrada" routerLinkActive="active" (click)="closeMenu()">Validar Entrada</a></li>\n      <li><a routerLink="/validar-comida" routerLinkActive="active" (click)="closeMenu()">Validar Comida</a></li>\n      <li *ngIf="authService.isAdmin()"><a routerLink="/admin/users" routerLinkActive="active" (click)="closeMenu()">Usuarios Admin</a></li>\n    </ul>\n\n    <div class="auth-area">\n      <span class="user-chip">\n        <svg class="icon" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> {{ authService.currentUser()?.name }} ({{ authService.currentUser()?.role }})\n      </span>\n      <button (click)="onLogout(); closeMenu()" class="btn-logout">Salir</button>\n    </div>\n  </div>\n</nav>\n\n\n', styles: ['/* src/app/shared/components/navbar/navbar.component.css */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.9rem 2rem;\n  background: var(--bg-cream-card, #F4EFE6);\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), var(--neu-shadow-outer-sm);\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n}\n.nav-brand {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  font-size: 1.25rem;\n  color: var(--color-bordo, #7A001E);\n}\n.nav-logo-img {\n  width: 48px;\n  height: 48px;\n  object-fit: contain;\n  filter: drop-shadow(0 2px 6px rgba(122, 0, 30, 0.12));\n}\n.nav-links {\n  display: flex;\n  list-style: none;\n  gap: 1rem;\n  margin: 0;\n  padding: 0;\n}\n.nav-links a {\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n  font-size: 0.92rem;\n  padding: 0.5rem 1rem;\n  border-radius: var(--radius-sm, 8px);\n  transition: all 0.2s ease;\n  text-decoration: none;\n}\n.nav-links a.active,\n.nav-links a:hover {\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n}\n.auth-area {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.user-chip {\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n  padding: 0.4rem 0.9rem;\n  border-radius: 20px;\n}\n.btn-logout {\n  padding: 0.45rem 1rem;\n  border-radius: var(--radius-sm, 8px);\n  font-weight: 700;\n  cursor: pointer;\n  font-size: 0.85rem;\n  background: var(--color-bordo, #7A001E);\n  color: #FFFFFF;\n  border: 1px solid rgba(212, 175, 55, 0.4);\n  box-shadow: var(--neu-shadow-outer-sm);\n  transition: all 0.2s ease;\n}\n.btn-logout:hover {\n  background: var(--color-bordo-hover, #5C0016);\n  color: var(--color-gold, #D4AF37);\n}\n.nav-content {\n  display: flex;\n  align-items: center;\n  gap: 2rem;\n}\n.mobile-toggle {\n  display: none;\n  background: transparent;\n  border: none;\n  color: var(--color-bordo, #7A001E);\n  font-size: 1.5rem;\n  cursor: pointer;\n  padding: 0.5rem;\n  min-width: 44px;\n  min-height: 44px;\n}\n.nav-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n@media (max-width: 860px) {\n  .navbar {\n    flex-direction: column;\n    align-items: stretch;\n    padding: 0.8rem 1rem;\n  }\n  .nav-header {\n    width: 100%;\n  }\n  .mobile-toggle {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    background: var(--bg-cream-base, #F7F3EB);\n    border: 1px solid var(--color-bordo-light);\n    border-radius: var(--radius-sm, 8px);\n    box-shadow: var(--neu-shadow-outer-sm);\n  }\n  .nav-content {\n    display: none;\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n    gap: 1rem;\n    padding-top: 1rem;\n    border-top: 1px solid var(--color-bordo-light);\n    margin-top: 0.5rem;\n  }\n  .nav-content.mobile-open {\n    display: flex;\n  }\n  .nav-links {\n    flex-direction: column;\n    gap: 0.5rem;\n    width: 100%;\n  }\n  .nav-links a {\n    display: block;\n    width: 100%;\n    text-align: center;\n    padding: 0.75rem 1rem;\n    min-height: 44px;\n    line-height: 1.5;\n  }\n  .auth-area {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 0.75rem;\n    width: 100%;\n  }\n  .user-chip {\n    text-align: center;\n  }\n  .btn-logout {\n    min-height: 44px;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=navbar.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarComponent, { className: "NavbarComponent", filePath: "src/app/shared/components/navbar/navbar.component.ts", lineNumber: 13 });
})();

// src/app/shared/components/footer/footer.component.ts
var FooterComponent = class _FooterComponent {
  static \u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], decls: 29, vars: 0, consts: [[1, "footer"], [1, "footer-content"], [1, "author-text"], [1, "social-links"], ["href", "https://www.instagram.com/leomorabito2002/", "target", "_blank", "rel", "noopener noreferrer", 1, "social-link", "instagram"], ["viewBox", "0 0 24 24", 1, "icon"], ["x", "2", "y", "2", "width", "20", "height", "20", "rx", "5", "ry", "5"], ["d", "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"], ["x1", "17.5", "y1", "6.5", "x2", "17.51", "y2", "6.5"], ["href", "https://www.linkedin.com/in/leonardo-morabito/", "target", "_blank", "rel", "noopener noreferrer", 1, "social-link", "linkedin"], ["d", "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"], ["x", "2", "y", "9", "width", "4", "height", "12"], ["cx", "4", "cy", "4", "r", "2"], ["href", "https://github.com/leomorabito02", "target", "_blank", "rel", "noopener noreferrer", 1, "social-link", "github"], ["d", "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"], [1, "thank-you-msg"]], template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "footer", 0)(1, "div", 1)(2, "p", 2);
      \u0275\u0275text(3, " Hecho por ");
      \u0275\u0275elementStart(4, "strong");
      \u0275\u0275text(5, "Leonardo Carmelo Morabito");
      \u0275\u0275elementEnd();
      \u0275\u0275text(6, " para el ");
      \u0275\u0275elementStart(7, "strong");
      \u0275\u0275text(8, "Seminario Mayor de C\xF3rdoba");
      \u0275\u0275elementEnd();
      \u0275\u0275text(9, ". ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 3)(11, "a", 4);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(12, "svg", 5);
      \u0275\u0275element(13, "rect", 6)(14, "path", 7)(15, "line", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275text(16, " Instagram ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(17, "a", 9);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(18, "svg", 5);
      \u0275\u0275element(19, "path", 10)(20, "rect", 11)(21, "circle", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275text(22, " LinkedIn ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(23, "a", 13);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(24, "svg", 5);
      \u0275\u0275element(25, "path", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275text(26, " GitHub ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(27, "p", 15);
      \u0275\u0275text(28, "\xA1Gracias por venir a la pe\xF1a!");
      \u0275\u0275elementEnd()()();
    }
  }, styles: ['\n\n.footer[_ngcontent-%COMP%] {\n  margin-top: auto;\n  padding: 1.75rem 1rem;\n  text-align: center;\n  background: var(--bg-cream-card, #F4EFE6);\n  border-top: 2px solid var(--color-gold, #D4AF37);\n  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.9rem;\n}\n.footer-content[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.75rem;\n}\n.author-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-primary, #2B2325);\n}\n.author-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--color-bordo, #7A001E);\n}\n.social-links[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin: 0.25rem 0;\n}\n.social-link[_ngcontent-%COMP%] {\n  color: var(--color-bordo, #7A001E);\n  text-decoration: none;\n  font-weight: 600;\n  padding: 0.4rem 0.9rem;\n  border-radius: 20px;\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-outer-sm);\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  transition: all 0.2s ease;\n}\n.social-link[_ngcontent-%COMP%]:hover {\n  color: #FFFFFF;\n  background: var(--color-bordo, #7A001E);\n  border-color: var(--color-gold, #D4AF37);\n  transform: translateY(-2px);\n}\n.thank-you-msg[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  font-size: 0.95rem;\n}\n/*# sourceMappingURL=footer.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterComponent, [{
    type: Component,
    args: [{ selector: "app-footer", standalone: true, template: '<footer class="footer">\n  <div class="footer-content">\n    <p class="author-text">\n      Hecho por <strong>Leonardo Carmelo Morabito</strong> para el <strong>Seminario Mayor de C\xF3rdoba</strong>.\n    </p>\n    \n    <div class="social-links">\n      <a href="https://www.instagram.com/leomorabito2002/" target="_blank" rel="noopener noreferrer" class="social-link instagram">\n        <svg class="icon" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> Instagram\n      </a>\n      <a href="https://www.linkedin.com/in/leonardo-morabito/" target="_blank" rel="noopener noreferrer" class="social-link linkedin">\n        <svg class="icon" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn\n      </a>\n      <a href="https://github.com/leomorabito02" target="_blank" rel="noopener noreferrer" class="social-link github">\n        <svg class="icon" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> GitHub\n      </a>\n    </div>\n\n    <p class="thank-you-msg">\xA1Gracias por venir a la pe\xF1a!</p>\n  </div>\n</footer>\n', styles: ['/* src/app/shared/components/footer/footer.component.css */\n.footer {\n  margin-top: auto;\n  padding: 1.75rem 1rem;\n  text-align: center;\n  background: var(--bg-cream-card, #F4EFE6);\n  border-top: 2px solid var(--color-gold, #D4AF37);\n  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.9rem;\n}\n.footer-content {\n  max-width: 800px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.75rem;\n}\n.author-text {\n  margin: 0;\n  color: var(--text-primary, #2B2325);\n}\n.author-text strong {\n  color: var(--color-bordo, #7A001E);\n}\n.social-links {\n  display: flex;\n  gap: 1rem;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin: 0.25rem 0;\n}\n.social-link {\n  color: var(--color-bordo, #7A001E);\n  text-decoration: none;\n  font-weight: 600;\n  padding: 0.4rem 0.9rem;\n  border-radius: 20px;\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-outer-sm);\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  transition: all 0.2s ease;\n}\n.social-link:hover {\n  color: #FFFFFF;\n  background: var(--color-bordo, #7A001E);\n  border-color: var(--color-gold, #D4AF37);\n  transform: translateY(-2px);\n}\n.thank-you-msg {\n  margin: 0;\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  font-size: 0.95rem;\n}\n/*# sourceMappingURL=footer.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/shared/components/footer/footer.component.ts", lineNumber: 9 });
})();

// src/app/core/services/toast.service.ts
var ToastService = class _ToastService {
  toasts = signal([]);
  show(type, title, message, duration = 5e3) {
    const id = crypto.randomUUID();
    const toast = { id, type, title, message, duration };
    this.toasts.update((current) => [...current, toast]);
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }
  success(title, message, duration = 4e3) {
    this.show("success", title, message, duration);
  }
  error(title, message, duration = 6e3) {
    this.show("error", title, message, duration);
  }
  warning(title, message, duration = 5e3) {
    this.show("warning", title, message, duration);
  }
  info(title, message, duration = 4e3) {
    this.show("info", title, message, duration);
  }
  remove(id) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/components/toast-container/toast-container.component.ts
function ToastContainerComponent_div_0_div_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 10);
    \u0275\u0275element(2, "polyline", 11);
    \u0275\u0275elementEnd()();
  }
}
function ToastContainerComponent_div_0_div_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 10);
    \u0275\u0275element(2, "circle", 12)(3, "line", 13)(4, "line", 14);
    \u0275\u0275elementEnd()();
  }
}
function ToastContainerComponent_div_0_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 10);
    \u0275\u0275element(2, "path", 15)(3, "line", 16)(4, "line", 17);
    \u0275\u0275elementEnd()();
  }
}
function ToastContainerComponent_div_0_div_1_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 10);
    \u0275\u0275element(2, "circle", 12)(3, "line", 18)(4, "line", 19);
    \u0275\u0275elementEnd()();
  }
}
function ToastContainerComponent_div_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 4);
    \u0275\u0275template(2, ToastContainerComponent_div_0_div_1_span_2_Template, 3, 0, "span", 5)(3, ToastContainerComponent_div_0_div_1_span_3_Template, 5, 0, "span", 5)(4, ToastContainerComponent_div_0_div_1_span_4_Template, 5, 0, "span", 5)(5, ToastContainerComponent_div_0_div_1_span_5_Template, 5, 0, "span", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 6)(7, "strong", 7);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 8);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 9);
    \u0275\u0275listener("click", function ToastContainerComponent_div_0_div_1_Template_button_click_11_listener() {
      const toast_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toastService.remove(toast_r2.id));
    });
    \u0275\u0275text(12, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    \u0275\u0275property("ngClass", "toast-" + toast_r2.type);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", toast_r2.type === "success");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", toast_r2.type === "error");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", toast_r2.type === "warning");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", toast_r2.type === "info");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(toast_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(toast_r2.message);
  }
}
function ToastContainerComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, ToastContainerComponent_div_0_div_1_Template, 13, 7, "div", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.toastService.toasts());
  }
}
var ToastContainerComponent = class _ToastContainerComponent {
  toastService = inject(ToastService);
  static \u0275fac = function ToastContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastContainerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToastContainerComponent, selectors: [["app-toast-container"]], decls: 1, vars: 1, consts: [["class", "toast-container", 4, "ngIf"], [1, "toast-container"], ["class", "toast-card", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "toast-card", 3, "ngClass"], [1, "toast-icon"], [4, "ngIf"], [1, "toast-body"], [1, "toast-title"], [1, "toast-message"], [1, "btn-close", 3, "click"], ["viewBox", "0 0 24 24", 1, "icon"], ["points", "20 6 9 17 4 12"], ["cx", "12", "cy", "12", "r", "10"], ["x1", "15", "y1", "9", "x2", "9", "y2", "15"], ["x1", "9", "y1", "9", "x2", "15", "y2", "15"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], ["x1", "12", "y1", "16", "x2", "12", "y2", "12"], ["x1", "12", "y1", "8", "x2", "12.01", "y2", "8"]], template: function ToastContainerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, ToastContainerComponent_div_0_Template, 2, 1, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.toastService.toasts().length > 0);
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf], styles: ["\n\n.toast-container[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 24px;\n  right: 24px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 420px;\n  width: calc(100vw - 48px);\n}\n.toast-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 1rem 1.25rem;\n  border-radius: var(--radius-md, 14px);\n  background: var(--bg-cream-card, #F4EFE6);\n  box-shadow: 6px 6px 14px #D8D0C3, -6px -6px 14px #FFFFFF;\n  border-left: 5px solid transparent;\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.toast-icon[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  line-height: 1;\n  margin-top: 2px;\n}\n.toast-body[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.toast-title[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--text-primary, #2B2325);\n  margin-bottom: 2px;\n}\n.toast-message[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-secondary, #665A5D);\n  margin: 0;\n  line-height: 1.4;\n}\n.btn-close[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  font-size: 1.2rem;\n  color: var(--text-muted, #8E8285);\n  cursor: pointer;\n  padding: 0 4px;\n}\n.btn-close[_ngcontent-%COMP%]:hover {\n  color: var(--color-bordo, #7A001E);\n}\n.toast-error[_ngcontent-%COMP%] {\n  border-left-color: #b91c1c;\n}\n.toast-success[_ngcontent-%COMP%] {\n  border-left-color: #15803d;\n}\n.toast-warning[_ngcontent-%COMP%] {\n  border-left-color: #d97706;\n}\n.toast-info[_ngcontent-%COMP%] {\n  border-left-color: #1d4ed8;\n}\n@media (max-width: 480px) {\n  .toast-container[_ngcontent-%COMP%] {\n    left: 16px;\n    right: 16px;\n    bottom: 16px;\n    width: auto;\n  }\n}\n/*# sourceMappingURL=toast-container.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastContainerComponent, [{
    type: Component,
    args: [{ selector: "app-toast-container", standalone: true, imports: [CommonModule], template: `<div class="toast-container" *ngIf="toastService.toasts().length > 0">
  <div
    *ngFor="let toast of toastService.toasts()"
    class="toast-card"
    [ngClass]="'toast-' + toast.type">
    <div class="toast-icon">
      <span *ngIf="toast.type === 'success'"><svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
      <span *ngIf="toast.type === 'error'"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>
      <span *ngIf="toast.type === 'warning'"><svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
      <span *ngIf="toast.type === 'info'"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
    </div>
    <div class="toast-body">
      <strong class="toast-title">{{ toast.title }}</strong>
      <p class="toast-message">{{ toast.message }}</p>
    </div>
    <button (click)="toastService.remove(toast.id)" class="btn-close">&times;</button>
  </div>
</div>
`, styles: ["/* src/app/shared/components/toast-container/toast-container.component.css */\n.toast-container {\n  position: fixed;\n  bottom: 24px;\n  right: 24px;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  max-width: 420px;\n  width: calc(100vw - 48px);\n}\n.toast-card {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 1rem 1.25rem;\n  border-radius: var(--radius-md, 14px);\n  background: var(--bg-cream-card, #F4EFE6);\n  box-shadow: 6px 6px 14px #D8D0C3, -6px -6px 14px #FFFFFF;\n  border-left: 5px solid transparent;\n  animation: slideIn 0.3s ease-out;\n}\n@keyframes slideIn {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.toast-icon {\n  font-size: 1.4rem;\n  line-height: 1;\n  margin-top: 2px;\n}\n.toast-body {\n  flex: 1;\n}\n.toast-title {\n  display: block;\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--text-primary, #2B2325);\n  margin-bottom: 2px;\n}\n.toast-message {\n  font-size: 0.85rem;\n  color: var(--text-secondary, #665A5D);\n  margin: 0;\n  line-height: 1.4;\n}\n.btn-close {\n  background: transparent;\n  border: none;\n  font-size: 1.2rem;\n  color: var(--text-muted, #8E8285);\n  cursor: pointer;\n  padding: 0 4px;\n}\n.btn-close:hover {\n  color: var(--color-bordo, #7A001E);\n}\n.toast-error {\n  border-left-color: #b91c1c;\n}\n.toast-success {\n  border-left-color: #15803d;\n}\n.toast-warning {\n  border-left-color: #d97706;\n}\n.toast-info {\n  border-left-color: #1d4ed8;\n}\n@media (max-width: 480px) {\n  .toast-container {\n    left: 16px;\n    right: 16px;\n    bottom: 16px;\n    width: auto;\n  }\n}\n/*# sourceMappingURL=toast-container.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToastContainerComponent, { className: "ToastContainerComponent", filePath: "src/app/shared/components/toast-container/toast-container.component.ts", lineNumber: 12 });
})();

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  title = "frontend";
  authService = inject(AuthService);
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 5, vars: 0, consts: [[1, "main-content"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-navbar");
      \u0275\u0275elementStart(1, "main", 0);
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "app-footer")(4, "app-toast-container");
    }
  }, dependencies: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent], styles: ["\n\n.main-content[_ngcontent-%COMP%] {\n  flex: 1;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent], template: '<app-navbar></app-navbar>\n<main class="main-content">\n  <router-outlet></router-outlet>\n</main>\n<app-footer></app-footer>\n<app-toast-container></app-toast-container>\n', styles: ["/* src/app/app.component.css */\n.main-content {\n  flex: 1;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 15 });
})();

// node_modules/.pnpm/@angular+common@19.2.25_@angular+core@19.2.25_rxjs@7.8.2_zone.js@0.15.1__rxjs@7.8.2/node_modules/@angular/common/locales/es-AR.js
var u = void 0;
function plural(val) {
  const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, "").length, e = parseInt(val.toString().replace(/^[^e]*(e([-+]?\d+))?/, "$2")) || 0;
  if (n === 1) return 1;
  if (e === 0 && !(i === 0) && i % 1e6 === 0 && v === 0 || !(e >= 0 && e <= 5)) return 4;
  return 5;
}
var es_AR_default = ["es-AR", [["a.\xA0m.", "p.\xA0m."], u, u], u, [["D", "L", "M", "M", "J", "V", "S"], ["dom", "lun", "mar", "mi\xE9", "jue", "vie", "s\xE1b"], ["domingo", "lunes", "martes", "mi\xE9rcoles", "jueves", "viernes", "s\xE1bado"], ["DO", "LU", "MA", "MI", "JU", "VI", "SA"]], u, [["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"], ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]], u, [["a. C.", "d. C."], u, ["antes de Cristo", "despu\xE9s de Cristo"]], 1, [6, 0], ["d/M/yy", "d MMM y", "d 'de' MMMM 'de' y", "EEEE, d 'de' MMMM 'de' y"], ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"], ["{1}, {0}", "{1} {0}", "{1}, {0}", u], [",", ".", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0\xA0%", "\xA4\xA0#,##0.00", "#E0"], "ARS", "$", "peso argentino", {
  "ARS": ["$"],
  "AUD": [u, "$"],
  "BRL": [u, "R$"],
  "BYN": [u, "\u0440."],
  "CAD": [u, "$"],
  "CNY": [u, "\xA5"],
  "ESP": ["\u20A7"],
  "EUR": [u, "\u20AC"],
  "FKP": [u, "FK\xA3"],
  "GBP": [u, "\xA3"],
  "HKD": [u, "$"],
  "ILS": [u, "\u20AA"],
  "INR": [u, "\u20B9"],
  "JPY": [u, "\xA5"],
  "KRW": [u, "\u20A9"],
  "MXN": [u, "$"],
  "NZD": [u, "$"],
  "PHP": [u, "\u20B1"],
  "RON": [u, "L"],
  "SSP": [u, "SD\xA3"],
  "SYP": [u, "S\xA3"],
  "TWD": [u, "NT$"],
  "USD": ["US$", "$"],
  "VEF": [u, "BsF"],
  "VND": [u, "\u20AB"],
  "XAF": [],
  "XCD": [u, "$"],
  "XOF": []
}, "ltr", plural];

// src/app/core/guards/auth.guard.ts
var authGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  return authService.refreshToken().pipe(map((res) => {
    if (res.success && authService.isAuthenticated()) {
      return true;
    }
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }), catchError(() => {
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return of(false);
  }));
};
var guestGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    router.navigate(["/dashboard"]);
    return false;
  }
  return authService.refreshToken().pipe(map((res) => {
    if (res.success && authService.isAuthenticated()) {
      router.navigate(["/dashboard"]);
      return false;
    }
    return true;
  }), catchError(() => {
    return of(true);
  }));
};
var adminGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  }
  router.navigate(["/tickets"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () => import("./chunk-GJHQRE2W.js").then((m) => m.LoginComponent)
  },
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-YOKCCWVP.js").then((m) => m.DashboardComponent)
  },
  {
    path: "tickets",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-SWPGKU4M.js").then((m) => m.TicketListComponent)
  },
  {
    path: "validar-entrada",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-BM3NC5XK.js").then((m) => m.ValidateEntryComponent)
  },
  { path: "quotas", redirectTo: "validar-entrada", pathMatch: "full" },
  {
    path: "admin/users",
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import("./chunk-MXF6HWR3.js").then((m) => m.UserManagementComponent)
  },
  {
    path: "validar-comida",
    canActivate: [authGuard],
    loadComponent: () => import("./chunk-VMMTAHNE.js").then((m) => m.ValidateFoodComponent)
  },
  {
    path: "api/tickets/public/:token",
    loadComponent: () => import("./chunk-OUVGDOWO.js").then((m) => m.PublicTicketViewComponent)
  },
  {
    path: "tickets/public/:token",
    loadComponent: () => import("./chunk-OUVGDOWO.js").then((m) => m.PublicTicketViewComponent)
  },
  { path: "**", redirectTo: "dashboard" }
];

// src/app/core/interceptors/security.interceptor.ts
var securityInterceptor = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    toastService.warning("Sin Conexi\xF3n", "Comprueba tu conexi\xF3n a internet.");
    return throwError(() => new Error("Sin conexi\xF3n a internet"));
  }
  const token = authService.getAccessToken();
  let headersConfig = {
    "X-Requested-With": "XMLHttpRequest",
    "X-Content-Type-Options": "nosniff"
  };
  if (token) {
    headersConfig["Authorization"] = `Bearer ${token}`;
  }
  const secureReq = req.clone({
    setHeaders: headersConfig,
    withCredentials: true
  });
  return next(secureReq).pipe(retry({
    count: 1,
    delay: (error) => {
      if (req.method === "GET" || error.status >= 502 && error.status <= 504) {
        return timer(1e3);
      }
      throw error;
    }
  }), catchError((error) => {
    const isAuthEndpoint = error.url?.includes("/api/auth/refresh") || error.url?.includes("/api/auth/google");
    if (error.status === 401 && !isAuthEndpoint) {
      return authService.handle401Error(req, next);
    }
    let errorMsg = "Ha ocurrido un error inesperado en el servidor.";
    if (error.error && typeof error.error === "object" && error.error.message) {
      errorMsg = error.error.message;
    } else if (error.error && typeof error.error === "object" && error.error.error) {
      errorMsg = error.error.error;
    } else if (typeof error.error === "string") {
      errorMsg = error.error;
    }
    if (error.status >= 500) {
      toastService.error("Error de Servidor", errorMsg);
    } else if (error.status === 403) {
      toastService.error("Acceso Denegado (403)", "No tienes permisos suficientes para realizar esta acci\xF3n.");
    } else if (error.status === 400 || error.status === 409 || error.status === 422) {
      toastService.error("Error de Solicitud", errorMsg);
    }
    return throwError(() => error);
  }));
};

// src/app/core/handlers/global-error.handler.ts
var GlobalErrorHandler = class _GlobalErrorHandler {
  injector;
  zone;
  constructor(injector, zone) {
    this.injector = injector;
    this.zone = zone;
  }
  handleError(error) {
    console.error("Unhandled Application Error:", error);
    const toastService = this.injector.get(ToastService);
    const message = error?.message || "Se ha producido un error inesperado en la aplicaci\xF3n.";
    this.zone.run(() => {
      toastService.error("Error de Aplicaci\xF3n", message);
    });
  }
  static \u0275fac = function GlobalErrorHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GlobalErrorHandler)(\u0275\u0275inject(Injector), \u0275\u0275inject(NgZone));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GlobalErrorHandler, factory: _GlobalErrorHandler.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalErrorHandler, [{
    type: Injectable
  }], () => [{ type: Injector }, { type: NgZone }], null);
})();

// src/app/app.config.ts
registerLocaleData(es_AR_default);
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([securityInterceptor])),
    { provide: LOCALE_ID, useValue: "es-AR" },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: "-0300" } },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/common/locales/es-AR.js:
  (**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.dev/license
   *)
*/
//# sourceMappingURL=main.js.map
