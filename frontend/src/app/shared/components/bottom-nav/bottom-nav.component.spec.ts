import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BottomNavComponent } from './bottom-nav.component';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

describe('BottomNavComponent', () => {
  let component: BottomNavComponent;
  let fixture: ComponentFixture<BottomNavComponent>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser'], {
      isAuthenticated: signal(true),
      isAdmin: signal(false),
      currentUser: signal({ role: 'SELLER' })
    });

    await TestBed.configureTestingModule({
      imports: [BottomNavComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit openQuickSale when onQuickSaleClick is called', () => {
    spyOn(component.openQuickSale, 'emit');
    component.onQuickSaleClick();
    expect(component.openQuickSale.emit).toHaveBeenCalled();
  });

  it('should check if route is current', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/dashboard');
    expect(component.isCurrentRoute('/dashboard')).toBeTrue();
    expect(component.isCurrentRoute('/tickets')).toBeFalse();
  });
});
