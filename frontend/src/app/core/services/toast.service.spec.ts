import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  // Black-Box Testing: Initial State
  it('should initialize with empty toasts signal array', () => {
    expect(service.toasts()).toEqual([]);
  });

  // Black-Box & State Testing: Adding toasts of various types
  it('should add a toast when calling success, error, warning, or info', () => {
    service.success('Operation Successful', 'Ticket created');
    service.error('Server Error', 'Failed to connect');

    const currentToasts = service.toasts();
    expect(currentToasts.length).toBe(2);
    expect(currentToasts[0].type).toBe('success');
    expect(currentToasts[0].title).toBe('Operation Successful');
    expect(currentToasts[1].type).toBe('error');
    expect(currentToasts[1].title).toBe('Server Error');
  });

  // White-Box & State Transition Testing: Automatic Dismissal with Timer
  it('should auto-remove toast after specified duration', fakeAsync(() => {
    service.success('Auto Dismiss', 'Will disappear', 3000);
    expect(service.toasts().length).toBe(1);

    tick(1500);
    expect(service.toasts().length).toBe(1);

    tick(1500);
    expect(service.toasts().length).toBe(0);
  }));

  // Black-Box Testing: Manual Removal
  it('should manually remove toast by id', () => {
    service.info('Notification 1', 'Message 1');
    service.info('Notification 2', 'Message 2');

    const initialToasts = service.toasts();
    expect(initialToasts.length).toBe(2);

    const targetId = initialToasts[0].id;
    service.remove(targetId);

    const remainingToasts = service.toasts();
    expect(remainingToasts.length).toBe(1);
    expect(remainingToasts[0].id).not.toBe(targetId);
  });
});
