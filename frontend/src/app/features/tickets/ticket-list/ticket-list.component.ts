import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket, User } from '../../../core/models/api.models';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly authService = inject(AuthService);

  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Data lists
  tickets = signal<Ticket[]>([]);
  users = signal<User[]>([]);

  // Filter signals (supports any combination of filters)
  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');
  ticketTypeFilter = signal<string>('ALL');
  saleSourceFilter = signal<string>('ALL');
  sellerFilter = signal<string>('ALL');

  // Modal states
  selectedTicket = signal<Ticket | null>(null);
  showDetailModal = signal<boolean>(false);
  showAnnulModal = signal<boolean>(false);
  annulReason = signal<string>('');
  annulling = signal<boolean>(false);
  copiedPublicUrl = signal<boolean>(false);

  // Computed filtered list
  readonly filteredTickets = computed(() => {
    const list = this.tickets();
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const type = this.ticketTypeFilter();
    const source = this.saleSourceFilter();
    const seller = this.sellerFilter();

    return list.filter((t) => {
      // 1. Filter by Status
      if (status !== 'ALL' && t.status !== status) {
        return false;
      }
      // 2. Filter by Ticket Type (SIMPLE / CON_COMIDA)
      if (type !== 'ALL' && t.ticketType !== type) {
        return false;
      }
      // 3. Filter by Sale Source (ANTICIPADA / PUERTA)
      if (source !== 'ALL' && t.saleSource !== source) {
        return false;
      }
      // 4. Filter by Seller
      if (seller !== 'ALL' && t.sellerId !== seller) {
        return false;
      }
      // 5. Search query (4-digit code, ticket number, buyer name/phone, seller name)
      if (query) {
        const fourCode = (t.fourDigitCode || '').toLowerCase();
        const ticketNum = (t.ticketNumber?.toString() || t.id || '').toLowerCase();
        const buyer = (t.buyerName || '').toLowerCase();
        const sellerName = (t.sellerName || '').toLowerCase();
        const token = (t.publicToken || '').toLowerCase();

        const matchesQuery =
          fourCode.includes(query) ||
          ticketNum.includes(query) ||
          buyer.includes(query) ||
          sellerName.includes(query) ||
          token.includes(query);

        if (!matchesQuery) return false;
      }

      return true;
    });
  });

  // Summary statistics for active filtered view
  readonly totalFilteredCount = computed(() => this.filteredTickets().length);
  readonly totalFilteredRevenue = computed(() => {
    return this.filteredTickets()
      .filter((t) => t.status !== 'ANULADO')
      .reduce((sum, t) => sum + (t.pricePaid || 0), 0);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    // Fetch user list for admin filter dropdown if admin
    if (this.authService.isAdmin()) {
      this.apiService.listUsers().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.users.set(res.data);
          }
        }
      });
    }

    // Fetch all tickets
    this.apiService.listTickets().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.tickets.set(res.data);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error || 'Error al obtener el listado de tickets');
      }
    });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('ALL');
    this.ticketTypeFilter.set('ALL');
    this.saleSourceFilter.set('ALL');
    this.sellerFilter.set('ALL');
  }

  // Detail Modal methods
  openDetail(t: Ticket): void {
    this.selectedTicket.set(t);
    this.copiedPublicUrl.set(false);
    this.showDetailModal.set(true);
  }

  closeDetail(): void {
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
  }

  // Annulment Modal methods
  openAnnulModal(t: Ticket): void {
    if (t.status !== 'VENDIDO') return;
    this.selectedTicket.set(t);
    this.annulReason.set('');
    this.showAnnulModal.set(true);
  }

  closeAnnulModal(): void {
    this.showAnnulModal.set(false);
    this.annulReason.set('');
  }

  confirmAnnulTicket(): void {
    const t = this.selectedTicket();
    if (!t) return;

    this.annulling.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const reason = this.annulReason().trim() || 'Anulación desde panel de administración de tickets';

    this.apiService.annulTicket(t.id, reason).subscribe({
      next: (res) => {
        this.annulling.set(false);
        if (res.success) {
          let quotaTypeNotice = '';
          if (t.saleSource === 'ANTICIPADA' && t.quotaSource) {
            const quotaName = t.quotaSource === 'PERSONAL' ? 'PERSONAL' : 'COMPARTIDA/LIBRE';
            quotaTypeNotice = ` Se ha devuelto 1 cupo a la cuota (${quotaName}) del vendedor.`;
          }

          this.successMessage.set(`Ticket #${t.ticketNumber || t.fourDigitCode} anulado con éxito.${quotaTypeNotice}`);
          this.closeAnnulModal();
          this.closeDetail();
          this.loadData(); // Re-fetch to update lists and quotas
        } else {
          this.errorMessage.set(res.error || 'No se pudo anular el ticket');
        }
      },
      error: (err) => {
        this.annulling.set(false);
        this.errorMessage.set(err.error?.error || 'Error al procesar la anulación del ticket');
      }
    });
  }

  copyPublicUrl(t: Ticket): void {
    if (!t?.publicToken) return;
    const fullUrl = `${window.location.origin}/api/tickets/public/${encodeURIComponent(t.publicToken)}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }

  formatStatus(status?: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ');
  }

  formatType(type?: string): string {
    if (!type) return '';
    return type.replace(/_/g, ' ');
  }
}
