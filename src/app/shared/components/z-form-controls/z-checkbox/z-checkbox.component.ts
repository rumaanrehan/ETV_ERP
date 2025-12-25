import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';

@Component({
  selector: 'z-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, CheckboxModule, ShowValidationTooltipDirective],
  templateUrl: './z-checkbox.component.html',
  styleUrl: './z-checkbox.component.scss'
})
export class ZCheckboxComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() validationMessage: string | undefined = '';
  @Input() readonly: boolean = false;

  @Output() onChange = new EventEmitter<any>(); // Event emitter for value changes

  onValueChange(value: any): void {
    this.onChange.emit(value); // Emit the new value to the parent component
  }
}