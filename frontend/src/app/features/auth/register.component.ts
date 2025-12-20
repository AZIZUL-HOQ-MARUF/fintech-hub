import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, required, email, Field } from '@angular/forms/signals';
import { take } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, Field, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  authService = inject(AuthService);

  readonly #initialState = signal({
    fullName: '',
    email: '',
    password: ''
  });

  readonly registerForm = form(this.#initialState, (fields) => {
    required(fields.fullName, { message: 'Full name is required' });
    required(fields.email, { message: 'Email is required' });
    email(fields.email, { message: 'Invalid email address' });
    required(fields.password, { message: 'Password is required' });
  });

  onSubmit() {
    if (this.registerForm().invalid()) return;

    this.authService.register(this.registerForm().value())
      .pipe(take(1))
      .subscribe({
        next: () => console.log('Registration success'),
        error: (err) => alert('Registration failed: ' + err.message)
      });
  }
}
