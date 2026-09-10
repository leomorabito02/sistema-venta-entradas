import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Output() openQuickSale = new EventEmitter<void>();

  onQuickSaleClick(): void {
    this.openQuickSale.emit();
  }

  isCurrentRoute(routePath: string): boolean {
    return this.router.url.startsWith(routePath);
  }
}
