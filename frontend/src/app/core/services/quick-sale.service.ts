import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickSaleService {
  readonly isOpen = signal<boolean>(false);
  readonly ticketCreated$ = new Subject<void>();

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  notifyTicketCreated(): void {
    this.ticketCreated$.next();
  }
}
