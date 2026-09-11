import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { User, AdminQuotaOverviewResponse } from '../../../core/models/api.models';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUsers: User[] = [
    { id: 'u1', name: 'User One', email: 'u1@example.com', role: 'SELLER', status: 'ACTIVE' },
    { id: 'u2', name: 'User Two', email: 'u2@example.com', role: 'ADMIN', status: 'ACTIVE' }
  ];

  const mockQuotaOverview: AdminQuotaOverviewResponse = {
    default_personal_quota: 10,
    default_free_quota: 5,
    global_free_quota: { total_free_quota: 5, used_free_quota: 0, available_quota: 5 },
    sellers_quotas: [
      { seller_id: 'u1', seller_name: 'User One', seller_email: 'u1@example.com', assigned_quota: 15, used_quota: 3, remaining_personal: 12, assigned_free_quota: 5, used_free_quota: 1, remaining_free: 4, is_personal_exhausted: false, is_free_exhausted: false }
    ],
    free_quota_usage_by_seller: [],
    exhausted_sellers: []
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'listUsers',
      'getAdminQuotaOverview',
      'updateDefaultQuotaConfig',
      'updateQuota',
      'updateUserStatus',
      'updateUserRole'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'currentUser']);

    apiServiceSpy.listUsers.and.returnValue(of({ success: true, data: mockUsers }));
    apiServiceSpy.getAdminQuotaOverview.and.returnValue(of({ success: true, data: mockQuotaOverview }));
    authServiceSpy.currentUser.and.returnValue({ id: 'admin-id', name: 'Admin', email: 'admin@example.com', role: 'ADMIN', status: 'ACTIVE' });

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Black-Box Testing: User List & Quota Data Loading
  it('should load users and quota overview on init', () => {
    expect(component.users.length).toBe(2);
    expect(component.defaultQuotaInput).toBe(10);
    expect(component.sellerQuotaInputs['u1']).toBe(15);
  });

  // Black-Box Testing: Role Update
  it('should call updateUserRole and reload users on role change', () => {
    apiServiceSpy.updateUserRole.and.returnValue(of({ success: true, data: null }));

    component.updateRole('u1', 'ADMIN');

    expect(apiServiceSpy.updateUserRole).toHaveBeenCalledWith('u1', { role: 'ADMIN' });
    expect(apiServiceSpy.listUsers).toHaveBeenCalledTimes(2);
  });

  // Black-Box Testing: Status Update Error Handling
  it('should display danger message when updateUserStatus fails', () => {
    apiServiceSpy.updateUserStatus.and.returnValue(throwError(() => ({ error: { error: 'Permission denied' } })));

    component.updateStatus('u1', 'DISABLED');

    expect(component.message).toBe('Permission denied');
    expect(component.messageType).toBe('danger');
  });

  // Boundary Value Analysis: Negative quota input rejection
  it('should ignore saveDefaultQuota if defaultQuotaInput is negative', () => {
    component.defaultQuotaInput = -5;
    component.saveDefaultQuota();

    expect(apiServiceSpy.updateDefaultQuotaConfig).not.toHaveBeenCalled();
  });
});
