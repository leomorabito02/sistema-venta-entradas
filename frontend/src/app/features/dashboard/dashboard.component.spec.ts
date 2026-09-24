import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { QuickSaleService } from '../../core/services/quick-sale.service';
import { ToastService } from '../../core/services/toast.service';
import { of, throwError, Subject } from 'rxjs';
import { Ticket, User } from '../../core/models/api.models';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quickSaleServiceSpy: jasmine.SpyObj<QuickSaleService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockAdminUser: User = {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    status: 'ACTIVE'
  };

  const mockSellerUser: User = {
    id: 'seller-1',
    email: 'seller@example.com',
    name: 'Seller User',
    role: 'SELLER',
    status: 'ACTIVE'
  };

  const mockTickets: Ticket[] = [
    {
      id: 't1',
      ticketNumber: 1,
      publicToken: 'p1',
      fourDigitCode: '1111',
      ticketType: 'SIMPLE',
      saleSource: 'ANTICIPADA',
      quotaSource: 'PERSONAL',
      pricePaid: 3000,
      status: 'VENDIDO',
      sellerId: 'seller-1',
      sellerName: 'Seller One',
      buyerName: 'Buyer A',
      createdAt: '2026-09-10T10:00:00Z'
    },
    {
      id: 't2',
      ticketNumber: 2,
      publicToken: 'p2',
      fourDigitCode: '2222',
      ticketType: 'CON_COMIDA',
      saleSource: 'PUERTA',
      quotaSource: undefined,
      pricePaid: 5000,
      status: 'USADO_COMIDA',
      sellerId: 'seller-2',
      sellerName: 'Seller Two',
      buyerName: 'Buyer B',
      createdAt: '2026-09-10T11:00:00Z'
    },
    {
      id: 't3',
      ticketNumber: 3,
      publicToken: 'p3',
      fourDigitCode: '3333',
      ticketType: 'CON_COMIDA',
      saleSource: 'ANTICIPADA',
      quotaSource: 'LIBRE',
      pricePaid: 5000,
      status: 'USADO_ENTRADA',
      sellerId: 'seller-1',
      sellerName: 'Seller One',
      buyerName: 'Buyer C',
      createdAt: '2026-09-10T12:00:00Z'
    },
    {
      id: 't4',
      ticketNumber: 4,
      publicToken: 'p4',
      fourDigitCode: '4444',
      ticketType: 'SIMPLE',
      saleSource: 'PUERTA',
      quotaSource: undefined,
      pricePaid: 3000,
      status: 'ANULADO',
      sellerId: 'seller-1',
      sellerName: 'Seller One',
      buyerName: 'Buyer D',
      createdAt: '2026-09-10T13:00:00Z'
    },
    {
      id: 't5',
      ticketNumber: 5,
      publicToken: 'p5',
      fourDigitCode: '5555',
      ticketType: 'SIMPLE',
      saleSource: 'PUERTA',
      quotaSource: undefined,
      pricePaid: 3000,
      status: 'USADO_ENTRADA',
      sellerId: 'seller-2',
      sellerName: 'Seller Two',
      buyerName: 'Buyer E',
      createdAt: '2026-09-10T14:00:00Z'
    }
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getTicketPrices',
      'listUsers',
      'listTickets',
      'getSellerQuota',
      'createTicket',
      'updateTicketPrice',
      'validateTicket'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'currentUser']);
    quickSaleServiceSpy = jasmine.createSpyObj('QuickSaleService', ['open']);
    (quickSaleServiceSpy as any).ticketCreated$ = new Subject<void>();
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    authServiceSpy.isAdmin.and.returnValue(true);
    authServiceSpy.currentUser.and.returnValue(mockAdminUser);

    apiServiceSpy.getTicketPrices.and.returnValue(of({ success: true, data: [{ ticket_type: 'SIMPLE', price: 3000 }, { ticket_type: 'CON_COMIDA', price: 5000 }] }));
    apiServiceSpy.listUsers.and.returnValue(of({ success: true, data: [mockAdminUser, mockSellerUser] }));
    apiServiceSpy.listTickets.and.returnValue(of({ success: true, data: mockTickets }));
    apiServiceSpy.getSellerQuota.and.returnValue(of({ success: true, data: { assigned_quota: 10, used_quota: 2, assigned_free_quota: 5, used_free_quota: 1 } }));
    apiServiceSpy.updateTicketPrice.and.returnValue(of({ success: true }));
    apiServiceSpy.createTicket.and.returnValue(of({ success: true, data: { ...mockTickets[0], public_token: 'new-token' } }));
    apiServiceSpy.validateTicket.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: QuickSaleService, useValue: quickSaleServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization and Data Loading', () => {
    it('should load tickets and calculate correct dashboard statistics on init for admin', () => {
      expect(component.tickets()).toHaveSize(5);
      const stats = component.stats();
      
      // Valid tickets count = 4 (1 annulled: t4)
      expect(stats.totalIssued).toBe(4);
      expect(stats.totalRevenue).toBe(16000); // 3000(t1) + 5000(t2) + 5000(t3) + 3000(t5)
      expect(stats.ticketsSimpleCount).toBe(2); // t1, t5
      expect(stats.ticketsConComidaCount).toBe(2); // t2, t3
      expect(stats.anticipadaCount).toBe(2); // t1, t3
      expect(stats.puertaCount).toBe(2); // t2, t5
      expect(stats.annulledCount).toBe(1); // t4
      expect(stats.annulledRevenue).toBe(3000);
      expect(stats.entriesUsedCount).toBe(3); // t2, t3, t5
      expect(stats.foodPendingCount).toBe(1); // t3
      expect(stats.foodDeliveredCount).toBe(1); // t2
    });

    it('should handle API errors during loadData for admin', () => {
      apiServiceSpy.listTickets.and.returnValue(throwError(() => ({ error: { error: 'Admin Error' } })));
      component.loadData();
      expect(component.errorMessage()).toBe('Admin Error');
    });

    it('should load tickets for seller when not admin', () => {
      authServiceSpy.isAdmin.and.returnValue(false);
      authServiceSpy.currentUser.and.returnValue(mockSellerUser);
      apiServiceSpy.listTickets.and.returnValue(of({ success: true, data: [mockTickets[0]] }));
      
      component.loadData();
      
      expect(apiServiceSpy.listTickets).toHaveBeenCalledWith('seller-1');
      expect(component.tickets()).toHaveSize(1);
    });

    it('should handle API errors during loadData for seller', () => {
      authServiceSpy.isAdmin.and.returnValue(false);
      authServiceSpy.currentUser.and.returnValue(mockSellerUser);
      apiServiceSpy.listTickets.and.returnValue(throwError(() => ({ error: { error: 'Seller Error' } })));
      
      component.loadData();
      
      expect(component.errorMessage()).toBe('Seller Error');
    });

    it('should react to ticketCreated$ event', () => {
      spyOn(component, 'loadData');
      quickSaleServiceSpy.ticketCreated$.next();
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('Filters and Ranking', () => {
    it('should filter tickets by selectedSellerId', () => {
      component.selectedSellerId.set('seller-1');
      const filtered = component.filteredTickets();
      expect(filtered.every(t => t.sellerId === 'seller-1')).toBeTrue();
    });

    it('should update seller filter on select change', () => {
      const event = { target: { value: 'seller-2' } } as any;
      component.onSellerFilterChange(event);
      expect(component.selectedSellerId()).toBe('seller-2');
    });

    it('should calculate seller ranking correctly, ignoring annulled', () => {
      const ranking = component.sellerRanking();
      expect(ranking).toHaveSize(2);
      
      const s1 = ranking.find(r => r.sellerId === 'seller-1');
      const s2 = ranking.find(r => r.sellerId === 'seller-2');
      
      expect(s1?.totalIssued).toBe(2); // t1, t3 (t4 annulled)
      expect(s2?.totalIssued).toBe(2); // t2, t5
    });
  });

  describe('Prices Management', () => {
    it('should save prices successfully', () => {
      component.priceSimple.set(4000);
      component.priceConComida.set(6000);
      component.onSavePrices();
      
      expect(apiServiceSpy.updateTicketPrice).toHaveBeenCalledWith({ ticket_type: 'SIMPLE', price: 4000 });
      expect(apiServiceSpy.updateTicketPrice).toHaveBeenCalledWith({ ticket_type: 'CON_COMIDA', price: 6000 });
      expect(component.priceSuccessMessage()).toContain('correctamente');
    });

    it('should handle error when updating simple price', () => {
      apiServiceSpy.updateTicketPrice.and.callFake((req) => {
        if (req.ticket_type === 'SIMPLE') return throwError(() => ({ error: { error: 'Simple Price Error' } }));
        return of({ success: true });
      });
      
      component.onSavePrices();
      
      expect(component.priceErrorMessage()).toBe('Simple Price Error');
    });

    it('should handle error when updating con_comida price', () => {
      apiServiceSpy.updateTicketPrice.and.callFake((req) => {
        if (req.ticket_type === 'CON_COMIDA') return throwError(() => ({ error: { error: 'Comida Price Error' } }));
        return of({ success: true });
      });
      
      component.onSavePrices();
      
      expect(component.priceErrorMessage()).toBe('Comida Price Error');
    });
  });

  describe('Modal and Issuance', () => {
    it('should open quick sale drawer if window is small', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(500);
      component.openIssueModal();
      expect(quickSaleServiceSpy.open).toHaveBeenCalled();
    });

    it('should open issue modal and load quotas', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(1000);
      component.openIssueModal();
      
      expect(component.showIssueModal()).toBeTrue();
      expect(apiServiceSpy.getSellerQuota).toHaveBeenCalledWith('admin-1');
      expect(component.personalQuotaAvailable()).toBe(8); // 10 - 2
      expect(component.globalFreeQuotaAvailable()).toBe(4); // 5 - 1
    });

    it('should close issue modal', () => {
      component.showIssueModal.set(true);
      component.closeIssueModal();
      expect(component.showIssueModal()).toBeFalse();
    });

    it('should navigate steps and validate step 3', () => {
      component.buyerFirstName.set('');
      component.goToStep(3);
      expect(component.issueErrorMessage()).toContain('requeridos');
      expect(component.issueStep()).not.toBe(3);

      component.buyerFirstName.set('John');
      component.buyerLastName.set('Doe');
      component.buyerPhone.set('123456');
      component.goToStep(3);
      expect(component.issueErrorMessage()).toBe('');
      expect(component.issueStep()).toBe(3);
    });

    it('should handle custom country code', () => {
      component.buyerCountryCode.set('custom');
      component.buyerCustomCountryCode.set('+55a');
      expect(component.getEffectiveBuyerCountryCode()).toBe('55');
    });

    it('should submit ticket successfully', () => {
      component.buyerPhone.set('123-456');
      component.quotaOption.set('PERSONAL');
      component.submitIssueTicket();
      
      expect(apiServiceSpy.createTicket).toHaveBeenCalled();
      expect(component.createdTicket()).toBeDefined();
      expect(component.issueStep()).toBe(4);
    });

    it('should submit ticket error handling', () => {
      apiServiceSpy.createTicket.and.returnValue(throwError(() => ({ error: { error: 'Creation Error' } })));
      component.submitIssueTicket();
      expect(component.issueErrorMessage()).toBe('Creation Error');
    });

    it('should authorize modal entry successfully', () => {
      component.createdTicket.set({ public_token: '123' });
      component.authorizeModalEntryNow();
      
      expect(apiServiceSpy.validateTicket).toHaveBeenCalledWith({ public_token: '123', validation_type: 'ENTRADA' });
      expect(toastServiceSpy.success).toHaveBeenCalled();
      expect(component.createdTicket().status).toBe('USADO_ENTRADA');
    });

    it('should handle authorize modal entry failure', () => {
      apiServiceSpy.validateTicket.and.returnValue(throwError(() => ({ error: { error: 'Validation Error' } })));
      component.createdTicket.set({ public_token: '123' });
      component.authorizeModalEntryNow();
      
      expect(toastServiceSpy.error).toHaveBeenCalledWith('Validation Error');
    });
  });

  describe('Ticket Details and Utilities', () => {
    it('should open and close detail modal', () => {
      component.openDetail(mockTickets[0]);
      expect(component.selectedTicket()).toEqual(mockTickets[0]);
      expect(component.showDetailModal()).toBeTrue();

      component.closeDetail();
      expect(component.selectedTicket()).toBeNull();
      expect(component.showDetailModal()).toBeFalse();
    });

    it('should format status and type', () => {
      expect(component.formatStatus('USADO_ENTRADA')).toBe('USADO ENTRADA');
      expect(component.formatStatus()).toBe('');
      expect(component.formatType('CON_COMIDA')).toBe('CON COMIDA');
      expect(component.formatType()).toBe('');
    });

    it('should authorize detail entry successfully', () => {
      component.selectedTicket.set(mockTickets[0]);
      component.authorizeDetailEntryNow();
      
      expect(apiServiceSpy.validateTicket).toHaveBeenCalledWith({ public_token: mockTickets[0].publicToken, validation_type: 'ENTRADA' });
      expect(toastServiceSpy.success).toHaveBeenCalled();
      expect(component.selectedTicket()?.status).toBe('USADO_ENTRADA');
    });
    
    it('should copy urls without crashing', fakeAsync(() => {
      // Avoid double spying by checking if writeText is a spy
      const navClipboard = navigator.clipboard as any;
      if (!jasmine.isSpy(navClipboard.writeText)) {
        spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
      } else {
        navClipboard.writeText.and.returnValue(Promise.resolve());
        navClipboard.writeText.calls.reset();
      }
      component.copyTicketUrl(mockTickets[0]);
      tick(2500); // Flush timeout
      
      component.createdTicket.set({ public_url: '/test' });
      component.copyPublicUrl();
      tick(2500); // Flush timeout
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
    }));
  });
});
