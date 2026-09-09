import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket, User, DashboardStats } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);

  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Seller list for Admin filter
  users = signal<User[]>([]);
  selectedSellerId = signal<string>('ALL'); // 'ALL' or specific seller UUID

  // All tickets fetched from backend
  tickets = signal<Ticket[]>([]);

  // Computed metrics based on selection (specific user or global aggregate)
  readonly filteredTickets = computed(() => {
    const list = this.tickets();
    const sellerFilter = this.selectedSellerId();
    if (!this.authService.isAdmin() || sellerFilter === 'ALL') {
      return list;
    }
    return list.filter(t => t.sellerId === sellerFilter);
  });

  readonly stats = computed<DashboardStats>(() => {
    const list = this.filteredTickets();

    let totalRevenue = 0;
    let totalIssued = 0;
    let ticketsSimpleCount = 0;
    let ticketsSimpleRevenue = 0;
    let ticketsConComidaCount = 0;
    let ticketsConComidaRevenue = 0;
    let anticipadaCount = 0;
    let anticipadaRevenue = 0;
    let puertaCount = 0;
    let puertaRevenue = 0;
    let entriesUsedCount = 0;
    let foodDeliveredCount = 0;
    let foodPendingCount = 0;
    let annulledCount = 0;
    let annulledRevenue = 0;

    for (const t of list) {
      if (t.status === 'ANULADO') {
        annulledCount++;
        annulledRevenue += t.pricePaid || 0;
        continue;
      }

      totalIssued++;
      totalRevenue += t.pricePaid || 0;

      // Breakdown by Ticket Type
      if (t.ticketType === 'SIMPLE') {
        ticketsSimpleCount++;
        ticketsSimpleRevenue += t.pricePaid || 0;
      } else if (t.ticketType === 'CON_COMIDA') {
        ticketsConComidaCount++;
        ticketsConComidaRevenue += t.pricePaid || 0;
      }

      // Breakdown by Sale Source (ANTICIPADA vs PUERTA)
      if (t.saleSource === 'ANTICIPADA') {
        anticipadaCount++;
        anticipadaRevenue += t.pricePaid || 0;
      } else if (t.saleSource === 'PUERTA') {
        puertaCount++;
        puertaRevenue += t.pricePaid || 0;
      }

      // Usage / Food status
      if (t.status === 'USADO_ENTRADA') {
        entriesUsedCount++;
        if (t.ticketType === 'CON_COMIDA') {
          foodPendingCount++;
        }
      } else if (t.status === 'USADO_COMIDA') {
        entriesUsedCount++;
        foodDeliveredCount++;
      } else if (t.status === 'VENDIDO' && t.ticketType === 'CON_COMIDA') {
        foodPendingCount++;
      }
    }

    return {
      totalRevenue,
      totalIssued,
      ticketsSimpleCount,
      ticketsSimpleRevenue,
      ticketsConComidaCount,
      ticketsConComidaRevenue,
      anticipadaCount,
      anticipadaRevenue,
      puertaCount,
      puertaRevenue,
      entriesUsedCount,
      foodDeliveredCount,
      foodPendingCount,
      annulledCount,
      annulledRevenue,
      recentTickets: list.slice(0, 10)
    };
  });

  // Active prices state for Admin management
  priceSimple = signal<number>(3000);
  priceConComida = signal<number>(5000);
  priceSuccessMessage = signal<string>('');
  priceErrorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadData();
    this.loadPrices();
  }

  loadPrices(): void {
    this.apiService.getTicketPrices().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          for (const item of res.data) {
            if (item.ticket_type === 'SIMPLE') {
              this.priceSimple.set(item.price);
            } else if (item.ticket_type === 'CON_COMIDA') {
              this.priceConComida.set(item.price);
            }
          }
        }
      }
    });
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const currentUserId = this.authService.currentUser()?.id;

    if (this.authService.isAdmin()) {
      // Load user list for filter
      this.apiService.listUsers().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.users.set(res.data);
          }
        }
      });
      // Fetch all tickets for global dashboard
      this.apiService.listTickets().subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            this.tickets.set(res.data);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.error || 'Error al cargar estadísticas del dashboard');
        }
      });
    } else {
      // Fetch tickets specifically for logged in seller
      this.apiService.listTickets(currentUserId).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            this.tickets.set(res.data);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.error || 'Error al cargar estadísticas del usuario');
        }
      });
    }
  }

  onSellerFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSellerId.set(select.value);
  }

  savingPrices = signal<boolean>(false);

  onSavePrices(): void {
    this.priceSuccessMessage.set('');
    this.priceErrorMessage.set('');
    this.savingPrices.set(true);

    const simpleReq = this.apiService.updateTicketPrice({ ticket_type: 'SIMPLE', price: this.priceSimple() });
    const comidaReq = this.apiService.updateTicketPrice({ ticket_type: 'CON_COMIDA', price: this.priceConComida() });

    simpleReq.subscribe({
      next: () => {
        comidaReq.subscribe({
          next: () => {
            this.savingPrices.set(false);
            this.priceSuccessMessage.set('Precios de entradas actualizados correctamente en la base de datos');
          },
          error: (err) => {
            this.savingPrices.set(false);
            this.priceErrorMessage.set(err.error?.error || 'Error al actualizar precio de entrada con comida');
          }
        });
      },
      error: (err) => {
        this.savingPrices.set(false);
        this.priceErrorMessage.set(err.error?.error || 'Error al actualizar precio de entrada simple');
      }
    });
  }

  // Ticket Issuance Modal State
  showIssueModal = signal<boolean>(false);
  issueStep = signal<number>(1);
  newTicketType = signal<'SIMPLE' | 'CON_COMIDA'>('SIMPLE');
  newSaleSource = signal<'ANTICIPADA' | 'PUERTA'>('ANTICIPADA');
  buyerFirstName = signal<string>('');
  buyerLastName = signal<string>('');
  buyerPhone = signal<string>('');
  buyerEmail = signal<string>('');
  issuingTicket = signal<boolean>(false);
  issueErrorMessage = signal<string>('');
  createdTicket = signal<any>(null);
  copiedPublicUrl = signal<boolean>(false);

  readonly currentSelectedPrice = computed<number>(() => {
    return this.newTicketType() === 'CON_COMIDA' ? this.priceConComida() : this.priceSimple();
  });

  openIssueModal(): void {
    this.issueStep.set(1);
    this.newTicketType.set('SIMPLE');
    this.newSaleSource.set('ANTICIPADA');
    this.buyerFirstName.set('');
    this.buyerLastName.set('');
    this.buyerPhone.set('');
    this.buyerEmail.set('');
    this.issueErrorMessage.set('');
    this.createdTicket.set(null);
    this.copiedPublicUrl.set(false);
    this.showIssueModal.set(true);
  }

  closeIssueModal(): void {
    this.showIssueModal.set(false);
  }

  goToStep(step: number): void {
    if (step === 3) {
      if (!this.buyerFirstName().trim() || !this.buyerLastName().trim() || !this.buyerPhone().trim()) {
        this.issueErrorMessage.set('Nombre, Apellido y Teléfono son requeridos');
        return;
      }
    }
    this.issueErrorMessage.set('');
    this.issueStep.set(step);
  }

  submitIssueTicket(): void {
    this.issuingTicket.set(true);
    this.issueErrorMessage.set('');

    const payload = {
      ticket_type: this.newTicketType(),
      sale_source: this.newSaleSource(),
      first_name: this.buyerFirstName().trim(),
      last_name: this.buyerLastName().trim(),
      phone: this.buyerPhone().trim(),
      email: this.buyerEmail().trim() || undefined
    };

    this.apiService.createTicket(payload).subscribe({
      next: (res) => {
        this.issuingTicket.set(false);
        if (res.success && res.data) {
          this.createdTicket.set(res.data);
          this.issueStep.set(4);
          this.loadData();
        } else {
          this.issueErrorMessage.set(res.error || 'No se pudo emitir el bono');
        }
      },
      error: (err) => {
        this.issuingTicket.set(false);
        this.issueErrorMessage.set(err.error?.error || 'Error al emitir el bono');
      }
    });
  }

  copyPublicUrl(): void {
    const ticket = this.createdTicket();
    if (!ticket || !ticket.public_url) return;

    const fullUrl = `${window.location.origin}${ticket.public_url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }
}
