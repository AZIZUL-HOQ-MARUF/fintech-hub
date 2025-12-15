import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  authService = inject(AuthService);

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => console.log('Login success'),
      error: (err) => alert('Login failed: ' + err.message)
    });
  }
}
