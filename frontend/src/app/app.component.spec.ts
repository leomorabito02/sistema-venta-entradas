import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { QuickSaleService } from './core/services/quick-sale.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quickSaleServiceSpy: jasmine.SpyObj<QuickSaleService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: signal(true),
      isAdmin: signal(false),
      currentUser: signal({ role: 'SELLER' })
    });
    
    quickSaleServiceSpy = jasmine.createSpyObj('QuickSaleService', ['open', 'close', 'notifyTicketCreated'], {
      isOpen: signal(false)
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: QuickSaleService, useValue: quickSaleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
    expect(component.title).toEqual('frontend');
  });

  it('should open quick sale drawer', () => {
    component.openQuickSaleDrawer();
    expect(quickSaleServiceSpy.open).toHaveBeenCalled();
  });

  it('should close quick sale drawer', () => {
    component.closeQuickSaleDrawer();
    expect(quickSaleServiceSpy.close).toHaveBeenCalled();
  });

  it('should notify ticket created', () => {
    component.onTicketCreated();
    expect(quickSaleServiceSpy.notifyTicketCreated).toHaveBeenCalled();
  });
});
