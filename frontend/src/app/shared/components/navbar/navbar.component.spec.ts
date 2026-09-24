import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      isAuthenticated: signal(false),
      isAdmin: signal(false),
      currentUser: signal(null)
    });
    authServiceSpy.logout.and.returnValue(of({ success: true, data: null }));

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    expect(component.menuOpen()).toBeFalse();
    
    component.toggleMenu();
    expect(component.menuOpen()).toBeTrue();
    
    component.toggleMenu();
    expect(component.menuOpen()).toBeFalse();
  });

  it('should close menu', () => {
    component.menuOpen.set(true);
    component.closeMenu();
    expect(component.menuOpen()).toBeFalse();
  });

  it('should call logout on onLogout', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
