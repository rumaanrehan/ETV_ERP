import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ShowValidationTooltipDirective } from '../../../layouts/directives/show-validation-tooltip.directive';

@Component({
  selector: 'z-textarea',
  standalone: true,
  imports: [ReactiveFormsModule,FloatLabelModule,InputTextareaModule,ShowValidationTooltipDirective],
  templateUrl: './z-textarea.component.html',
  styleUrl: './z-textarea.component.scss'
})
export class ZTextareaComponent {
  @Input() styleClass: string = '';
  @Input() group!: FormGroup;
  @Input() control: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() validationMessage: string | undefined = '';
  @Input() rows: number = 2;
}
