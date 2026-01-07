import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectButtonOptions } from './z-select-button';

@Component({
  selector: 'z-select-button',
  standalone: true,
  imports: [ReactiveFormsModule, SelectButtonModule],
  templateUrl: './z-select-button.component.html',
  styleUrl: './z-select-button.component.scss'
})
export class ZSelectButtonComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() allowEmpty: boolean = false;
  @Input() validationMessage: string | undefined = '';
  @Input() stateOptions: SelectButtonOptions[] = [
    { Text: "ASC", Value: 1 },
    { Text: "DESC", Value: -1 }
  ];

  @Output() onChange = new EventEmitter<any>();

  onValueChange(value: any): void {
    this.onChange.emit(value);
  }
}
