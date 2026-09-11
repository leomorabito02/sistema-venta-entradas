import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickSaleDrawerComponent } from './quick-sale-drawer.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { of } from 'rxjs';
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
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getSellerQuota', 'createTicket']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'warning', 'error']);

    authServiceSpy.currentUser.and.returnValue(mockUser);
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

  // Black-Box Testing: Quota loading on drawer open
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

  // Black-Box Testing: Form validation warning
  it('should show warning toast if required fields are missing on submit', () => {
    component.firstName = '';
    component.lastName = 'Doe';
    component.phone = '123456';

    component.submitSale();

    expect(toastServiceSpy.warning).toHaveBeenCalledWith('Por favor completa Nombre, Apellido y Teléfono');
    expect(apiServiceSpy.createTicket).not.toHaveBeenCalled();
  });

  // Black-Box & State Transition: Successful quick sale submission
  it('should submit sale and emit ticketCreated event on success', () => {
    apiServiceSpy.createTicket.and.returnValue(of({ success: true, data: mockTicket }));
    spyOn(component.ticketCreated, 'emit');

    component.firstName = 'Juan';
    component.lastName = 'Perez';
    component.phone = '3511234567';
    component.countryCode = '54';

    component.submitSale();

    expect(apiServiceSpy.createTicket).toHaveBeenCalledWith({
      ticket_type: 'SIMPLE',
      sale_source: 'ANTICIPADA',
      quota_source: 'PERSONAL',
      first_name: 'Juan',
      last_name: 'Perez',
      phone: '+543511234567',
      email: undefined
    });
    expect(toastServiceSpy.success).toHaveBeenCalledWith('¡Entrada generada con éxito!');
    expect(component.ticketCreated.emit).toHaveBeenCalledWith(mockTicket);
  });

  // White-Box Testing: WhatsApp Link Formatting
  it('should construct correct WhatsApp share URL with 549 country prefix for Argentina', () => {
    component.createdTicket = mockTicket;
    component.phone = '3511234567';
    component.countryCode = '54';

    const waLink = component.getWhatsAppLink();
    expect(waLink).toContain('wa.me/5493511234567');
    expect(decodeURIComponent(waLink)).toContain('Código de Entrada: 5555');
  });
});
