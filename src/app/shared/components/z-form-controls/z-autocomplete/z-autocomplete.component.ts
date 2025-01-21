import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ShowValidationTooltipDirective } from '../../../directives/show-validation-tooltip.directive';
import { ZFormControlsModule } from '../z-form-controls.module';
import { AutoCompleteDef } from './z-autocomplete';

@Component({
  selector: 'z-autocomplete',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,FloatLabelModule,AutoCompleteModule,ShowValidationTooltipDirective],
  templateUrl: './z-autocomplete.component.html',
  styleUrl: './z-autocomplete.component.scss'
})
export class ZAutoCompleteComponent<T> {
  @Input() controlDef!: AutoCompleteDef<T>;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelect = new EventEmitter<T>();
  @Output() onClear = new EventEmitter<any>();

  get isValueSelected(): boolean {
    return !!(this.controlDef.type === 'formControl' && !!this.controlDef.group.get(this.controlDef.control)?.value);
  }

  searchHandler(event: AutoCompleteCompleteEvent): void {
    this.onSearch.emit(event.query);
  }

  selectHandler(event: AutoCompleteSelectEvent): void {
    this.onSelect.emit(event.value);
  }

  clearHandler(): void {
    this.onClear.emit();
  }
}