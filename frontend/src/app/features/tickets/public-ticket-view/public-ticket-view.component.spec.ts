import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PublicTicketViewComponent } from './public-ticket-view.component';
import { ApiService, PublicTicket } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


describe('PublicTicketViewComponent', () => {
  let component: PublicTicketViewComponent;
  let fixture: ComponentFixture<PublicTicketViewComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let titleSpy: jasmine.SpyObj<Title>;
  let metaSpy: jasmine.SpyObj<Meta>;
  let mockRoute: any;

  const mockPublicTicket: PublicTicket = {
    ticket_number: 123,
    four_digit_code: '4567',
    ticket_type: 'SIMPLE',
    status: 'VENDIDO',
    sale_source: 'ANTICIPADA',
    seller_name: 'John Doe',
    created_at: '2026-09-10T10:00:00Z',
    buyer_name: 'Jane Doe',
    public_token: 'valid-token',
    price_paid: 3000,
    includes_food: false
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getPublicTicketRaw']);
    titleSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaSpy = jasmine.createSpyObj('Meta', ['updateTag']);

    mockRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'valid-token'
        }
      }
    };

    apiServiceSpy.getPublicTicketRaw.and.returnValue(of({ success: true, data: mockPublicTicket }));

    await TestBed.configureTestingModule({
      imports: [PublicTicketViewComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Title, useValue: titleSpy },
        { provide: Meta, useValue: metaSpy },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicTicketViewComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization and Data Loading', () => {
    it('should initialize and fetch ticket if token is present', () => {
      fixture.detectChanges(); // calls ngOnInit
      expect(component.currentToken()).toBe('valid-token');
      expect(apiServiceSpy.getPublicTicketRaw).toHaveBeenCalledWith('valid-token');
      expect(component.ticket()).toEqual(mockPublicTicket);
      expect(component.loading()).toBeFalse();
      expect(component.isRateLimited()).toBeFalse();
      expect(titleSpy.setTitle).toHaveBeenCalledWith('LA PEÑA DEL SEMI - Entrada Digital #123');
      expect(metaSpy.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: 'LA PEÑA DEL SEMI - Entrada Digital #123' });
    });

    it('should handle missing token in url', () => {
      mockRoute.snapshot.paramMap.get = () => null;
      fixture.detectChanges();
      expect(component.errorMessage()).toContain('no proporcionado');
      expect(apiServiceSpy.getPublicTicketRaw).not.toHaveBeenCalled();
      expect(component.loading()).toBeFalse();
    });

    it('should handle normal error when fetching ticket', () => {
      apiServiceSpy.getPublicTicketRaw.and.returnValue(throwError(() => ({ error: { error: 'Not found' } })));
      fixture.detectChanges();
      expect(component.errorMessage()).toBe('Not found');
      expect(component.loading()).toBeFalse();
    });
  });

  describe('Rate Limiting', () => {
    it('should handle 429 error and start countdown', fakeAsync(() => {
      const headers = new HttpHeaders({ 'Retry-After': '2' });
      apiServiceSpy.getPublicTicketRaw.and.returnValue(throwError(() => ({ status: 429, headers })));
      
      fixture.detectChanges(); // triggers fetchTicket
      
      expect(component.isRateLimited()).toBeTrue();
      expect(component.retryAfterSeconds()).toBe(2);
      
      tick(1000);
      expect(component.retryAfterSeconds()).toBe(1);
      
      // when reaches 0 it refetches
      apiServiceSpy.getPublicTicketRaw.and.returnValue(of({ success: true, data: mockPublicTicket }));
      tick(1000);
      
      expect(component.retryAfterSeconds()).toBe(0);
      expect(component.isRateLimited()).toBeFalse();
      expect(apiServiceSpy.getPublicTicketRaw).toHaveBeenCalledTimes(2);
      
      component.ngOnDestroy(); // cleanup
    }));

    it('should fallback to 60 seconds if header is missing or invalid', fakeAsync(() => {
      apiServiceSpy.getPublicTicketRaw.and.returnValue(throwError(() => ({ status: 429 })));
      fixture.detectChanges();
      
      expect(component.isRateLimited()).toBeTrue();
      expect(component.retryAfterSeconds()).toBe(60);
      
      component.ngOnDestroy();
    }));
  });

  describe('User Actions', () => {
    it('should copy url', fakeAsync(() => {
      const mockClipboard = { writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve()) };
      Object.defineProperty(navigator, 'clipboard', { value: mockClipboard, configurable: true });
      
      component.copyUrl();
      tick(2500);
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith(window.location.href);
      expect(component.copiedUrl()).toBeFalse(); // resets after timeout
    }));

    it('should print ticket', () => {
      spyOn(window, 'print');
      component.printTicket();
      expect(window.print).toHaveBeenCalled();
    });

    it('should not retry now if timer is > 0', () => {
      component.retryAfterSeconds.set(10);
      component.currentToken.set('token');
      apiServiceSpy.getPublicTicketRaw.calls.reset();
      
      component.retryNow();
      
      expect(apiServiceSpy.getPublicTicketRaw).not.toHaveBeenCalled();
    });

    it('should retry now if timer is 0', () => {
      component.retryAfterSeconds.set(0);
      component.currentToken.set('valid-token');
      apiServiceSpy.getPublicTicketRaw.calls.reset();
      
      component.retryNow();
      
      expect(apiServiceSpy.getPublicTicketRaw).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('Cleanup', () => {
    it('should clear countdown on destroy', fakeAsync(() => {
      apiServiceSpy.getPublicTicketRaw.and.returnValue(throwError(() => ({ status: 429 })));
      fixture.detectChanges();
      
      expect(component['countdownTimer']).not.toBeNull();
      component.ngOnDestroy();
      expect(component['countdownTimer']).toBeNull();
    }));
  });
});
