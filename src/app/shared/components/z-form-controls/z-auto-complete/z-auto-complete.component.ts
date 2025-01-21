import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ZFormControlsModule } from '../z-form-controls.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShowValidationTooltipDirective } from '../../../directives/show-validation-tooltip.directive';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'z-auto-complete',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, ZFormControlsModule, ReactiveFormsModule, ShowValidationTooltipDirective, FloatLabelModule],
  templateUrl: './z-auto-complete.component.html',
  styleUrls: ['./z-auto-complete.component.scss']
})
export class ZAutoComplete1Component {
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() validationMessage: string | undefined = '';
  @Input() suggestions: any[] = [];
  @Input() placeholder: any = '';
  @Input() optionLabel: string = '';
  @Input() columns: { valueField: string; name: string; width?: string }[] = [];
  @Input() showHeader: boolean = true;

  @Output() completeMethod = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() dblclick = new EventEmitter<any>();

  filterItem(event: any) {
    this.completeMethod.emit(event);
  }

  onItemSelect(event: any) {
    this.onSelect.emit(event);
  }

  doubleclick() {
    this.dblclick.emit();
  }

}
