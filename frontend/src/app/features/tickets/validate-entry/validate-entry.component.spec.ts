import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateEntryComponent } from './validate-entry.component';
import { ApiService } from '../../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { Ticket } from '../../../core/models/api.models';

describe('ValidateEntryComponent', () => {
  let component: ValidateEntryComponent;
  let fixture: ComponentFixture<ValidateEntryComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockValidTicket: Ticket = {
    id: 't1',
    ticketNumber: 50,
    publicToken: 'valid-token',
    fourDigitCode: '1234',
    ticketType: 'SIMPLE',
    saleSource: 'ANTICIPADA',
    quotaSource: 'PERSONAL',
    pricePaid: 3000,
    status: 'VENDIDO',
    sellerId: 's1',
    sellerName: 'John Seller',
    buyerName: 'Carlos Buyer',
    createdAt: '2026-09-10T10:00:00Z'
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['validateTicket', 'listTickets']);

    await TestBed.configureTestingModule({
      imports: [ValidateEntryComponent],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box Testing: Pin Code input & validation trigger
  it('should append digits to fourDigitInput and auto-submit when length reaching 4', () => {
    apiServiceSpy.validateTicket.and.returnValue(of({ success: true, data: mockValidTicket }));

    component.appendDigit('1');
    component.appendDigit('2');
    component.appendDigit('3');
    expect(component.fourDigitInput).toBe('123');
    expect(apiServiceSpy.validateTicket).not.toHaveBeenCalled();

    component.appendDigit('4');
    expect(component.fourDigitInput).toBe('1234');
    expect(apiServiceSpy.validateTicket).toHaveBeenCalledWith({
      four_digit_code: '1234',
      validation_type: 'ENTRADA'
    });

    const overlay = component.validationOverlay();
    expect(overlay).not.toBeNull();
    expect(overlay?.type).toBe('success');
    expect(overlay?.title).toBe('La entrada es válida');
  });

  // Black-Box & State Transition: Entry already used warning overlay
  it('should display warning overlay when ticket entry has already been used', () => {
    apiServiceSpy.validateTicket.and.returnValue(
      throwError(() => ({ error: { message: 'Entrada ya ingresada' } }))
    );
    apiServiceSpy.listTickets.and.returnValue(
      of({ success: true, data: [{ ...mockValidTicket, status: 'USADO_ENTRADA' }] })
    );

    component.fourDigitInput = '1234';
    component.searchByCode();

    const overlay = component.validationOverlay();
    expect(overlay?.type).toBe('warning');
    expect(overlay?.title).toBe('La entrada ya fue utilizada');
  });

  // Black-Box Testing: Annullment Error Overlay
  it('should display error overlay when ticket is annulled', () => {
    apiServiceSpy.validateTicket.and.returnValue(
      throwError(() => ({ error: { message: 'Ticket anulado' } }))
    );
    apiServiceSpy.listTickets.and.returnValue(
      of({ success: true, data: [{ ...mockValidTicket, status: 'ANULADO' }] })
    );

    component.fourDigitInput = '1234';
    component.searchByCode();

    const overlay = component.validationOverlay();
    expect(overlay?.type).toBe('error');
    expect(overlay?.title).toBe('La entrada está anulada');
  });

  // White-Box Testing: Dismissing overlay resets inputs
  it('should reset overlay and fourDigitInput on dismissOverlay', () => {
    component.fourDigitInput = '1234';
    component.dismissOverlay();

    expect(component.validationOverlay()).toBeNull();
    expect(component.fourDigitInput).toBe('');
  });
});
