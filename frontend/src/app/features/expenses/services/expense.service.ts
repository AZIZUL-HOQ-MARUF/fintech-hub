import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/expenses`;
  
  expenses = signal<Expense[]>([]);

  createExpense(expense: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('expense', JSON.stringify(expense));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap(() => this.loadExpenses())
    );
  }

  updateExpense(id: number, expense: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('expense', JSON.stringify(expense));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.loadExpenses())
    );
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      tap(() => this.loadExpenses())
    );
  }

  loadExpenses() {
    this.http.get<any>(this.apiUrl)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if(res.data) {
            this.expenses.set(res.data);
          }
        },
        error: (err) => console.error('Failed to load expenses', err)
      });
  }
}
