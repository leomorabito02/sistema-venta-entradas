import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { Ticket } from '../../../core/models/api.models';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockTickets: Ticket[] = [
    {
      id: 't1',
      ticketNumber: 101,
      publicToken: 'tok1',
      fourDigitCode: '9999',
      ticketType: 'SIMPLE',
      saleSource: 'ANTICIPADA',
      quotaSource: 'PERSONAL',
      pricePaid: 3000,
      status: 'VENDIDO',
      sellerId: 's1',
      sellerName: 'Carlos Seller',
      buyerName: 'Pedro Buyer',
      createdAt: '2026-09-10T10:00:00Z'
    },
    {
      id: 't2',
      ticketNumber: 102,
      publicToken: 'tok2',
      fourDigitCode: '8888',
      ticketType: 'CON_COMIDA',
      saleSource: 'PUERTA',
      quotaSource: undefined,
      pricePaid: 5000,
      status: 'USADO_ENTRADA',
      sellerId: 's2',
      sellerName: 'Maria Seller',
      buyerName: 'Ana Buyer',
      createdAt: '2026-09-10T11:00:00Z'
    }
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['listTickets', 'listUsers', 'annulTicket']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin']);

    authServiceSpy.isAdmin.and.returnValue(true);
    apiServiceSpy.listTickets.and.returnValue(of({ success: true, data: mockTickets }));
    apiServiceSpy.listUsers.and.returnValue(of({ success: true, data: [] }));

    await TestBed.configureTestingModule({
      imports: [TicketListComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box Testing: Filtering by Search Query
  it('should filter tickets by search query matching buyer name or 4-digit code', () => {
    component.searchQuery.set('Pedro');
    expect(component.filteredTickets().length).toBe(1);
    expect(component.filteredTickets()[0].fourDigitCode).toBe('9999');

    component.searchQuery.set('8888');
    expect(component.filteredTickets().length).toBe(1);
    expect(component.filteredTickets()[0].buyerName).toBe('Ana Buyer');
  });

  // Black-Box Testing: Filtering by Ticket Type
  it('should filter tickets by status and ticket type', () => {
    component.ticketTypeFilter.set('CON_COMIDA');
    expect(component.filteredTickets().length).toBe(1);

    component.statusFilter.set('VENDIDO');
    expect(component.filteredTickets().length).toBe(0); // t2 is USADO_ENTRADA
  });

  // Black-Box & State Transition: Annulment flow
  it('should annul ticket successfully when confirmed', () => {
    apiServiceSpy.annulTicket.and.returnValue(of({ success: true, data: null }));

    component.openAnnulModal(mockTickets[0]);
    component.annulReason.set('Customer requested cancellation');
    component.confirmAnnulTicket();

    expect(apiServiceSpy.annulTicket).toHaveBeenCalledWith('t1', 'Customer requested cancellation');
    expect(component.successMessage()).toContain('Ticket #101 anulado con éxito');
  });

  // Black-Box Testing: Reset filters
  it('should clear all filters when clearFilters is called', () => {
    component.searchQuery.set('Query');
    component.statusFilter.set('VENDIDO');
    component.clearFilters();

    expect(component.searchQuery()).toBe('');
    expect(component.statusFilter()).toBe('ALL');
  });
});
