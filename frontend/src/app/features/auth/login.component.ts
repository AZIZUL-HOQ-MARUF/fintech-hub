import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, required, email, Field } from '@angular/forms/signals';
import { take } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Field, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authService = inject(AuthService);

  readonly #initialState = signal({
    email: '',
    password: ''
  });

  readonly loginForm = form(this.#initialState, (fields) => {
    required(fields.email, { message: 'Email is required' });
    email(fields.email, { message: 'Invalid email address' });
    required(fields.password, { message: 'Password is required' });
  });

  onSubmit() {
    if (this.loginForm().invalid()) return;

    this.authService.login(this.loginForm().value())
      .pipe(take(1))
      .subscribe({
        next: () => console.log('Login success'),
        error: (err) => alert('Login failed: ' + err.message)
      });
  }
}
