import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { QuickSaleDrawerComponent } from './shared/components/quick-sale-drawer/quick-sale-drawer.component';
import { AuthService } from './core/services/auth.service';
import { QuickSaleService } from './core/services/quick-sale.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastContainerComponent,
    BottomNavComponent,
    QuickSaleDrawerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'frontend';
  readonly authService = inject(AuthService);
  readonly quickSaleService = inject(QuickSaleService);

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
