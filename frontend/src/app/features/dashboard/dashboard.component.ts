import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket, User, DashboardStats, SellerRankingItem } from '../../core/models/api.models';

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

  readonly sellerRanking = computed<SellerRankingItem[]>(() => {
    const list = this.tickets();
    const usersList = this.users();
    const map = new Map<string, SellerRankingItem>();

    for (const u of usersList) {
      map.set(u.id, {
        sellerId: u.id,
        sellerName: u.name,
        sellerEmail: u.email,
        totalIssued: 0,
        totalRevenue: 0,
        averageTicket: 0,
        anticipadaCount: 0,
        puertaCount: 0
      });
    }

    for (const t of list) {
      if (t.status === 'ANULADO') continue;

      let item = map.get(t.sellerId);
      if (!item) {
        item = {
          sellerId: t.sellerId,
          sellerName: t.sellerName || 'Vendedor Desconocido',
          sellerEmail: '',
          totalIssued: 0,
          totalRevenue: 0,
          averageTicket: 0,
          anticipadaCount: 0,
          puertaCount: 0
        };
        map.set(t.sellerId, item);
      }

      item.totalIssued++;
      item.totalRevenue += (t.pricePaid || 0);
      if (t.saleSource === 'ANTICIPADA') {
        item.anticipadaCount++;
      } else if (t.saleSource === 'PUERTA') {
        item.puertaCount++;
      }
    }

    const result: SellerRankingItem[] = [];
    map.forEach(item => {
      if (item.totalIssued > 0) {
        item.averageTicket = item.totalRevenue / item.totalIssued;
        result.push(item);
      }
    });

    return result.sort((a, b) => b.totalRevenue - a.totalRevenue || b.totalIssued - a.totalIssued);
  });

  readonly stats = computed<DashboardStats>(() => {
    return this.calculateDashboardStats(this.filteredTickets());
  });

  private calculateDashboardStats(list: Ticket[]): DashboardStats {
    const acc = {
      totalRevenue: 0,
      totalIssued: 0,
      ticketsSimpleCount: 0,
      ticketsSimpleRevenue: 0,
      ticketsConComidaCount: 0,
      ticketsConComidaRevenue: 0,
      anticipadaCount: 0,
      anticipadaRevenue: 0,
      puertaCount: 0,
      puertaRevenue: 0,
      entriesUsedCount: 0,
      foodDeliveredCount: 0,
      foodPendingCount: 0,
      annulledCount: 0,
      annulledRevenue: 0,
    };

    for (const t of list) {
      this.processSingleTicket(t, acc);
    }

    return this.buildDashboardStatsResult(acc, list.slice(0, 10));
  }

  private processSingleTicket(t: Ticket, acc: Record<string, number>): void {
    const price = t.pricePaid || 0;
    if (t.status === 'ANULADO') {
      acc['annulledCount']++;
      acc['annulledRevenue'] += price;
      return;
    }

    acc['totalIssued']++;
    acc['totalRevenue'] += price;

    this.accumulateTicketType(t.ticketType, price, acc);
    this.accumulateSaleSource(t.saleSource, price, acc);
    this.accumulateTicketStatus(t.status, t.ticketType, acc);
  }

  private accumulateTicketType(ticketType: string, price: number, acc: Record<string, number>): void {
    if (ticketType === 'SIMPLE') {
      acc['ticketsSimpleCount']++;
      acc['ticketsSimpleRevenue'] += price;
    } else if (ticketType === 'CON_COMIDA') {
      acc['ticketsConComidaCount']++;
      acc['ticketsConComidaRevenue'] += price;
    }
  }

  private accumulateSaleSource(saleSource: string, price: number, acc: Record<string, number>): void {
    if (saleSource === 'ANTICIPADA') {
      acc['anticipadaCount']++;
      acc['anticipadaRevenue'] += price;
    } else if (saleSource === 'PUERTA') {
      acc['puertaCount']++;
      acc['puertaRevenue'] += price;
    }
  }

  private accumulateTicketStatus(status: string, ticketType: string, acc: Record<string, number>): void {
    if (status === 'USADO_ENTRADA') {
      acc['entriesUsedCount']++;
      if (ticketType === 'CON_COMIDA') acc['foodPendingCount']++;
    } else if (status === 'USADO_COMIDA') {
      acc['entriesUsedCount']++;
      acc['foodDeliveredCount']++;
    } else if (status === 'VENDIDO' && ticketType === 'CON_COMIDA') {
      acc['foodPendingCount']++;
    }
  }

  private buildDashboardStatsResult(acc: Record<string, number>, recentTickets: Ticket[]): DashboardStats {
    const totalIssued = acc['totalIssued'];
    const totalRevenue = acc['totalRevenue'];
    const anticipadaVolumePct = totalIssued > 0 ? (acc['anticipadaCount'] / totalIssued) * 100 : 0;
    const puertaVolumePct = totalIssued > 0 ? (acc['puertaCount'] / totalIssued) * 100 : 0;
    const anticipadaRevenuePct = totalRevenue > 0 ? (acc['anticipadaRevenue'] / totalRevenue) * 100 : 0;
    const puertaRevenuePct = totalRevenue > 0 ? (acc['puertaRevenue'] / totalRevenue) * 100 : 0;
    const averageTicketPrice = totalIssued > 0 ? totalRevenue / totalIssued : 0;

    return {
      totalRevenue,
      totalIssued,
      ticketsSimpleCount: acc['ticketsSimpleCount'],
      ticketsSimpleRevenue: acc['ticketsSimpleRevenue'],
      ticketsConComidaCount: acc['ticketsConComidaCount'],
      ticketsConComidaRevenue: acc['ticketsConComidaRevenue'],
      anticipadaCount: acc['anticipadaCount'],
      anticipadaRevenue: acc['anticipadaRevenue'],
      anticipadaVolumePct,
      anticipadaRevenuePct,
      puertaCount: acc['puertaCount'],
      puertaRevenue: acc['puertaRevenue'],
      puertaVolumePct,
      puertaRevenuePct,
      averageTicketPrice,
      entriesUsedCount: acc['entriesUsedCount'],
      foodDeliveredCount: acc['foodDeliveredCount'],
      foodPendingCount: acc['foodPendingCount'],
      annulledCount: acc['annulledCount'],
      annulledRevenue: acc['annulledRevenue'],
      recentTickets
    };
  }

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
  quotaOption = signal<'PERSONAL' | 'LIBRE' | 'PUERTA'>('PERSONAL');
  personalQuotaAvailable = signal<number | null>(null);
  globalFreeQuotaAvailable = signal<number | null>(null);
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
    this.quotaOption.set('PERSONAL');
    this.buyerFirstName.set('');
    this.buyerLastName.set('');
    this.buyerPhone.set('');
    this.buyerEmail.set('');
    this.issueErrorMessage.set('');
    this.createdTicket.set(null);
    this.copiedPublicUrl.set(false);
    this.showIssueModal.set(true);

    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.apiService.getSellerQuota(userId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const assigned = res.data.assigned_quota ?? 0;
            const used = res.data.used_quota ?? 0;
            const avail = assigned - used;
            this.personalQuotaAvailable.set(Math.max(0, avail));
          }
        }
      });
    }
    this.apiService.getGlobalFreeQuota().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const total = res.data.total_free_quota ?? 0;
          const used = res.data.used_free_quota ?? 0;
          const avail = total - used;
          this.globalFreeQuotaAvailable.set(Math.max(0, avail));
        }
      }
    });
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

    const opt = this.quotaOption();
    let saleSource: 'ANTICIPADA' | 'PUERTA';
    let quotaSource: 'PERSONAL' | 'LIBRE' | undefined;

    if (opt === 'PERSONAL') {
      saleSource = 'ANTICIPADA';
      quotaSource = 'PERSONAL';
    } else if (opt === 'LIBRE') {
      saleSource = 'ANTICIPADA';
      quotaSource = 'LIBRE';
    } else {
      saleSource = 'PUERTA';
      quotaSource = undefined;
    }

    const payload = {
      ticket_type: this.newTicketType(),
      sale_source: saleSource,
      quota_source: quotaSource,
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

  showDetailModal = signal<boolean>(false);
  selectedTicket = signal<Ticket | null>(null);

  openDetail(t: Ticket): void {
    this.selectedTicket.set(t);
    this.copiedPublicUrl.set(false);
    this.showDetailModal.set(true);
  }

  closeDetail(): void {
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
  }

  copyTicketUrl(ticket: Ticket): void {
    if (!ticket?.publicToken) return;
    const fullUrl = `${window.location.origin}/api/tickets/public/${ticket.publicToken}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }

  copyPublicUrl(): void {
    const ticket = this.createdTicket();
    if (!ticket?.public_url) return;

    const fullUrl = `${window.location.origin}${ticket.public_url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }

  formatStatus(status?: string): string {
    if (!status) return '';
    return status.replaceAll('_', ' ');
  }

  formatType(type?: string): string {
    if (!type) return '';
    return type.replaceAll('_', ' ');
  }
}
