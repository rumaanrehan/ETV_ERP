import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'z-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './z-button.component.html',
  styleUrl: './z-button.component.scss'
})
export class ZButtonComponent {
  @Input() label: string = '';
  @Input() icon?: string;
  @Input() iconPos: 'left' | 'right' = 'left';

  @Input() type: 'button' | 'submit' = 'button';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast' = 'primary';

  @Input() outlined: boolean = false;
  @Input() text: boolean = false;
  @Input() raised: boolean = false;
  @Input() rounded: boolean = false;

  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  @Input() styleClass?: string = '';
  @Input() tooltip?: string;
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      // this.loading = true;
      this.clicked.emit();
    }
  }
}
