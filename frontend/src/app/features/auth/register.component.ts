import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  authService = inject(AuthService);

  onSubmit() {
    this.authService.register({ fullName: this.fullName, email: this.email, password: this.password }).subscribe({
      next: () => console.log('Registration success'),
      error: (err) => alert('Registration failed: ' + err.message)
    });
  }
}
