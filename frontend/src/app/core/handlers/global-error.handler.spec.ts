import { TestBed } from '@angular/core/testing';
import { Injector, NgZone } from '@angular/core';
import { GlobalErrorHandler } from './global-error.handler';
import { ToastService } from '../services/toast.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    });

    handler = TestBed.inject(GlobalErrorHandler);
  });

  it('should catch unhandled error and show error toast inside NgZone', () => {
    const testError = new Error('Uncaught runtime exception');
    spyOn(console, 'error');

    handler.handleError(testError);

    expect(console.error).toHaveBeenCalled();
    expect(toastServiceSpy.error).toHaveBeenCalledWith('Error de Aplicación', 'Uncaught runtime exception');
  });
});
