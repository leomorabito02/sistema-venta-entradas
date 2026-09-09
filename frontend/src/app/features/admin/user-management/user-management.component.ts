import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/api.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  public readonly authService = inject(AuthService);

  users: User[] = [];
  loading = false;
  updatingUserId = signal<string | null>(null);
  message = '';
  messageType: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadUsers();
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
