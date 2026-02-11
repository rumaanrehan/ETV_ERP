import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionBarAction } from './action-bar-action';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-actionbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './z-actionbar.component.html',
  styleUrl: './z-actionbar.component.scss'
})
export class ZActionbarComponent {

  @Input() selectedCount = 0;
  @Input() actions: ActionBarAction[] = [];

  @Output() actionClicked = new EventEmitter<string>();

  onActionClick(actionKey: string): void {
    this.actionClicked.emit(actionKey);
  }
}
