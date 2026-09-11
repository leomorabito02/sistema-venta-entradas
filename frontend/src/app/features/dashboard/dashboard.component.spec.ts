import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { QuickSaleService } from '../../core/services/quick-sale.service';
import { of, Subject } from 'rxjs';
import { Ticket, User } from '../../core/models/api.models';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quickSaleServiceSpy: jasmine.SpyObj<QuickSaleService>;

  const mockAdminUser: User = {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
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
    }
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getTicketPrices',
      'listUsers',
      'listTickets',
      'getSellerQuota',
      'createTicket',
      'updateTicketPrice'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'currentUser']);
    quickSaleServiceSpy = jasmine.createSpyObj('QuickSaleService', ['open']);
    (quickSaleServiceSpy as any).ticketCreated$ = new Subject<void>();

    authServiceSpy.isAdmin.and.returnValue(true);
    authServiceSpy.currentUser.and.returnValue(mockAdminUser);

    apiServiceSpy.getTicketPrices.and.returnValue(of({ success: true, data: [] }));
    apiServiceSpy.listUsers.and.returnValue(of({ success: true, data: [mockAdminUser] }));
    apiServiceSpy.listTickets.and.returnValue(of({ success: true, data: mockTickets }));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: QuickSaleService, useValue: quickSaleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box Testing: Initialization and Ticket Data Loading
  it('should load tickets and calculate correct dashboard statistics on init', () => {
    expect(component.tickets().length).toBe(2);
    const stats = component.stats();

    expect(stats.totalIssued).toBe(2);
    expect(stats.totalRevenue).toBe(8000);
    expect(stats.ticketsSimpleCount).toBe(1);
    expect(stats.ticketsConComidaCount).toBe(1);
    expect(stats.averageTicketPrice).toBe(4000);
  });

  // White-Box Testing: Seller Filter computed signal
  it('should filter tickets by selectedSellerId when Admin selects a specific seller', () => {
    component.selectedSellerId.set('seller-1');
    const filtered = component.filteredTickets();

    expect(filtered.length).toBe(1);
    expect(filtered[0].sellerId).toBe('seller-1');
  });

  // White-Box Testing: Seller Ranking calculation
  it('should calculate seller ranking accurately sorted by total revenue', () => {
    const ranking = component.sellerRanking();

    expect(ranking.length).toBe(2);
    expect(ranking[0].sellerId).toBe('seller-2'); // 5000 revenue
    expect(ranking[0].totalRevenue).toBe(5000);
    expect(ranking[1].sellerId).toBe('seller-1'); // 3000 revenue
  });
});
