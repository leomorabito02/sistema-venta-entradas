import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'dashboard' | 'tickets' | 'public-ticket' | 'validators' | 'admin-users' | 'login' | 'generic';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.css'
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'generic';
}
