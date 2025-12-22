import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-z-multi-button-menu',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './z-multi-button-menu.component.html',
  styleUrl: './z-multi-button-menu.component.scss'
})
export class ZMultiButtonMenuComponent {

  @Input() label: string = 'Actions';
  @Input() icon: string = 'pi pi-ellipsis-v';
  @Input() disabled: boolean = false;

  // 🔥 original menu definition (without command logic)
  @Input() items: MenuItem[] = [];

  // 🔥 CONTEXT DATA (row item)
  @Input() context: any;

  @ViewChild('menu') menu!: Menu;
  computedItems: MenuItem[] = [];
  
  ngOnChanges() {
    this.computedItems = this.injectContext(this.items);
  }

  private injectContext(items: MenuItem[]): MenuItem[] {
    return items.map(item => ({
      ...item,
      command: () => {
        item.command?.(this.context);
        this.menu.hide(); // ✅ close immediately
      },
      items: item.items ? this.injectContext(item.items) : undefined
    }));
  }

  toggle(event: Event) {
    this.menu.toggle(event);
  }
}
