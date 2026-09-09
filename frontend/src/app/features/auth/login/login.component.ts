import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  actionType: 'login' | 'register' | null = null;
  errorMessage = '';
  successMessage = '';

  async onGoogleSignIn(mode: 'login' | 'register'): Promise<void> {
    this.loading = true;
    this.actionType = mode;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const idToken = await this.firebaseAuthService.signInWithGoogle();
      this.authService.googleLogin(idToken).subscribe({
        next: (res) => {
          this.loading = false;
          this.actionType = null;
          if (res.success) {
            this.successMessage = mode === 'register' 
              ? 'Cuenta registrada correctamente. Redirigiendo...' 
              : 'Sesión iniciada con éxito';
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            setTimeout(() => this.router.navigateByUrl(returnUrl), 800);
          } else {
            this.errorMessage = res.error || 'Error en la autenticación';
          }
        },
        error: (err) => {
          this.loading = false;
          this.actionType = null;
          this.errorMessage = err.error?.error || err.error?.message || 'Error al validar credenciales de Google';
        }
      });
    } catch (err: any) {
      this.loading = false;
      this.actionType = null;
      this.errorMessage = err.message || 'Se canceló la ventana de autenticación de Google';
    }
  }

  onGoToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  onLogout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Sesión cerrada';
      }
    });
  }
}
