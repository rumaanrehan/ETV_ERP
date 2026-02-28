import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from "primeng/dialog";

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  templateUrl: './form-dialog.component.html',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule]
})
export class FormDialogComponent {

  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() width: string = '40rem';
  @Input() loading: boolean = false;

  // @Output() visibleChange = new EventEmitter<boolean>();
}