import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'z-datepicker',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, CalendarModule, ShowValidationTooltipDirective],
  templateUrl: './z-date-picker.component.html',
  styleUrl: './z-date-picker.component.scss'
})
export class ZDatePickerComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup; // Form group to which this datepicker belongs
  @Input() control: string = ''; // Name of the control
  @Input() label: string = ''; // Label for the datepicker
  @Input() validationMessage: string | undefined = ''; // Validation message for tooltip
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() readonly: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() valueChange = new EventEmitter<Date>(); // Event emitter for value changes

  onDateSelect(value: Date): void {
    this.valueChange.emit(value); // Emit the new date value to the parent component
  }

  // enableReadOnly(event: any) {
  //   event.preventDefault();
  //   if (this.readonly) {
  //     event.preventDefault();
  //   }
  // }
}
