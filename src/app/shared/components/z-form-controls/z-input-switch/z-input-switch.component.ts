import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'z-inputswitch',
  standalone: true,
  imports: [ReactiveFormsModule,InputSwitchModule],
  templateUrl: './z-input-switch.component.html',
  styleUrl: './z-input-switch.component.scss'
})
export class ZInputSwitchComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  
  @Output() onChange = new EventEmitter<any>(); // Event emitter for value changes

  onValueChange(value: boolean): void {
    this.onChange.emit(value); // Emit the new value to the parent component
  }
}