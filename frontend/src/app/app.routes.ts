import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      )
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      )
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tickets/ticket-list/ticket-list.component').then(
        (m) => m.TicketListComponent
      )
  },
  {
    path: 'validar-entrada',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tickets/validate-entry/validate-entry.component').then(
        (m) => m.ValidateEntryComponent
      )
  },
  { path: 'quotas', redirectTo: 'validar-entrada', pathMatch: 'full' },
  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      )
  },
  {
    path: 'validar-comida',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tickets/validate-food/validate-food.component').then(
        (m) => m.ValidateFoodComponent
      )
  },
  {
    path: 'api/tickets/public/:token',
    loadComponent: () =>
      import('./features/tickets/public-ticket-view/public-ticket-view.component').then(
        (m) => m.PublicTicketViewComponent
      )
  },
  {
    path: 'tickets/public/:token',
    loadComponent: () =>
      import('./features/tickets/public-ticket-view/public-ticket-view.component').then(
        (m) => m.PublicTicketViewComponent
      )
  },
  { path: '**', redirectTo: 'dashboard' }
];
