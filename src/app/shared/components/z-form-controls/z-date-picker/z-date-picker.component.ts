import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ShowValidationTooltipDirective } from '../../../directives/show-validation-tooltip.directive';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'z-datepicker',
  standalone: true,
  imports: [ReactiveFormsModule,FloatLabelModule,CalendarModule,ShowValidationTooltipDirective],
  templateUrl: './z-date-picker.component.html',
  styleUrl: './z-date-picker.component.scss'
})
export class ZDatePickerComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup; // Form group to which this datepicker belongs
  @Input() control: string = ''; // Name of the control
  @Input() label: string = ''; // Label for the datepicker
  @Input() validationMessage: string | undefined = ''; // Validation message for tooltip
  @Output() valueChange = new EventEmitter<Date>(); // Event emitter for value changes

  onDateSelect(value: Date): void {
    this.valueChange.emit(value); // Emit the new date value to the parent component
  }
}
