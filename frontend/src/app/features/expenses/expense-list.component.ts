import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { ZardButtonComponent } from '../../shared/components/button/button.component';
import { ZardTableModule } from '../../shared/components/table/table.module';
import { ZardCardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTableModule, ZardCardComponent],
  template: `
    <z-card>
      <div class="overflow-hidden">
        <table z-table class="w-full">
          <thead z-table-header class="bg-gray-50/50">
            <tr z-table-row>
              <th z-table-head class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th z-table-head class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th z-table-head class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th z-table-head class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th z-table-head class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody z-table-body class="divide-y divide-gray-100">
            <tr z-table-row *ngFor="let expense of expenses" class="hover:bg-gray-50/50 transition-colors">
              <td z-table-cell class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ expense.createdAt | date:'mediumDate' }}</td>
              <td z-table-cell class="px-6 py-4 text-sm font-medium text-gray-900">{{ expense.description }}</td>
              <td z-table-cell class="px-6 py-4 text-sm font-bold text-gray-900">{{ expense.amount | currency:expense.currency }}</td>
              <td z-table-cell class="px-6 py-4">
                <span [ngClass]="{
                  'bg-amber-100 text-amber-700': expense.status === 'PENDING',
                  'bg-emerald-100 text-emerald-700': expense.status === 'APPROVED',
                  'bg-rose-100 text-rose-700': expense.status === 'REJECTED'
                }" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ expense.status }}
                </span>
              </td>
              <td z-table-cell class="px-6 py-4 text-right space-x-2">
                <button z-button zType="ghost" zSize="sm" (click)="edit.emit(expense)" class="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Edit
                </button>
                <button z-button zType="ghost" zSize="sm" (click)="deleteExpense(expense.id)" class="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="expenses.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                No expenses found. Click 'New Expense' to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </z-card>
  `
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
