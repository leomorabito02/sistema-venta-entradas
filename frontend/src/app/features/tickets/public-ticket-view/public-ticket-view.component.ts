import { Component, OnInit, inject, signal } from '@angular/core';
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
export class PublicTicketViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  ticket = signal<PublicTicket | null>(null);
  copiedUrl = signal<boolean>(false);
  qrDataUrl = signal<string>('');

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('Token público no proporcionado en la URL');
      return;
    }

    this.fetchTicket(token);
  }

  fetchTicket(token: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.apiService.getPublicTicketRaw(token).subscribe({
      next: (res) => {
        this.loading.set(false);
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
        this.errorMessage.set(err.error?.error || 'No se pudo cargar la información pública del ticket');
      }
    });
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
