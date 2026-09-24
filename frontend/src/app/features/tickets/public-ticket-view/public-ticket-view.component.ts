import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import QRCode from 'qrcode';
import { ApiService, PublicTicket } from '../../../core/services/api.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-public-ticket-view',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent],
  templateUrl: './public-ticket-view.component.html',
  styleUrl: './public-ticket-view.component.css'
})
export class PublicTicketViewComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  ticket = signal<PublicTicket | null>(null);
  copiedUrl = signal<boolean>(false);
  qrDataUrl = signal<string>('');

  // Rate Limiting Friendly State
  isRateLimited = signal<boolean>(false);
  retryAfterSeconds = signal<number>(60);
  currentToken = signal<string>('');
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('Token público no proporcionado en la URL');
      return;
    }

    this.currentToken.set(token);
    this.fetchTicket(token);
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  fetchTicket(token: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.apiService.getPublicTicketRaw(token).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.isRateLimited.set(false);
        this.clearCountdown();
        if (res.success && res.data) {
          this.ticket.set(res.data);
          this.generateQrCode(res.data.four_digit_code);
          this.updateMetaTags(res.data);
        } else {
          this.errorMessage.set(res.error || 'Bono / Ticket no encontrado o inactivo');
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 429) {
          this.isRateLimited.set(true);
          const headerRetry = err.headers?.get('Retry-After');
          let seconds = headerRetry ? Number.parseInt(headerRetry, 10) : 60;
          if (Number.isNaN(seconds) || seconds <= 0) seconds = 60;
          this.startCountdown(seconds, token);
        } else {
          this.errorMessage.set(err.error?.error || 'No se pudo cargar la información pública del ticket');
        }
      }
    });
  }

  private startCountdown(seconds: number, token: string): void {
    this.retryAfterSeconds.set(seconds);
    this.clearCountdown();

    this.countdownTimer = setInterval(() => {
      const current = this.retryAfterSeconds();
      if (current <= 1) {
        this.clearCountdown();
        this.retryAfterSeconds.set(0);
        this.isRateLimited.set(false);
        this.fetchTicket(token);
      } else {
        this.retryAfterSeconds.set(current - 1);
      }
    }, 1000);
  }

  retryNow(): void {
    if (this.retryAfterSeconds() > 0) return;
    const token = this.currentToken();
    if (token) {
      this.fetchTicket(token);
    }
  }

  private updateMetaTags(t: PublicTicket): void {
    const pageTitle = `LA PEÑA DEL SEMI - Entrada Digital #${t.ticket_number}`;
    const pageDesc = `ENTRADA DIGITAL - ${t.buyer_name || 'Cliente'}. Código: ${t.four_digit_code}`;

    this.titleService.setTitle(pageTitle);
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: pageDesc });
    this.metaService.updateTag({ name: 'description', content: pageDesc });
  }

  private generateQrCode(code: string): void {
    if (!code) return;
    QRCode.toDataURL(code, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 340,
      color: {
        dark: '#1a101f',
        light: '#ffffff'
      }
    }).then(url => {
      this.qrDataUrl.set(url);
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });
  }

  copyUrl(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copiedUrl.set(true);
      setTimeout(() => this.copiedUrl.set(false), 2500);
    });
  }

  printTicket(): void {
    window.print();
  }
}
