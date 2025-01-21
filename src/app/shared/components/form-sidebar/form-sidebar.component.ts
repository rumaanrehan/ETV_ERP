import { Component, Input } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-form-sidebar',
  standalone: true,
  imports: [SidebarModule],
  templateUrl: './form-sidebar.component.html',
  styleUrl: './form-sidebar.component.scss'
})
export class FormSidebarComponent {
  @Input() isVisible: boolean = false;
  @Input() position: string = "right";
  @Input() styleClass: string = "w-30rem";
}
