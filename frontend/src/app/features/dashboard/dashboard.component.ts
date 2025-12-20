import { Component, inject, DestroyRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';
import { Expense, ExpenseService } from '../expenses/services/expense.service';
import { ExpenseListComponent } from '../expenses/expense-list/expense-list.component';
import { ExpenseFormComponent } from '../expenses/expense-form/expense-form.component';
import { ZardDialogService } from '../../shared/components/dialog/dialog.service';
import { ZardButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ExpenseListComponent, ZardButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  authService = inject(AuthService);
  expenseService = inject(ExpenseService);
  private dialogService = inject(ZardDialogService);
  private destroyRef = inject(DestroyRef);
  expenses = computed(() => this.expenseService.expensesResource.value() ?? []);
  
  totalExpenses = computed(() => {
    return this.expenses().reduce((sum: number, e: Expense) => sum + (e.amount || 0), 0);
  });

  constructor() {
    this.expenseService.expensesResource.reload();
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

    dialogRef.afterClosed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        if (result) {
          this.expenseService.expensesResource.reload();
        }
      });
  }

  logout() {
    this.authService.logout();
  }
}
