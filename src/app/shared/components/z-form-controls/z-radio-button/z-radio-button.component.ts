import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ShowValidationTooltipDirective } from '../../../directives/show-validation-tooltip.directive';

@Component({
  selector: 'z-radiobutton',
  standalone: true,
  imports: [ReactiveFormsModule,RadioButtonModule,ShowValidationTooltipDirective],
  templateUrl: './z-radio-button.component.html',
  styleUrl: './z-radio-button.component.scss'
})
export class ZRadioButtonComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() validationMessage: string | undefined = '';
  @Input() value: any = '';
  @Input() label: string = '';
  
  @Output() onClick = new EventEmitter<any>(); // Event emitter for value changes

  onButtonClick(value: boolean): void {
    this.onClick.emit(value); // Emit the new value to the parent component
  }
}
