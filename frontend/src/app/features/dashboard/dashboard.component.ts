import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { ExpenseListComponent } from '../expenses/expense-list.component';
import { ExpenseFormComponent } from '../expenses/expense-form.component';
import { ZardDialogService } from '../../shared/components/dialog/dialog.service';
import { ZardButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ExpenseListComponent, ZardButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  expenseService = inject(ExpenseService);
  private dialogService = inject(ZardDialogService);
  
  expenses = this.expenseService.expenses;

  ngOnInit() {
    this.expenseService.loadExpenses();
  }

  openExpenseForm(expense?: Expense) {
    const dialogRef = this.dialogService.create({
      zTitle: expense ? 'Edit Expense' : 'New Expense',
      zContent: ExpenseFormComponent,
      zData: { expense },
      zWidth: '500px',
      zHideFooter: true,
      zMaskClosable: false,
    });

    dialogRef.afterClosed.subscribe((result: any) => {
      if (result) {
        this.expenseService.loadExpenses();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
