import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { QuickSaleDrawerComponent } from './shared/components/quick-sale-drawer/quick-sale-drawer.component';
import { SkeletonLoaderComponent } from './shared/components/skeleton-loader/skeleton-loader.component';
import { AuthService } from './core/services/auth.service';
import { QuickSaleService } from './core/services/quick-sale.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastContainerComponent,
    BottomNavComponent,
    QuickSaleDrawerComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'frontend';
  readonly authService = inject(AuthService);
  readonly quickSaleService = inject(QuickSaleService);
  private readonly router = inject(Router);

  isNavigating = signal<boolean>(false);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isNavigating.set(false);
      }
    });
  }

  openQuickSaleDrawer(): void {
    this.quickSaleService.open();
  }

  closeQuickSaleDrawer(): void {
    this.quickSaleService.close();
  }

  onTicketCreated(): void {
    this.quickSaleService.notifyTicketCreated();
  }
}
