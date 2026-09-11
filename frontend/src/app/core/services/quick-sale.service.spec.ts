import { TestBed } from '@angular/core/testing';
import { QuickSaleService } from './quick-sale.service';

describe('QuickSaleService', () => {
  let service: QuickSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuickSaleService]
    });
    service = TestBed.inject(QuickSaleService);
  });

  it('should initialize with isOpen = false', () => {
    expect(service.isOpen()).toBeFalse();
  });

  it('should set isOpen to true on open() and false on close()', () => {
    service.open();
    expect(service.isOpen()).toBeTrue();

    service.close();
    expect(service.isOpen()).toBeFalse();
  });

  it('should emit event on ticketCreated$ when notifyTicketCreated is called', (done) => {
    service.ticketCreated$.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    service.notifyTicketCreated();
  });
});
