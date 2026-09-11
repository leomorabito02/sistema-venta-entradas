import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiResponse, Ticket, CreateTicketRequest, ValidateTicketRequest } from '../models/api.models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const rawBackendTicket = {
    id: 'ticket-1',
    ticket_number: 1001,
    public_token: 'pub-tok-123',
    four_digit_code: '4321',
    ticket_type: 'SIMPLE',
    sale_source: 'ANTICIPADA',
    quota_source: 'PERSONAL',
    price_paid: 5000,
    status: 'VENDIDO',
    seller_id: 'seller-456',
    seller: { id: 'seller-456', name: 'John Seller' },
    buyer: { first_name: 'Maria', last_name: 'Perez', email: 'maria@example.com' },
    entry_validated_at: '2026-09-10T20:00:00Z',
    entry_validator_name: 'Door Validator',
    food_validated_at: null,
    food_validator_name: null,
    created_at: '2026-09-10T15:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Black-Box Testing: Health Endpoint
  it('should fetch health status from GET /health', () => {
    const mockHealthResponse: ApiResponse<{ status: string; timestamp: string; uptime: string }> = {
      success: true,
      data: { status: 'OK', timestamp: '2026-09-10T20:00:00Z', uptime: '100s' }
    };

    service.getHealth().subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data?.status).toBe('OK');
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    expect(req.request.method).toBe('GET');
    req.flush(mockHealthResponse);
  });

  // White-Box Testing: DTO Mapping (snake_case to camelCase)
  it('should correctly map raw backend snake_case ticket DTO to camelCase Ticket model', () => {
    const mockApiResponse: ApiResponse<any> = {
      success: true,
      data: rawBackendTicket
    };

    service.getPublicTicket('pub-tok-123').subscribe((res) => {
      expect(res.success).toBeTrue();
      const ticket: Ticket = res.data!;
      expect(ticket.ticketNumber).toBe(1001);
      expect(ticket.publicToken).toBe('pub-tok-123');
      expect(ticket.fourDigitCode).toBe('4321');
      expect(ticket.ticketType).toBe('SIMPLE');
      expect(ticket.pricePaid).toBe(5000);
      expect(ticket.sellerId).toBe('seller-456');
      expect(ticket.sellerName).toBe('John Seller');
      expect(ticket.buyerName).toBe('Maria Perez');
      expect(ticket.entryValidatedAt).toBe('2026-09-10T20:00:00Z');
      expect(ticket.entryValidatorName).toBe('Door Validator');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/api/tickets/public/pub-tok-123'));
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  // Black-Box Testing: Query Param Construction for listTickets
  it('should construct correct query parameter seller_id when provided in listTickets', () => {
    const mockListResponse: ApiResponse<any[]> = {
      success: true,
      data: [rawBackendTicket]
    };

    service.listTickets('seller-789').subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data?.length).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/api/tickets?seller_id=seller-789'));
    expect(req.request.method).toBe('GET');
    req.flush(mockListResponse);
  });

  // Black-Box Testing: Ticket Creation
  it('should post CreateTicketRequest and return mapped ticket', () => {
    const createReq: CreateTicketRequest = {
      ticket_type: 'CON_COMIDA',
      sale_source: 'ANTICIPADA',
      first_name: 'Juan',
      last_name: 'Gomez',
      email: 'juan@example.com',
      phone: '123456789'
    };

    service.createTicket(createReq).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data?.ticketNumber).toBe(1001);
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/tickets'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createReq);
    req.flush({ success: true, data: rawBackendTicket });
  });

  // Black-Box Testing: Ticket Validation
  it('should post ValidateTicketRequest and return mapped updated ticket', () => {
    const valReq: ValidateTicketRequest = {
      validation_type: 'ENTRADA',
      four_digit_code: '4321'
    };

    service.validateTicket(valReq).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data?.entryValidatedAt).toBeDefined();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/tickets/validate'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(valReq);
    req.flush({ success: true, data: rawBackendTicket });
  });

  // Black-Box Testing: Annul Ticket
  it('should post annulment request with reason', () => {
    service.annulTicket('ticket-1', 'Duplicate purchase').subscribe((res) => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/tickets/ticket-1/annul'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reason: 'Duplicate purchase' });
    req.flush({ success: true, message: 'Ticket annulled' });
  });
});
