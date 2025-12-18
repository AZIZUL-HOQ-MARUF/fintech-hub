import { Component, EventEmitter, Inject, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { ZardButtonComponent } from '../../shared/components/button/button.component';
import { ZardInputDirective } from '../../shared/components/input/input.directive';
import { Z_MODAL_DATA } from '../../shared/components/dialog/dialog.service';
import { ZardDialogRef } from '../../shared/components/dialog/dialog-ref';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective],
  template: `
    <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 ml-1">Description</label>
        <input z-input 
               formControlName="description" 
               placeholder="e.g. Office Supplies" 
               class="w-full h-11 border-gray-200 focus:border-blue-500 rounded-md" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 ml-1">Amount</label>
          <input z-input 
                 type="number" 
                 formControlName="amount" 
                 placeholder="0.00" 
                 class="w-full h-11 border-gray-200 focus:border-blue-500 rounded-md" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 ml-1">Currency</label>
          <select formControlName="currency" 
                  class="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="BDT">BDT</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 ml-1">Attachment (Optional)</label>
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <p class="text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-400">{{ selectedFileName || 'Max 10MB' }}</p>
            </div>
            <input type="file" (change)="onFileSelected($event)" class="hidden" />
          </label>
        </div>
      </div>

      <div class="flex justify-end pt-4 gap-3">
        <button z-button zType="ghost" type="button" (click)="onCancel()" class="text-gray-600">
          Cancel
        </button>
        <button z-button type="submit" [disabled]="expenseForm.invalid" class="bg-blue-600 hover:bg-blue-700 text-white px-8">
          {{ isEdit ? 'Update' : 'Create' }} Expense
        </button>
      </div>
    </form>
  `
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
