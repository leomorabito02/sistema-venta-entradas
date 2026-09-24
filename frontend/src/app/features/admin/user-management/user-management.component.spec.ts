import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { User, AdminQuotaOverviewResponse } from '../../../core/models/api.models';
import { By } from '@angular/platform-browser';

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
    apiServiceSpy.updateDefaultQuotaConfig.and.returnValue(of({ success: true }));
    apiServiceSpy.updateQuota.and.returnValue(of({ success: true }));
    apiServiceSpy.updateUserStatus.and.returnValue(of({ success: true }));
    apiServiceSpy.updateUserRole.and.returnValue(of({ success: true }));

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

  describe('Initialization and Loading', () => {
    it('should load users and quota overview on init', () => {
      expect(component.users).toHaveSize(2);
      expect(component.defaultQuotaInput).toBe(10);
      expect(component.defaultFreeQuotaInput).toBe(5);
      expect(component.freeQuotaInput).toBe(5);
      expect(component.sellerQuotaInputs['u1']).toBe(15);
      expect(component.sellerFreeQuotaInputs['u1']).toBe(5);
    });

    it('should handle listUsers error', () => {
      apiServiceSpy.listUsers.and.returnValue(throwError(() => ({ error: { error: 'Users Error' } })));
      component.loadUsers();
      expect(component.message).toBe('Users Error');
      expect(component.messageType).toBe('danger');
    });

    it('should handle getAdminQuotaOverview error', () => {
      apiServiceSpy.getAdminQuotaOverview.and.returnValue(throwError(() => ({ error: { error: 'Quota Error' } })));
      component.loadQuotaOverview();
      expect(component.message).toBe('Quota Error');
      expect(component.messageType).toBe('danger');
    });
  });

  describe('Quota Management', () => {
    it('should save default quota successfully', () => {
      component.defaultQuotaInput = 20;
      component.saveDefaultQuota();
      expect(apiServiceSpy.updateDefaultQuotaConfig).toHaveBeenCalledWith({ default_personal_quota: 20 });
      expect(apiServiceSpy.getAdminQuotaOverview).toHaveBeenCalledTimes(2); // init + refresh
      expect(component.messageType).toBe('success');
    });

    it('should handle save default quota error', () => {
      apiServiceSpy.updateDefaultQuotaConfig.and.returnValue(throwError(() => ({ error: { error: 'Update Error' } })));
      component.defaultQuotaInput = 20;
      component.saveDefaultQuota();
      expect(component.message).toBe('Update Error');
      expect(component.messageType).toBe('danger');
    });

    it('should not save default quota if negative', () => {
      component.defaultQuotaInput = -5;
      component.saveDefaultQuota();
      expect(apiServiceSpy.updateDefaultQuotaConfig).not.toHaveBeenCalled();
    });

    it('should save default free quota successfully', () => {
      component.defaultFreeQuotaInput = 10;
      component.saveDefaultFreeQuota();
      expect(apiServiceSpy.updateDefaultQuotaConfig).toHaveBeenCalledWith({ default_free_quota: 10 });
      expect(component.messageType).toBe('success');
    });

    it('should handle save default free quota error', () => {
      apiServiceSpy.updateDefaultQuotaConfig.and.returnValue(throwError(() => ({ error: { error: 'Free Update Error' } })));
      component.defaultFreeQuotaInput = 10;
      component.saveDefaultFreeQuota();
      expect(component.message).toBe('Free Update Error');
      expect(component.messageType).toBe('danger');
    });

    it('should save free quota successfully', () => {
      component.freeQuotaInput = 100;
      component.saveFreeQuota();
      expect(apiServiceSpy.updateQuota).toHaveBeenCalledWith({ quota_type: 'FREE', assigned_quota: 100 });
      expect(component.messageType).toBe('success');
    });

    it('should handle save free quota error', () => {
      apiServiceSpy.updateQuota.and.returnValue(throwError(() => ({ error: { error: 'Global Free Error' } })));
      component.freeQuotaInput = 100;
      component.saveFreeQuota();
      expect(component.message).toBe('Global Free Error');
      expect(component.messageType).toBe('danger');
    });

    it('should save seller quota successfully', () => {
      component.sellerQuotaInputs['u1'] = 25;
      component.saveSellerQuota('u1');
      expect(apiServiceSpy.updateQuota).toHaveBeenCalledWith({ quota_type: 'PERSONAL', seller_id: 'u1', assigned_quota: 25 });
      expect(component.messageType).toBe('success');
    });

    it('should handle save seller quota error', () => {
      apiServiceSpy.updateQuota.and.returnValue(throwError(() => ({ error: { error: 'Seller Quota Error' } })));
      component.sellerQuotaInputs['u1'] = 25;
      component.saveSellerQuota('u1');
      expect(component.message).toBe('Seller Quota Error');
      expect(component.messageType).toBe('danger');
    });

    it('should not save seller quota if negative or undefined', () => {
      component.sellerQuotaInputs['u1'] = -1;
      component.saveSellerQuota('u1');
      component.saveSellerQuota('non-existent');
      expect(apiServiceSpy.updateQuota).not.toHaveBeenCalled();
    });

    it('should save seller free quota successfully', () => {
      component.sellerFreeQuotaInputs['u1'] = 30;
      component.saveSellerFreeQuota('u1');
      expect(apiServiceSpy.updateQuota).toHaveBeenCalledWith({ quota_type: 'FREE', seller_id: 'u1', assigned_quota: 30 });
      expect(component.messageType).toBe('success');
    });

    it('should handle save seller free quota error', () => {
      apiServiceSpy.updateQuota.and.returnValue(throwError(() => ({ error: { error: 'Seller Free Quota Error' } })));
      component.sellerFreeQuotaInputs['u1'] = 30;
      component.saveSellerFreeQuota('u1');
      expect(component.message).toBe('Seller Free Quota Error');
      expect(component.messageType).toBe('danger');
    });
  });

  describe('User Status and Role', () => {
    it('should update user status successfully', () => {
      component.updateStatus('u1', 'DISABLED');
      expect(apiServiceSpy.updateUserStatus).toHaveBeenCalledWith('u1', { status: 'DISABLED' });
      expect(apiServiceSpy.listUsers).toHaveBeenCalledTimes(2); // init + refresh
      expect(component.messageType).toBe('success');
    });

    it('should handle update user status error', () => {
      apiServiceSpy.updateUserStatus.and.returnValue(throwError(() => ({ error: { error: 'Status Error' } })));
      component.updateStatus('u1', 'DISABLED');
      expect(component.message).toBe('Status Error');
      expect(component.messageType).toBe('danger');
    });

    it('should update user role successfully', () => {
      component.updateRole('u1', 'ADMIN');
      expect(apiServiceSpy.updateUserRole).toHaveBeenCalledWith('u1', { role: 'ADMIN' });
      expect(component.messageType).toBe('success');
    });

    it('should handle update user role error', () => {
      apiServiceSpy.updateUserRole.and.returnValue(throwError(() => ({ error: { error: 'Role Error' } })));
      component.updateRole('u1', 'ADMIN');
      expect(component.message).toBe('Role Error');
      expect(component.messageType).toBe('danger');
    });
  });
});
