import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateTicketRequest, Ticket } from '../../../core/models/api.models';

@Component({
  selector: 'app-quick-sale-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-sale-drawer.component.html',
  styleUrls: ['./quick-sale-drawer.component.css']
})
export class QuickSaleDrawerComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() ticketCreated = new EventEmitter<Ticket>();

  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  loading = false;
  createdTicket: Ticket | null = null;

  ticketType: 'SIMPLE' | 'CON_COMIDA' = 'SIMPLE';
  saleSource: 'ANTICIPADA' | 'PUERTA' = 'ANTICIPADA';
  quotaSource: 'PERSONAL' | 'LIBRE' = 'PERSONAL';
  countryCode = '54';
  customCountryCode = '';
  firstName = '';
  lastName = '';
  phone = '';
  email = '';

  personalQuotaRemaining = signal<number | null>(null);
  personalQuotaTotal = signal<number | null>(null);
  freeQuotaRemaining = signal<number | null>(null);
  freeQuotaTotal = signal<number | null>(null);

  getEffectiveCountryCode(): string {
    if (this.countryCode === 'custom') {
      return (this.customCountryCode || '').replace(/\D/g, '');
    }
    return this.countryCode;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.loadQuotaSummary();
    }
  }

  loadQuotaSummary(): void {
    const user = this.authService.currentUser();
    if (user?.id) {
      this.apiService.getSellerQuota(user.id).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const avail = res.data.available_quota ?? res.data.remainingQuota ?? 0;
            const assigned = res.data.assigned_quota ?? res.data.assignedQuota ?? 0;
            this.personalQuotaRemaining.set(avail);
            this.personalQuotaTotal.set(assigned);
          }
        }
      });
    }

    this.apiService.getGlobalFreeQuota().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const avail = res.data.available_quota ?? res.data.remainingQuota ?? 0;
          const assigned = res.data.assigned_quota ?? res.data.assignedQuota ?? 0;
          this.freeQuotaRemaining.set(avail);
          this.freeQuotaTotal.set(assigned);
        }
      }
    });
  }

  selectTicketType(type: 'SIMPLE' | 'CON_COMIDA'): void {
    this.ticketType = type;
  }

  selectSaleSource(source: 'ANTICIPADA' | 'PUERTA'): void {
    this.saleSource = source;
  }

  selectQuotaSource(source: 'PERSONAL' | 'LIBRE'): void {
    this.quotaSource = source;
  }

  onClose(): void {
    this.resetForm();
    this.closeDrawer.emit();
  }

  submitSale(): void {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.phone.trim()) {
      this.toastService.warning('Por favor completa Nombre, Apellido y Teléfono');
      return;
    }

    const code = this.getEffectiveCountryCode();
    const cleanPhoneDigits = this.phone.replace(/\D/g, '');
    const fullPhone = code ? `+${code}${cleanPhoneDigits}` : cleanPhoneDigits;

    this.loading = true;
    const payload: CreateTicketRequest = {
      ticket_type: this.ticketType,
      sale_source: this.saleSource,
      quota_source: this.saleSource === 'ANTICIPADA' ? this.quotaSource : undefined,
      first_name: this.firstName.trim(),
      last_name: this.lastName.trim(),
      phone: fullPhone,
      email: this.email.trim() ? this.email.trim() : undefined
    };

    this.apiService.createTicket(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success && resp.data) {
          this.createdTicket = resp.data;
          this.toastService.success('¡Entrada generada con éxito!');
          this.loadQuotaSummary();
          this.ticketCreated.emit(resp.data);
        } else {
          this.toastService.error(resp.error || 'Error al emitir entrada');
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.error || err.error?.message || 'Error al procesar la venta';
        this.toastService.error(msg);
      }
    });
  }

  getPublicUrl(): string {
    if (!this.createdTicket) return '';
    const domain = window.location.origin;
    return `${domain}/tickets/public/${this.createdTicket.publicToken}`;
  }

  getWhatsAppLink(): string {
    if (!this.createdTicket) return '#';
    const publicUrl = this.getPublicUrl();
    const buyerName = this.createdTicket.buyerName || `${this.firstName} ${this.lastName}`.trim();
    const text = encodeURIComponent(
      `¡Hola ${buyerName}! Aquí tienes tu entrada para la Peña del Seminario 2026:\n\n🎟️ Código de Entrada: ${this.createdTicket.fourDigitCode}\n📌 Ver Ticket y QR: ${publicUrl}\n\n¡Te esperamos!`
    );

    const code = this.getEffectiveCountryCode();
    let digits = (this.phone || '').replace(/\D/g, '');
    let fullDigits = `${code}${digits}`;

    if (code === '54') {
      if (digits.startsWith('0')) digits = digits.substring(1);
      if (digits.startsWith('15')) digits = digits.substring(2);
      if (!digits.startsWith('9')) {
        fullDigits = `549${digits}`;
      } else {
        fullDigits = `54${digits}`;
      }
    }

    return `https://wa.me/${fullDigits}?text=${text}`;
  }

  copyTicketLink(): void {
    const url = this.getPublicUrl();
    if (!url) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.toastService.success('¡Enlace copiado al portapapeles!');
      }).catch(() => {
        this.fallbackCopyTextToClipboard(url);
      });
    } else {
      this.fallbackCopyTextToClipboard(url);
    }
  }

  private fallbackCopyTextToClipboard(text: string): void {
    if (typeof document === 'undefined') return;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      // Fallback for legacy environments where Clipboard API is unsupported
      // eslint-disable-next-line deprecation/deprecation
      const successful = document.execCommand('copy');
      if (successful) {
        this.toastService.success('¡Enlace copiado al portapapeles!');
      } else {
        this.toastService.error('No se pudo copiar el enlace');
      }
    } catch {
      this.toastService.error('No se pudo copiar el enlace');
    }
    textArea.remove();
  }

  resetForm(): void {
    this.createdTicket = null;
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.email = '';
    this.countryCode = '54';
    this.ticketType = 'SIMPLE';
    this.saleSource = 'ANTICIPADA';
    this.quotaSource = 'PERSONAL';
  }
}
