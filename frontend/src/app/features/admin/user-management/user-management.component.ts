import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, AdminQuotaOverviewResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  public readonly authService = inject(AuthService);

  users: User[] = [];
  loading = false;
  updatingUserId = signal<string | null>(null);

  quotaOverview = signal<AdminQuotaOverviewResponse | null>(null);
  loadingQuota = signal<boolean>(false);

  defaultQuotaInput = 0;
  defaultFreeQuotaInput = 5;
  freeQuotaInput = 0;
  savingDefaultQuota = false;
  savingDefaultFreeQuota = false;
  savingFreeQuota = false;

  sellerQuotaInputs: { [sellerId: string]: number } = {};
  sellerFreeQuotaInputs: { [sellerId: string]: number } = {};
  savingSellerQuotaId = signal<string | null>(null);

  message = '';
  messageType: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadUsers();
    this.loadQuotaOverview();
  }

  loadUsers(): void {
    this.loading = true;
    this.message = '';

    this.apiService.listUsers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.error?.error || 'Error al obtener lista de usuarios', 'danger');
      }
    });
  }

  loadQuotaOverview(): void {
    this.loadingQuota.set(true);

    this.apiService.getAdminQuotaOverview().subscribe({
      next: (res) => {
        this.loadingQuota.set(false);
        if (res.success && res.data) {
          this.quotaOverview.set(res.data);
          this.defaultQuotaInput = res.data.default_personal_quota;
          this.defaultFreeQuotaInput = res.data.default_free_quota ?? 5;
          this.freeQuotaInput = res.data.global_free_quota?.total_free_quota ?? 5;

          res.data.sellers_quotas.forEach(s => {
            this.sellerQuotaInputs[s.seller_id] = s.assigned_quota;
            this.sellerFreeQuotaInputs[s.seller_id] = s.assigned_free_quota ?? 5;
          });
        }
      },
      error: (err) => {
        this.loadingQuota.set(false);
        this.showMessage(err.error?.error || 'Error al cargar resumen de cuotas', 'danger');
      }
    });
  }

  saveDefaultQuota(): void {
    if (this.defaultQuotaInput < 0) return;
    this.savingDefaultQuota = true;

    this.apiService.updateDefaultQuotaConfig({ default_personal_quota: this.defaultQuotaInput }).subscribe({
      next: (res) => {
        this.savingDefaultQuota = false;
        if (res.success) {
          this.showMessage('Cuota personal inicial por defecto actualizada', 'success');
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingDefaultQuota = false;
        this.showMessage(err.error?.error || 'Error al actualizar cuota personal por defecto', 'danger');
      }
    });
  }

  saveDefaultFreeQuota(): void {
    if (this.defaultFreeQuotaInput < 0) return;
    this.savingDefaultFreeQuota = true;

    this.apiService.updateDefaultQuotaConfig({ default_free_quota: this.defaultFreeQuotaInput }).subscribe({
      next: (res) => {
        this.savingDefaultFreeQuota = false;
        if (res.success) {
          this.showMessage('Cuota libre inicial por defecto actualizada', 'success');
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingDefaultFreeQuota = false;
        this.showMessage(err.error?.error || 'Error al actualizar cuota libre por defecto', 'danger');
      }
    });
  }

  saveFreeQuota(): void {
    if (this.freeQuotaInput < 0) return;
    this.savingFreeQuota = true;

    this.apiService.updateQuota({ quota_type: 'FREE', assigned_quota: this.freeQuotaInput }).subscribe({
      next: (res) => {
        this.savingFreeQuota = false;
        if (res.success) {
          this.showMessage('Cuota libre por defecto asignada a todos los usuarios', 'success');
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingFreeQuota = false;
        this.showMessage(err.error?.error || 'Error al actualizar cuota libre general', 'danger');
      }
    });
  }

  saveSellerQuota(sellerId: string): void {
    const val = this.sellerQuotaInputs[sellerId];
    if (val === undefined || val < 0) return;

    this.savingSellerQuotaId.set(sellerId);

    this.apiService.updateQuota({ quota_type: 'PERSONAL', seller_id: sellerId, assigned_quota: val }).subscribe({
      next: (res) => {
        this.savingSellerQuotaId.set(null);
        if (res.success) {
          this.showMessage('Cuota personal del vendedor actualizada correctamente', 'success');
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingSellerQuotaId.set(null);
        this.showMessage(err.error?.error || 'Error al actualizar cuota del vendedor', 'danger');
      }
    });
  }

  saveSellerFreeQuota(sellerId: string): void {
    const val = this.sellerFreeQuotaInputs[sellerId];
    if (val === undefined || val < 0) return;

    this.savingSellerQuotaId.set(sellerId);

    this.apiService.updateQuota({ quota_type: 'FREE', seller_id: sellerId, assigned_quota: val }).subscribe({
      next: (res) => {
        this.savingSellerQuotaId.set(null);
        if (res.success) {
          this.showMessage('Cuota libre del vendedor actualizada correctamente', 'success');
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingSellerQuotaId.set(null);
        this.showMessage(err.error?.error || 'Error al actualizar cuota libre del vendedor', 'danger');
      }
    });
  }

  updateStatus(userId: string, newStatus: 'ACTIVE' | 'DISABLED'): void {
    this.updatingUserId.set(userId);
    this.message = '';

    this.apiService.updateUserStatus(userId, { status: newStatus }).subscribe({
      next: (res) => {
        this.updatingUserId.set(null);
        if (res.success) {
          this.showMessage(`Estado de usuario actualizado a ${newStatus}`, 'success');
          this.loadUsers();
        }
      },
      error: (err) => {
        this.updatingUserId.set(null);
        this.showMessage(err.error?.error || 'Error al actualizar estado del usuario', 'danger');
      }
    });
  }

  updateRole(userId: string, newRole: 'ADMIN' | 'SELLER'): void {
    this.updatingUserId.set(userId);
    this.message = '';

    this.apiService.updateUserRole(userId, { role: newRole }).subscribe({
      next: (res) => {
        this.updatingUserId.set(null);
        if (res.success) {
          this.showMessage(`Rol de usuario actualizado a ${newRole}`, 'success');
          this.loadUsers();
        }
      },
      error: (err) => {
        this.updatingUserId.set(null);
        this.showMessage(err.error?.error || 'Error al actualizar rol del usuario', 'danger');
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'danger'): void {
    this.message = msg;
    this.messageType = type;
  }
}
