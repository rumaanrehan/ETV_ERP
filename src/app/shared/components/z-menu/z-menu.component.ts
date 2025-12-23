import { Component, Input } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from './z-menu';


@Component({
  selector: 'z-menu',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './z-menu.component.html',
  styleUrl: './z-menu.component.scss'
})
export class ZMenuComponent {
  @Input() menus!: MenuItem[];
  @Input() styleClass!: string;
}
