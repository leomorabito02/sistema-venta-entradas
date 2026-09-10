import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.css'
})
export class PendingApprovalComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  userEmail = '';
  userName = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
      this.userName = params['name'] || '';
    });
  }

  onBackToLogin(): void {
    this.router.navigate(['/login']);
  }
}
