import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { ApiResponse, TokenResponse } from '../../../core/models/api.models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firebaseAuthServiceSpy: jasmine.SpyObj<FirebaseAuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['googleLogin', 'logout', 'isAuthenticated']);
    firebaseAuthServiceSpy = jasmine.createSpyObj('FirebaseAuthService', ['signInWithGoogle']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FirebaseAuthService, useValue: firebaseAuthServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/tickets' }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box Testing: Component creation & Initial State
  it('should create LoginComponent with clean initial state', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalse();
    expect(component.actionType).toBeNull();
    expect(component.errorMessage).toBe('');
  });

  // Black-Box & State Transition: Successful Google Sign In
  it('should process Google Sign In and navigate to returnUrl on success', fakeAsync(() => {
    firebaseAuthServiceSpy.signInWithGoogle.and.resolveTo('fake-google-id-token');
    authServiceSpy.googleLogin.and.returnValue(
      of({
        success: true,
        data: {
          access_token: 'valid-token',
          user: { id: 'u1', email: 'test@example.com', name: 'Test', role: 'SELLER', status: 'ACTIVE' }
        }
      } as ApiResponse<TokenResponse>)
    );

    component.onGoogleSignIn('login');
    expect(component.loading).toBeTrue();
    expect(component.actionType).toBe('login');

    tick(100);
    expect(firebaseAuthServiceSpy.signInWithGoogle).toHaveBeenCalled();
    expect(authServiceSpy.googleLogin).toHaveBeenCalledWith('fake-google-id-token');

    tick(800);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/tickets');
    expect(component.loading).toBeFalse();
  }));

  // Black-Box & State Transition: Pending User Approval
  it('should navigate to /pending-approval when user status is PENDING', fakeAsync(() => {
    firebaseAuthServiceSpy.signInWithGoogle.and.resolveTo('fake-google-id-token');
    authServiceSpy.googleLogin.and.returnValue(
      of({
        success: true,
        data: {
          access_token: 'valid-token',
          user: { id: 'u1', email: 'pending@example.com', name: 'Pending User', role: 'SELLER', status: 'PENDING' }
        }
      } as ApiResponse<TokenResponse>)
    );

    component.onGoogleSignIn('login');
    tick(100);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pending-approval'], {
      queryParams: { email: 'pending@example.com', name: 'Pending User' }
    });
  }));

  // White-Box Testing: Firebase Popup Closed Error Handling
  it('should show user-friendly error when Firebase popup is closed by user', fakeAsync(() => {
    firebaseAuthServiceSpy.signInWithGoogle.and.rejectWith({ code: 'auth/popup-closed-by-user' });

    component.onGoogleSignIn('login');
    tick(100);

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('El inicio de sesión fue cancelado.');
  }));
});
