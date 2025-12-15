import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ExpenseService } from '../../core/services/expense.service'; // Assuming created

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  expenseService = inject(ExpenseService);
  
  // Expose the signal from service
  expenses = this.expenseService.expenses;

  ngOnInit() {
    this.expenseService.loadExpenses();
  }

  logout() {
    this.authService.logout();
  }
}
