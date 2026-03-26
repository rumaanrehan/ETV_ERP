import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';
import { ZFormControlsModule } from '../z-form-controls.module';
import { AutoCompleteDef } from './z-autocomplete';

@Component({
  selector: 'z-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, AutoCompleteModule, ShowValidationTooltipDirective],
  templateUrl: './z-autocomplete.component.html',
  styleUrl: './z-autocomplete.component.scss'
})
export class ZAutoCompleteComponent<T> {
  private static nextAutoCompleteId = 0;
  private readonly controlInstanceId = ++ZAutoCompleteComponent.nextAutoCompleteId;

  @Input() controlDef!: AutoCompleteDef<T>;
  @Input() isClearable: boolean = true;
  @Input() readonly: boolean = false;
  @Input() allowEmptySearch: boolean = false;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelect = new EventEmitter<T>();
  @Output() onClear = new EventEmitter<any>();

  lastSelected: any;

  get isValueSelected(): boolean {
    return !!(this.controlDef.type === 'formControl' && !!this.controlDef.group.get(this.controlDef.control)?.value);
  }

  get resolvedInputId(): string {
    if (this.controlDef?.inputId) {
      return this.controlDef.inputId;
    }

    if (this.controlDef?.type === 'formControl') {
      return `z-autocomplete-${this.controlDef.control}-${this.controlInstanceId}`;
    }

    return `z-autocomplete-suggestions-${this.controlInstanceId}`;
  }

  searchHandler(event: AutoCompleteCompleteEvent): void {
    this.onSearch.emit(event.query);
  }

  selectHandler(event: AutoCompleteSelectEvent): void {
    if (this.lastSelected === event.value) {
      return; // ignore duplicate
    }
    this.lastSelected = event.value;
    this.onSelect.emit(event.value);
  }

  clearHandler(): void {
    this.onClear.emit();
  }
}
