import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingApprovalComponent } from './pending-approval.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PendingApprovalComponent', () => {
  let component: PendingApprovalComponent;
  let fixture: ComponentFixture<PendingApprovalComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PendingApprovalComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ email: 'test@example.com', name: 'Test User' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load query params on init', () => {
    expect(component).toBeTruthy();
    expect(component.userEmail).toBe('test@example.com');
    expect(component.userName).toBe('Test User');
  });

  it('should navigate back to login on button click', () => {
    component.onBackToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

describe('PendingApprovalComponent without params', () => {
  let component: PendingApprovalComponent;
  let fixture: ComponentFixture<PendingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalComponent],
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fallback to empty strings if params are not provided', () => {
    expect(component.userEmail).toBe('');
    expect(component.userName).toBe('');
  });
});
