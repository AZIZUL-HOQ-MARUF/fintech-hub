import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [class]="toast.type" (click)="toastService.remove(toast.id)">
          <div class="toast-icon">
            @if (toast.type === 'success') { <span>✓</span> }
            @else if (toast.type === 'error') { <span>✕</span> }
            @else if (toast.type === 'warning') { <span>⚠</span> }
            @else { <span>ℹ</span> }
          </div>
          <div class="toast-content">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .toast-item:hover {
      transform: scale(1.02);
    }

    .toast-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .toast-content {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
    }

    .success { border-left: 4px solid #10b981; }
    .success .toast-icon { background: #d1fae5; color: #059669; }

    .error { border-left: 4px solid #ef4444; }
    .error .toast-icon { background: #fee2e2; color: #dc2626; }

    .warning { border-left: 4px solid #f59e0b; }
    .warning .toast-icon { background: #fef3c7; color: #d97706; }

    .info { border-left: 4px solid #3b82f6; }
    .info .toast-icon { background: #dbeafe; color: #2563eb; }

    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
