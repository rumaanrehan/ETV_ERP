import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';

@Component({
  selector: 'z-inputnumber',
  standalone: true,
  imports: [ReactiveFormsModule,FloatLabelModule,InputNumberModule,ShowValidationTooltipDirective],
  templateUrl: './z-input-number.component.html',
  styleUrl: './z-input-number.component.scss'
})
export class ZInputNumberComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() validationMessage: string | undefined = '';
  @Input() mode: 'decimal' | 'currency' = 'decimal';
  @Input() min: number | null = 0; //Mininum boundary value.
  @Input() max: number | null = null; //Maximum boundary value.
  
  @Output() onChange = new EventEmitter<any>(); // Event emitter for value changes

  onValueChange(value: any): void {
    this.onChange.emit(value); // Emit the new value to the parent component
  }
}