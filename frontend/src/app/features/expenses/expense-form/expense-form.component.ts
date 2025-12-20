import { Component, OnInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, required, Field } from '@angular/forms/signals';
import { take } from 'rxjs';
import { Expense, ExpenseService } from '../services/expense.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';
import { ZardInputDirective } from '../../../shared/components/input/input.directive';
import { Z_MODAL_DATA } from '../../../shared/components/dialog/dialog.service';
import { ZardDialogRef } from '../../../shared/components/dialog/dialog-ref';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Field, ZardButtonComponent, ZardInputDirective],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private dialogRef = inject(ZardDialogRef, { optional: true });
  private modalData = inject(Z_MODAL_DATA, { optional: true });

  readonly #initialState = signal({
    description: '',
    amount: 0,
    currency: 'USD'
  });

  readonly expenseForm = form(this.#initialState, (expense) => {
    required(expense.description, { message: 'Description is required.' });
    required(expense.amount, { message: 'Amount is required.' });
    required(expense.currency, { message: 'Currency is required.' });
  });

  selectedFile?: File;
  selectedFileName: string = '';
  isEdit = false;
  expense?: Expense;

  constructor() {
    effect(() => {
      const expense = this.modalData?.expense;
      if (expense) {
        this.isEdit = true;
        this.expense = expense;
        this.#initialState.set({
          description: expense.description,
          amount: expense.amount,
          currency: expense.currency
        });
      }
    });
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onSubmit() {
    if (this.expenseForm().invalid()) {
      return;
    }

    const expenseData = this.expenseForm().value();
    const action = this.isEdit 
      ? this.expenseService.updateExpense(this.expense!.id, expenseData, this.selectedFile)
      : this.expenseService.createExpense(expenseData, this.selectedFile);

    action.pipe(take(1)).subscribe({
      next: () => {
        if (this.dialogRef) {
          this.dialogRef.close(true);
        }
      },
      error: (err) => console.error('Failed to save expense', err)
    });
  }
}
