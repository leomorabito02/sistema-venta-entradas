import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuickSaleDrawerComponent } from './quick-sale-drawer.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { of, throwError } from 'rxjs';
import { Ticket, User } from '../../../core/models/api.models';

describe('QuickSaleDrawerComponent', () => {
  let component: QuickSaleDrawerComponent;
  let fixture: ComponentFixture<QuickSaleDrawerComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockUser: User = {
    id: 'seller-id-1',
    email: 'seller@example.com',
    name: 'Seller User',
    role: 'SELLER',
    status: 'ACTIVE'
  };

  const mockTicket: Ticket = {
    id: 't-qs-1',
    ticketNumber: 202,
    publicToken: 'qs-token-99',
    fourDigitCode: '5555',
    ticketType: 'SIMPLE',
    saleSource: 'ANTICIPADA',
    quotaSource: 'PERSONAL',
    pricePaid: 3000,
    status: 'VENDIDO',
    sellerId: 'seller-id-1',
    sellerName: 'Seller User',
    buyerName: 'Quick Buyer',
    createdAt: '2026-09-10T10:00:00Z'
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getSellerQuota', 'createTicket', 'validateTicket', 'getTicketPrices']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'warning', 'error']);

    authServiceSpy.currentUser.and.returnValue(mockUser);
    apiServiceSpy.getTicketPrices.and.returnValue(
      of({
        success: true,
        data: [
          { id: '1', ticket_type: 'SIMPLE', price: 3000, updated_at: '2026-09-01T00:00:00Z' },
          { id: '2', ticket_type: 'CON_COMIDA', price: 5000, updated_at: '2026-09-01T00:00:00Z' }
        ]
      })
    );
    apiServiceSpy.getSellerQuota.and.returnValue(
      of({
        success: true,
        data: {
          seller_id: 'seller-id-1',
          seller_name: 'Seller User',
          assigned_quota: 10,
          used_quota: 2,
          available_quota: 8,
          assigned_free_quota: 5,
          used_free_quota: 1,
          available_free_quota: 4
        }
      })
    );
    apiServiceSpy.createTicket.and.returnValue(of({ success: true, data: mockTicket }));
    apiServiceSpy.validateTicket.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [QuickSaleDrawerComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickSaleDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Lifecycle and Selections', () => {
    it('should load seller quota summary when drawer opens', () => {
      component.isOpen = true;
      component.ngOnChanges({
        isOpen: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(apiServiceSpy.getSellerQuota).toHaveBeenCalledWith('seller-id-1');
      expect(component.personalQuotaRemaining()).toBe(8);
      expect(component.freeQuotaRemaining()).toBe(4);
    });

    it('should select ticket type', () => {
      component.selectTicketType('CON_COMIDA');
      expect(component.ticketType).toBe('CON_COMIDA');
    });

    it('should select sale source', () => {
      component.selectSaleSource('PUERTA');
      expect(component.saleSource).toBe('PUERTA');
    });

    it('should select quota source', () => {
      component.selectQuotaSource('LIBRE');
      expect(component.quotaSource).toBe('LIBRE');
    });

    it('should reset form and emit close event on onClose', () => {
      spyOn(component.closeDrawer, 'emit');
      component.onClose();
      
      expect(component.closeDrawer.emit).toHaveBeenCalled();
      expect(component.firstName).toBe('');
    });

    it('should calculate effective country code correctly', () => {
      component.countryCode = '54';
      expect(component.getEffectiveCountryCode()).toBe('54');

      component.countryCode = 'custom';
      component.customCountryCode = '+55a';
      expect(component.getEffectiveCountryCode()).toBe('55');
    });
  });

  describe('Sale Submission', () => {
    it('should show warning toast if required fields are missing on submit', () => {
      component.firstName = '';
      component.lastName = 'Doe';
      component.phone = '123456';

      component.submitSale();

      expect(toastServiceSpy.warning).toHaveBeenCalledWith('Por favor completa Nombre, Apellido y Teléfono');
      expect(apiServiceSpy.createTicket).not.toHaveBeenCalled();
    });

    it('should submit sale successfully', () => {
      spyOn(component.ticketCreated, 'emit');

      component.firstName = 'Juan';
      component.lastName = 'Perez';
      component.phone = '3511234567';
      component.countryCode = '54';
      component.email = 'test@example.com';

      component.submitSale();

      expect(apiServiceSpy.createTicket).toHaveBeenCalledWith({
        ticket_type: 'SIMPLE',
        sale_source: 'ANTICIPADA',
        quota_source: 'PERSONAL',
        first_name: 'Juan',
        last_name: 'Perez',
        phone: '+543511234567',
        email: 'test@example.com'
      });
      expect(toastServiceSpy.success).toHaveBeenCalledWith('¡Entrada generada con éxito!');
      expect(component.ticketCreated.emit).toHaveBeenCalledWith(mockTicket);
    });

    it('should handle submit sale error', () => {
      apiServiceSpy.createTicket.and.returnValue(throwError(() => ({ error: { error: 'Creation Error' } })));
      
      component.firstName = 'Juan';
      component.lastName = 'Perez';
      component.phone = '3511234567';

      component.submitSale();

      expect(toastServiceSpy.error).toHaveBeenCalledWith('Creation Error');
    });
  });

  describe('Ticket Utilities', () => {
    it('should authorize entry now successfully', () => {
      spyOn(component.ticketCreated, 'emit');
      component.createdTicket = { ...mockTicket, status: 'VENDIDO' };
      
      component.authorizeEntryNow();

      expect(apiServiceSpy.validateTicket).toHaveBeenCalledWith({
        public_token: 'qs-token-99',
        validation_type: 'ENTRADA'
      });
      expect(component.createdTicket.status).toBe('USADO_ENTRADA');
      expect(toastServiceSpy.success).toHaveBeenCalledWith('¡Ingreso autorizado y registrado con éxito!');
      expect(component.ticketCreated.emit).toHaveBeenCalled();
    });

    it('should handle authorize entry error', () => {
      apiServiceSpy.validateTicket.and.returnValue(throwError(() => ({ error: { error: 'Validation Error' } })));
      component.createdTicket = { ...mockTicket };
      
      component.authorizeEntryNow();

      expect(toastServiceSpy.error).toHaveBeenCalledWith('Validation Error');
    });

    it('should construct correct WhatsApp share URL for Argentina', () => {
      component.createdTicket = mockTicket;
      component.phone = '3511234567';
      component.countryCode = '54';

      const waLink = component.getWhatsAppLink();
      expect(waLink).toContain('wa.me/5493511234567');
      expect(decodeURIComponent(waLink)).toContain('Código de Entrada: 5555');
    });

    it('should handle whatsapp link for non-54 codes', () => {
      component.createdTicket = mockTicket;
      component.phone = '3511234567';
      component.countryCode = '55';

      const waLink = component.getWhatsAppLink();
      expect(waLink).toContain('wa.me/553511234567');
    });

    it('should copy ticket link to clipboard successfully', fakeAsync(() => {
      component.createdTicket = mockTicket;
      const mockClipboard = { writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve()) };
      Object.defineProperty(navigator, 'clipboard', { value: mockClipboard, configurable: true });

      component.copyTicketLink();
      tick();

      expect(mockClipboard.writeText).toHaveBeenCalled();
      expect(toastServiceSpy.success).toHaveBeenCalledWith('¡Enlace copiado al portapapeles!');
    }));

    it('should fallback copy if clipboard fails', fakeAsync(() => {
      component.createdTicket = mockTicket;
      const mockClipboard = { writeText: jasmine.createSpy('writeText').and.returnValue(Promise.reject()) };
      Object.defineProperty(navigator, 'clipboard', { value: mockClipboard, configurable: true });
      spyOn(document, 'execCommand').and.returnValue(true);

      component.copyTicketLink();
      tick();

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(toastServiceSpy.success).toHaveBeenCalledWith('¡Enlace copiado al portapapeles!');
    }));
  });
});

