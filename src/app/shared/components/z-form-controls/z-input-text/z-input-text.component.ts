import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';

@Component({
  selector: 'z-inputtext',
  standalone: true,
  imports: [ReactiveFormsModule,FloatLabelModule,InputTextModule,ShowValidationTooltipDirective],
  templateUrl: './z-input-text.component.html',
  styleUrl: './z-input-text.component.scss'
})
export class ZInputTextComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() validationMessage: string | undefined = '';
  
  @Output() onChange = new EventEmitter<any>(); // Event emitter for value changes

  onValueChange(value: any): void {
    this.onChange.emit(value); // Emit the new value to the parent component
  }
}