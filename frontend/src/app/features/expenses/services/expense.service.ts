import { Injectable, signal, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
  
  readonly expensesResource = resource({
    loader: () => firstValueFrom(this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data as Expense[])
    ))
  });

  createExpense(expense: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('expense', JSON.stringify(expense));
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap(() => this.expensesResource.reload())
    );
  }

  updateExpense(id: number, expense: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('expense', JSON.stringify(expense));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.expensesResource.reload())
    );
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      tap(() => this.expensesResource.reload())
    );
  }
}
