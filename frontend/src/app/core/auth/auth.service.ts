import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from '../services/toast.service';

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
  refreshTokenSignal = signal<string | null>(localStorage.getItem('refresh_token'));
  
  isAuthenticated = computed(() => !!this.accessToken());

  constructor(
      private http: HttpClient, 
      private router: Router,
      private toastService: ToastService
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => response.data),
      tap((data: AuthResponse) => {
        this.setSession(data);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      map(response => response.data),
      tap((data: AuthResponse) => {
        this.setSession(data);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const token = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { token }).pipe(
      map(response => response.data),
      tap((data: AuthResponse) => {
        this.setSession(data);
      })
    );
  }

  logout(message?: string) {
    this.accessToken.set(null);
    this.refreshTokenSignal.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    if (message) {
      this.toastService.error(message);
    }
    
    this.router.navigate(['/auth/login']);
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
    this.accessToken.set(authResult.accessToken);
    this.refreshTokenSignal.set(authResult.refreshToken);
  }
}
