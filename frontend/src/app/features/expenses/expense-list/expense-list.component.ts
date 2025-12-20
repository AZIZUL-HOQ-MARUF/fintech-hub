import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { Expense, ExpenseService } from '../services/expense.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';
import { ZardTableModule } from '../../../shared/components/table/table.module';
import { ZardCardComponent } from '../../../shared/components/card/card.component';
import { ZardIconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTableModule, ZardCardComponent, ZardIconComponent],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent {
  expenses = input<Expense[]>([]);
  edit = output<Expense>();
  
  private expenseService = inject(ExpenseService);

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id)
        .pipe(take(1))
        .subscribe();
    }
  }

  refresh() {
    this.expenseService.loadExpenses();
  }
}
