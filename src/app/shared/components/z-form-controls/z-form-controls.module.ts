import { NgModule } from '@angular/core';
import { ZInputTextComponent } from './z-input-text/z-input-text.component';
import { ZDatePickerComponent } from './z-date-picker/z-date-picker.component';
import { ZInputNumberComponent } from './z-input-number/z-input-number.component';
import { ZInputSwitchComponent } from './z-input-switch/z-input-switch.component';
import { ZCheckboxComponent } from './z-checkbox/z-checkbox.component';
import { ZRadioButtonComponent } from './z-radio-button/z-radio-button.component';
import { ZTextareaComponent } from './z-textarea/z-textarea.component';
import { ZSelectComponent } from './z-select/z-select.component';
import { ZPickListComponent } from './z-picklist/z-picklist.component';
// import { ZAutoCompleteComponent } from './z-auto-complete/z-auto-complete.component';
import { ZTableComponent } from '../z-table/z-table.component';
import { ZSpanComponent } from './z-span/z-span.component';
import { ZAutoCompleteComponent } from './z-autocomplete/z-autocomplete.component';
import { ZSelectButtonComponent } from './z-select-button/z-select-button.component';
import { ZButtonComponent } from './z-button/z-button.component';

@NgModule({
  imports: [
    ZAutoCompleteComponent,
    ZCheckboxComponent,
    ZDatePickerComponent,
    ZInputNumberComponent,
    ZInputSwitchComponent,
    ZInputTextComponent,
    ZPickListComponent,
    ZRadioButtonComponent,
    ZSelectComponent,
    ZSpanComponent,
    ZTextareaComponent,
    ZTableComponent,
    ZSelectButtonComponent,
    ZButtonComponent
  ],
  exports: [
    ZAutoCompleteComponent,
    ZCheckboxComponent,
    ZDatePickerComponent,
    ZInputNumberComponent,
    ZInputSwitchComponent,
    ZInputTextComponent,
    ZPickListComponent,
    ZRadioButtonComponent,
    ZSelectComponent,
    ZSpanComponent,
    ZTextareaComponent,
    ZTableComponent,
    ZSelectButtonComponent,
    ZButtonComponent
  ]
})
export class ZFormControlsModule { }
