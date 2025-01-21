import { Component, input, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'z-dialog',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './z-dialog.component.html',
  styleUrl: './z-dialog.component.scss'
})
export class ZDialogComponent {
  @Input() isVisible: boolean = false;
  @Input() header: string = '';
  @Input() styleClass: string = "w-40rem";
}