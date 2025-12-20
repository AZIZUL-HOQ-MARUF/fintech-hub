import { Component, EventEmitter, Inject, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseService } from '../services/expense.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';
import { ZardInputDirective } from '../../../shared/components/input/input.directive';
import { Z_MODAL_DATA } from '../../../shared/components/dialog/dialog.service';
import { ZardDialogRef } from '../../../shared/components/dialog/dialog-ref';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  private dialogRef = inject(ZardDialogRef, { optional: true });
  private modalData = inject(Z_MODAL_DATA, { optional: true });

  expenseForm: FormGroup;
  selectedFile?: File;
  selectedFileName: string = '';
  isEdit = false;
  expense?: Expense;

  constructor() {
    this.expenseForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['USD', [Validators.required]]
    });
  }

  ngOnInit() {
    this.expense = this.modalData?.expense;
    if (this.expense) {
      this.isEdit = true;
      this.expenseForm.patchValue({
        description: this.expense.description,
        amount: this.expense.amount,
        currency: this.expense.currency
      });
    }
  }

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
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      const action = this.isEdit 
        ? this.expenseService.updateExpense(this.expense!.id, expenseData, this.selectedFile)
        : this.expenseService.createExpense(expenseData, this.selectedFile);

      action.subscribe({
        next: () => {
          if (this.dialogRef) {
            this.dialogRef.close(true);
          }
        },
        error: (err) => console.error('Failed to save expense', err)
      });
    }
  }
}
