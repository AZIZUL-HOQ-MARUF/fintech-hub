import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense, ExpenseService } from '../services/expense.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';
import { ZardTableModule } from '../../../shared/components/table/table.module';
import { ZardCardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTableModule, ZardCardComponent],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent {
  @Input() expenses: Expense[] = [];
  @Output() edit = new EventEmitter<Expense>();
  
  private expenseService = inject(ExpenseService);

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe();
    }
  }
}
