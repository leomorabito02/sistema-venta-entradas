import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsQR from 'jsqr';
import { ApiService, Ticket } from '../../../core/services/api.service';

type ValidationMode = 'code' | 'qr' | 'search';

@Component({
  selector: 'app-validate-food',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validate-food.component.html',
  styleUrl: './validate-food.component.css'
})
export class ValidateFoodComponent implements OnDestroy {
  private readonly apiService = inject(ApiService);

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  activeMode = signal<ValidationMode>('code');
  fourDigitInput = '';
  qrTokenInput = '';

  sellerNameSearch = '';
  buyerNameSearch = '';

  allTickets = signal<Ticket[]>([]);
  filteredTickets = signal<Ticket[]>([]);
  isSearching = signal(false);

  selectedTicket = signal<Ticket | null>(null);
  loading = signal(false);
  validating = signal(false);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  cameraActive = signal(false);
  cameraError = signal<string | null>(null);
  private mediaStream: MediaStream | null = null;
  private scanAnimFrameId: number | null = null;
  private readonly scanCanvas: HTMLCanvasElement = document.createElement('canvas');
  private readonly scanContext = this.scanCanvas.getContext('2d', { willReadFrequently: true });

  switchMode(mode: ValidationMode): void {
    this.activeMode.set(mode);
    this.clearMessages();
    if (mode !== 'qr' && this.cameraActive()) {
      this.stopCamera();
    }
    if (mode === 'search' && this.allTickets().length === 0) {
      this.loadAllTickets();
    }
  }

  clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  clearSelection(): void {
    this.selectedTicket.set(null);
    this.clearMessages();
  }

  searchByCode(): void {
    this.clearMessages();
    this.selectedTicket.set(null);

    const code = this.fourDigitInput.trim();
    if (code?.length !== 4) {
      this.errorMessage.set('Ingrese un código de 4 dígitos válido.');
      return;
    }

    this.loading.set(true);
    this.apiService.listTickets().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          const match = res.data.find(t => t.fourDigitCode === code);
          if (match) {
            this.selectedTicket.set(match);
          } else {
            this.errorMessage.set(`No se encontró ningún bono con el código ${code}.`);
          }
        } else {
          this.errorMessage.set(res.message || 'Error al buscar bono.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Error de servidor al buscar el bono.');
      }
    });
  }

  searchByToken(): void {
    this.clearMessages();
    this.selectedTicket.set(null);

    const token = this.qrTokenInput.trim();
    if (!token) {
      this.errorMessage.set('Ingrese un token público válido.');
      return;
    }

    this.loading.set(true);
    this.apiService.getPublicTicket(token).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.selectedTicket.set(res.data);
        } else {
          this.errorMessage.set(res.message || 'Bono no encontrado con ese token.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Error al obtener el bono por token.');
      }
    });
  }

  loadAllTickets(): void {
    this.apiService.listTickets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allTickets.set(res.data);
          this.onSearchFilterChange();
        }
      }
    });
  }

  onSearchFilterChange(): void {
    this.isSearching.set(true);
    const seller = this.sellerNameSearch.trim().toLowerCase();
    const buyer = this.buyerNameSearch.trim().toLowerCase();

    if (!seller && !buyer) {
      this.filteredTickets.set([]);
      this.isSearching.set(false);
      return;
    }

    const filtered = this.allTickets().filter(t => {
      const matchSeller = !seller || t.sellerName?.toLowerCase().includes(seller);
      const matchBuyer = !buyer || t.buyerName?.toLowerCase().includes(buyer);
      return matchSeller && matchBuyer;
    });

    this.filteredTickets.set(filtered);
  }

  selectTicket(t: Ticket): void {
    this.selectedTicket.set(t);
    this.clearMessages();
  }

  validateFood(): void {
    const ticket = this.selectedTicket();
    if (!ticket) return;

    if (ticket.ticketType !== 'CON_COMIDA') {
      this.errorMessage.set('No se puede entregar comida. El bono no es de tipo CON_COMIDA.');
      return;
    }

    if (ticket.status !== 'USADO_ENTRADA') {
      this.errorMessage.set(`No se puede entregar comida. El bono debe haber sido validado previamente en entrada (estado actual: ${ticket.status}).`);
      return;
    }

    this.clearMessages();
    this.validating.set(true);

    this.apiService.validateTicket({
      four_digit_code: ticket.fourDigitCode,
      public_token: ticket.publicToken,
      validation_type: 'COMIDA'
    }).subscribe({
      next: (res) => {
        this.validating.set(false);
        if (res.success && res.data) {
          const updatedTicket = res.data;
          this.selectedTicket.set(updatedTicket);
          this.successMessage.set('¡Comida entregada correctamente! El estado ha cambiado a USADO_COMIDA.');
          this.allTickets.update(list => list.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        } else {
          this.errorMessage.set(res.message || 'Error al validar la entrega de comida.');
        }
      },
      error: (err) => {
        this.validating.set(false);
        this.errorMessage.set(err.error?.message || 'Error al procesar la validación de comida.');
      }
    });
  }

  startCamera(): void {
    this.cameraError.set(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      this.cameraError.set('Tu navegador no soporta el acceso a la cámara.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then((stream) => {
        this.mediaStream = stream;
        this.cameraActive.set(true);
        if (this.videoElement) {
          const video = this.videoElement.nativeElement;
          video.srcObject = stream;
          video.setAttribute('playsinline', 'true');
          video.play().then(() => {
            this.startQrScanningLoop();
          }).catch(e => console.warn('Video play error:', e));
        }
      })
      .catch((err) => {
        this.cameraActive.set(false);
        this.cameraError.set('No se pudo acceder a la cámara. Revisa los permisos de tu dispositivo.');
        console.error('Camera access error:', err);
      });
  }

  private startQrScanningLoop(): void {
    const scanTick = () => {
      if (!this.cameraActive() || !this.videoElement?.nativeElement) {
        return;
      }
      const video = this.videoElement.nativeElement;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        this.scanCanvas.width = video.videoWidth;
        this.scanCanvas.height = video.videoHeight;
        if (this.scanContext) {
          this.scanContext.drawImage(video, 0, 0, this.scanCanvas.width, this.scanCanvas.height);
          const imageData = this.scanContext.getImageData(0, 0, this.scanCanvas.width, this.scanCanvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });
          if (code?.data) {
            const rawText = code.data.trim();
            this.handleScannedCode(rawText);
            return;
          }
        }
      }
      this.scanAnimFrameId = requestAnimationFrame(scanTick);
    };
    this.scanAnimFrameId = requestAnimationFrame(scanTick);
  }

  private handleScannedCode(rawText: string): void {
    this.stopCamera();
    let fourDigitCode = rawText;
    if (rawText.includes('/')) {
      const parts = rawText.split('/');
      fourDigitCode = parts.at(-1) || rawText;
    }

    if (fourDigitCode.length === 4 && /^\d{4}$/.test(fourDigitCode)) {
      this.fourDigitInput = fourDigitCode;
      this.searchByCode();
    } else {
      this.qrTokenInput = rawText;
      this.searchByToken();
    }
  }

  stopCamera(): void {
    if (this.scanAnimFrameId !== null) {
      cancelAnimationFrame(this.scanAnimFrameId);
      this.scanAnimFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'VENDIDO': return 'badge-vendido';
      case 'USADO_ENTRADA':
      case 'USADO_COMIDA': return 'badge-usado';
      case 'ANULADO': return 'badge-anulado';
      default: return '';
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
