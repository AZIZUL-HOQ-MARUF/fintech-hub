import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/auth`;
  
  // Signals for state management
  currentUser = signal<User | null>(null);
  accessToken = signal<string | null>(localStorage.getItem('access_token'));
  
  isAuthenticated = computed(() => !!this.accessToken());

  constructor(private http: HttpClient, private router: Router) {
    if (this.accessToken()) {
        // Optimistically set user or decode token (omitted for brevity)
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => response.data), // Unwrap ApiResponse
      tap((data: AuthResponse) => {
        this.setSession(data);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      map(response => response.data),
       tap((data: AuthResponse) => {
        this.setSession(data);
      })
    );
  }

  logout() {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
    this.accessToken.set(authResult.accessToken);
    // In a real app, decode token to get user info here
    this.router.navigate(['/dashboard']);
  }
}
