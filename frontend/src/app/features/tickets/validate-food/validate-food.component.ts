import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsQR from 'jsqr';
import { ApiService, Ticket } from '../../../core/services/api.service';

export interface ValidationOverlayState {
  type: 'success' | 'food-success' | 'error' | 'warning';
  title: string;
  ticket?: Ticket;
  buyerName?: string;
  sellerName?: string;
  createdAt?: string;
  ticketType?: string;
  entryValidatedAt?: string;
  entryValidatorName?: string;
  foodValidatedAt?: string;
  foodValidatorName?: string;
  pricePaid?: number;
  details?: string;
}

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

  sellerNameSearch = '';
  buyerNameSearch = '';

  allTickets = signal<Ticket[]>([]);
  filteredTickets = signal<Ticket[]>([]);
  isSearching = signal(false);

  selectedTicket = signal<Ticket | null>(null);
  loading = signal(false);
  validating = signal(false);

  validationOverlay = signal<ValidationOverlayState | null>(null);

  cameraActive = signal(false);
  cameraError = signal<string | null>(null);
  private mediaStream: MediaStream | null = null;
  private scanAnimFrameId: number | null = null;
  private readonly scanCanvas: HTMLCanvasElement = document.createElement('canvas');
  private readonly scanContext = this.scanCanvas.getContext('2d', { willReadFrequently: true });

  switchMode(mode: ValidationMode): void {
    this.activeMode.set(mode);
    this.dismissOverlay();
    if (mode !== 'qr' && this.cameraActive()) {
      this.stopCamera();
    }
    if (mode === 'search' && this.allTickets().length === 0) {
      this.loadAllTickets();
    }
  }

  appendDigit(digit: string): void {
    if (this.fourDigitInput.length < 4) {
      this.fourDigitInput += digit;
      if (this.fourDigitInput.length === 4) {
        this.searchByCode();
      }
    }
  }

  deleteDigit(): void {
    if (this.fourDigitInput.length > 0) {
      this.fourDigitInput = this.fourDigitInput.slice(0, -1);
    }
  }

  clearDigit(): void {
    this.fourDigitInput = '';
  }

  dismissOverlay(): void {
    this.validationOverlay.set(null);
    this.selectedTicket.set(null);
    this.fourDigitInput = '';
    if (this.activeMode() === 'qr' && !this.cameraActive()) {
      this.startCamera();
    }
  }

  triggerHaptic(success: boolean): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (success) {
        navigator.vibrate([150, 50, 150]);
      } else {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }

  private handleFoodSuccess(t: Ticket): void {
    this.triggerHaptic(true);
    this.allTickets.update(tickets => tickets.map(item => item.id === t.id ? { ...item, ...t } : item));
    this.onSearchFilterChange();
    const buyerName = t.buyerName || (t.buyer ? `${t.buyer.first_name} ${t.buyer.last_name}` : 'Comprador General');
    this.validationOverlay.set({
      type: 'food-success',
      title: 'Bono validado para retirar comida',
      ticket: t,
      buyerName: buyerName,
      sellerName: t.sellerName || 'Sistema / Vendedor',
      createdAt: t.createdAt,
      ticketType: t.ticketType === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE (Solo Entrada)',
      entryValidatedAt: t.entryValidatedAt,
      entryValidatorName: t.entryValidatorName,
      foodValidatedAt: t.foodValidatedAt || new Date().toISOString(),
      foodValidatorName: t.foodValidatorName,
      pricePaid: t.pricePaid
    });
  }

  private handleFoodError(err: any, fallbackTicket?: Ticket): void {
    this.triggerHaptic(false);
    const errorMsg = (err?.error?.error || err?.error?.message || err?.message || '').toLowerCase();

    const isSimple = fallbackTicket?.ticketType === 'SIMPLE' || errorMsg.includes('simple') || errorMsg.includes('no incluye comida');
    const isAnnulled = fallbackTicket?.status === 'ANULADO' || errorMsg.includes('anulad');
    const notEnteredYet = fallbackTicket?.status === 'VENDIDO' || errorMsg.includes('ingreso') || errorMsg.includes('entrada') || errorMsg.includes('puerta');
    const foodAlreadyDelivered = fallbackTicket?.status === 'USADO_COMIDA' || errorMsg.includes('entregad') || errorMsg.includes('ya retirad');

    if (isAnnulled) {
      this.validationOverlay.set({
        type: 'error',
        title: 'La entrada está anulada',
        details: 'Este bono fue anulado y no es válido para comida.'
      });
    } else if (isSimple && notEnteredYet) {
      this.validationOverlay.set({
        type: 'error',
        title: 'El ticket no incluye comida',
        buyerName: fallbackTicket?.buyerName,
        sellerName: fallbackTicket?.sellerName,
        createdAt: fallbackTicket?.createdAt,
        ticketType: 'SIMPLE (Solo Entrada)',
        entryValidatedAt: fallbackTicket?.entryValidatedAt,
        entryValidatorName: fallbackTicket?.entryValidatorName,
        foodValidatedAt: fallbackTicket?.foodValidatedAt,
        foodValidatorName: fallbackTicket?.foodValidatorName,
        pricePaid: fallbackTicket?.pricePaid,
        details: 'El ticket no incluye comida y debe validar el ingreso en puerta.'
      });
    } else if (isSimple) {
      this.validationOverlay.set({
        type: 'error',
        title: 'El ticket no incluye comida',
        buyerName: fallbackTicket?.buyerName,
        sellerName: fallbackTicket?.sellerName,
        createdAt: fallbackTicket?.createdAt,
        ticketType: 'SIMPLE (Solo Entrada)',
        entryValidatedAt: fallbackTicket?.entryValidatedAt,
        entryValidatorName: fallbackTicket?.entryValidatorName,
        foodValidatedAt: fallbackTicket?.foodValidatedAt,
        foodValidatorName: fallbackTicket?.foodValidatorName,
        pricePaid: fallbackTicket?.pricePaid,
        details: 'Este bono es de tipo SIMPLE y no incluye beneficio de comida.'
      });
    } else if (notEnteredYet) {
      this.validationOverlay.set({
        type: 'warning',
        title: 'Debe validar el ingreso',
        buyerName: fallbackTicket?.buyerName,
        sellerName: fallbackTicket?.sellerName,
        createdAt: fallbackTicket?.createdAt,
        ticketType: fallbackTicket?.ticketType === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE (Solo Entrada)',
        entryValidatedAt: fallbackTicket?.entryValidatedAt,
        entryValidatorName: fallbackTicket?.entryValidatorName,
        foodValidatedAt: fallbackTicket?.foodValidatedAt,
        foodValidatorName: fallbackTicket?.foodValidatorName,
        pricePaid: fallbackTicket?.pricePaid,
        details: 'El bono debe registrar primero el ingreso en puerta antes de retirar la comida.'
      });
    } else if (foodAlreadyDelivered) {
      this.validationOverlay.set({
        type: 'warning',
        title: 'La comida ya fue entregada',
        buyerName: fallbackTicket?.buyerName,
        sellerName: fallbackTicket?.sellerName,
        createdAt: fallbackTicket?.createdAt,
        ticketType: 'CON COMIDA',
        entryValidatedAt: fallbackTicket?.entryValidatedAt,
        entryValidatorName: fallbackTicket?.entryValidatorName,
        foodValidatedAt: fallbackTicket?.foodValidatedAt,
        foodValidatorName: fallbackTicket?.foodValidatorName,
        pricePaid: fallbackTicket?.pricePaid,
        details: 'Este bono ya retiró la comida anteriormente.'
      });
    } else {
      this.validationOverlay.set({
        type: 'error',
        title: 'La entrada no es válida',
        details: 'No existe ningún bono registrado con este código o token.'
      });
    }
  }

  private findFallbackAndHandleError(code?: string, token?: string, err?: any): void {
    if (!code && !token) {
      this.handleFoodError(err);
      return;
    }

    this.apiService.listTickets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const matched = res.data.find(t =>
            (code && t.fourDigitCode === code) ||
            (token && t.publicToken === token)
          );
          this.handleFoodError(err, matched);
        } else {
          this.handleFoodError(err);
        }
      },
      error: () => {
        this.handleFoodError(err);
      }
    });
  }

  searchByCode(): void {
    const code = this.fourDigitInput.trim();
    if (code.length !== 4) {
      this.triggerHaptic(false);
      this.validationOverlay.set({
        type: 'error',
        title: 'La entrada no es válida',
        details: 'El código debe ser exactamente de 4 dígitos.'
      });
      return;
    }

    this.loading.set(true);
    this.apiService.validateTicket({
      four_digit_code: code,
      validation_type: 'COMIDA'
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.handleFoodSuccess(res.data);
        } else {
          this.findFallbackAndHandleError(code, undefined, { error: { message: res.message } });
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.findFallbackAndHandleError(code, undefined, err);
      }
    });
  }

  validateFoodDirect(ticket: Ticket): void {
    this.validating.set(true);

    // Pre-check ticket properties before calling API to give exact title per requirements
    if (ticket.status === 'ANULADO') {
      this.validating.set(false);
      this.handleFoodError({ error: { message: 'anulado' } }, ticket);
      return;
    }

    if (ticket.ticketType === 'SIMPLE') {
      this.validating.set(false);
      this.handleFoodError({ error: { message: 'simple' } }, ticket);
      return;
    }

    if (ticket.status === 'VENDIDO') {
      this.validating.set(false);
      this.handleFoodError({ error: { message: 'debe validar ingreso' } }, ticket);
      return;
    }

    if (ticket.status === 'USADO_COMIDA') {
      this.validating.set(false);
      this.handleFoodError({ error: { message: 'la comida ya fue entregada' } }, ticket);
      return;
    }

    this.apiService.validateTicket({
      four_digit_code: ticket.fourDigitCode,
      public_token: ticket.publicToken,
      validation_type: 'COMIDA'
    }).subscribe({
      next: (res) => {
        this.validating.set(false);
        if (res.success && res.data) {
          this.handleFoodSuccess(res.data);
        } else {
          this.handleFoodError({ error: { message: res.message } }, ticket);
        }
      },
      error: (err) => {
        this.validating.set(false);
        this.handleFoodError(err, ticket);
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
  }

  startCamera(): void {
    this.cameraError.set(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      this.cameraError.set('Tu navegador no soporta el acceso a la cámara.');
      return;
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
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
        this.cameraError.set('No se pudo acceder a la cámara. Revisa los permisos.');
        console.error('Camera access error:', err);
      });
  }

  private startQrScanningLoop(): void {
    let lastScanTime = 0;
    const SCAN_INTERVAL_MS = 90;
    const nativeDetector = this.initNativeDetector();

    const scanTick = async () => {
      if (!this.cameraActive() || !this.videoElement?.nativeElement) {
        return;
      }

      const video = this.videoElement.nativeElement;
      const now = performance.now();

      if (video.readyState === video.HAVE_ENOUGH_DATA && (now - lastScanTime >= SCAN_INTERVAL_MS)) {
        lastScanTime = now;

        const nativeResult = await this.detectWithNativeApi(nativeDetector, video);
        if (nativeResult) {
          this.handleScannedCode(nativeResult);
          return;
        }

        const jsQrResult = this.detectWithJsQr(video);
        if (jsQrResult) {
          this.handleScannedCode(jsQrResult);
          return;
        }
      }

      if (this.cameraActive()) {
        this.scanAnimFrameId = requestAnimationFrame(scanTick);
      }
    };

    this.scanAnimFrameId = requestAnimationFrame(scanTick);
  }

  private initNativeDetector(): any {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        return new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        return null;
      }
    }
    return null;
  }

  private async detectWithNativeApi(nativeDetector: any, video: HTMLVideoElement): Promise<string | null> {
    if (!nativeDetector) return null;
    try {
      const barcodes = await nativeDetector.detect(video);
      if (barcodes.length > 0 && barcodes[0]?.rawValue) {
        return barcodes[0].rawValue.trim();
      }
    } catch {
      // Fallback
    }
    return null;
  }

  private detectWithJsQr(video: HTMLVideoElement): string | null {
    if (!this.scanContext) return null;
    const MAX_WIDTH = 640;
    const scale = Math.min(1, MAX_WIDTH / (video.videoWidth || 640));
    const canvasWidth = Math.floor((video.videoWidth || 640) * scale);
    const canvasHeight = Math.floor((video.videoHeight || 480) * scale);

    if (this.scanCanvas.width !== canvasWidth || this.scanCanvas.height !== canvasHeight) {
      this.scanCanvas.width = canvasWidth;
      this.scanCanvas.height = canvasHeight;
    }

    this.scanContext.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    const imageData = this.scanContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });

    return code?.data ? code.data.trim() : null;
  }

  private handleScannedCode(rawText: string): void {
    this.stopCamera();
    let token = rawText;
    let fourDigitCode = '';

    if (rawText.includes('/')) {
      const parts = rawText.split('/');
      token = parts.at(-1) || rawText;
    }

    if (token.length === 4 && /^\d{4}$/.test(token)) {
      fourDigitCode = token;
      token = '';
    }

    this.loading.set(true);
    this.apiService.validateTicket({
      four_digit_code: fourDigitCode || undefined,
      public_token: token || undefined,
      validation_type: 'COMIDA'
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.handleFoodSuccess(res.data);
        } else {
          this.findFallbackAndHandleError(fourDigitCode, token, { error: { message: res.message } });
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.findFallbackAndHandleError(fourDigitCode, token, err);
      }
    });
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
      case 'VENDIDO': return 'neu-badge-vendido';
      case 'USADO_ENTRADA':
      case 'USADO_COMIDA': return 'neu-badge-usado';
      case 'ANULADO': return 'neu-badge-anulado';
      default: return '';
    }
  }

  formatStatus(status?: string): string {
    if (!status) return '';
    return status.replaceAll('_', ' ');
  }

  formatType(type?: string): string {
    if (!type) return '';
    return type.replaceAll('_', ' ');
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
