import { Component, Input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'z-span',
  standalone: true,
  imports: [FloatLabelModule],
  templateUrl: './z-span.component.html',
  styleUrl: './z-span.component.scss'
})
export class ZSpanComponent {
  @Input() styleClass: string = '';
  @Input() text: string = '';
  @Input() label: string = '';
}
