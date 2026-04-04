import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, DropdownModule, MultiSelectModule, ShowValidationTooltipDirective],
  templateUrl: './z-select.component.html',
  styleUrl: './z-select.component.scss'
})
export class ZSelectComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup; // Form group to which this dropdown belongs
  @Input() control: string = ''; // Name of the control
  @Input() label: string = ''; // Label for the dropdown
  @Input() validationMessage: string | undefined = ''; // Validation message for tooltip  
  @Input() options: any[] = [];        // The options for the dropdown
  @Input() optionLabel: string = '';   // The property name for the label in the options
  @Input() optionValue: string = '';   // The property name for the value in the options
  @Input() readonly: boolean = false;
  @Input() showClear: boolean = true;

  @Input() multi: boolean = false;
  @Input() maxSelectionLimit: number | null = null;
  @Input() appendTo: any = null;

  @Output() onChange = new EventEmitter<any>(); // Event emitter for value changes

  // Determine if filtering should be enabled based on the length of options
  get filterEnabled(): boolean {
    return this.options.length > 5;
  }

  onValueChange(value: any): void {
    this.onChange.emit(value); // Emit the new value to the parent component
  }
}
