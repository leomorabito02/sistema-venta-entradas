import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateFoodComponent } from './validate-food.component';
import { ApiService } from '../../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { Ticket } from '../../../core/models/api.models';

describe('ValidateFoodComponent', () => {
  let component: ValidateFoodComponent;
  let fixture: ComponentFixture<ValidateFoodComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockFoodTicket: Ticket = {
    id: 't-food-1',
    ticketNumber: 501,
    publicToken: 'tok-food',
    fourDigitCode: '4444',
    ticketType: 'CON_COMIDA',
    saleSource: 'ANTICIPADA',
    quotaSource: 'PERSONAL',
    pricePaid: 5000,
    status: 'USADO_ENTRADA',
    sellerId: 's1',
    sellerName: 'John Seller',
    buyerName: 'Comida Buyer',
    createdAt: '2026-09-10T10:00:00Z'
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['validateTicket', 'listTickets']);

    await TestBed.configureTestingModule({
      imports: [ValidateFoodComponent],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box & State Transition: Successful food validation
  it('should validate food successfully when ticket status is USADO_ENTRADA and type CON_COMIDA', () => {
    apiServiceSpy.validateTicket.and.returnValue(
      of({ success: true, data: { ...mockFoodTicket, status: 'USADO_COMIDA' } })
    );

    component.fourDigitInput = '4444';
    component.searchByCode();

    expect(apiServiceSpy.validateTicket).toHaveBeenCalledWith({
      four_digit_code: '4444',
      validation_type: 'COMIDA'
    });

    const overlay = component.validationOverlay();
    expect(overlay?.type).toBe('food-success');
    expect(overlay?.title).toBe('Bono validado para retirar comida');
  });

  // Black-Box Testing: Simple ticket food rejection
  it('should reject food validation for SIMPLE ticket type before API call', () => {
    const simpleTicket: Ticket = { ...mockFoodTicket, ticketType: 'SIMPLE', status: 'USADO_ENTRADA' };

    component.validateFoodDirect(simpleTicket);

    expect(apiServiceSpy.validateTicket).not.toHaveBeenCalled();
    const overlay = component.validationOverlay();
    expect(overlay?.type).toBe('error');
    expect(overlay?.title).toBe('El ticket no incluye comida');
  });

  // Black-Box Testing: Rejection when entry has not been validated yet
  it('should reject food validation if status is VENDIDO (entry not validated yet)', () => {
    const unenteredTicket: Ticket = { ...mockFoodTicket, status: 'VENDIDO' };

    component.validateFoodDirect(unenteredTicket);

    expect(apiServiceSpy.validateTicket).not.toHaveBeenCalled();
    const overlay = component.validationOverlay();
    expect(overlay?.type).toBe('warning');
    expect(overlay?.title).toBe('Debe validar el ingreso');
  });
});
