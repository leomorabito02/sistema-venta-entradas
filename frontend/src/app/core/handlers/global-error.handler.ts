import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly injector: Injector, private readonly zone: NgZone) {}

  handleError(error: any): void {
    console.error('Unhandled Application Error:', error);

    const toastService = this.injector.get(ToastService);
    const message = error?.message || 'Se ha producido un error inesperado en la aplicación.';

    this.zone.run(() => {
      toastService.error('Error de Aplicación', message);
    });
  }
}
