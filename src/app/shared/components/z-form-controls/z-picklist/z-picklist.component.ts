import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PickListModule } from 'primeng/picklist';

@Component({
  selector: 'z-picklist',
  standalone: true,
  imports: [CommonModule,PickListModule],
  templateUrl: './z-picklist.component.html',
  styleUrls: ['./z-picklist.component.scss']
})
export class ZPickListComponent {
  @Input() sourceList: any[] = [];
  @Input() targetList: any[] = [];
  @Input() sourceHeader: string = '';
  @Input() targetHeader: string = '';
  @Input() sourceStyle: object = { height: '30rem' };
  @Input() targetStyle: object = { height: '30rem' };
  @Input() filterBy: string = '';
  @Input() itemName: string = '';
  @Input() sourceFilterPlaceholder: string = '';
  @Input() targetFilterPlaceholder: string = '';
  @Input() breakpoint: string = '1400px';
  @Input() showSourceControls: boolean = false;
  @Input() showTargetControls: boolean = false;
  @Input() metaKeySelection: boolean = true;
  @Input() showActionButton: boolean = false;
  @Input() disableActionButton: boolean = false;
  @Input() actionButtonLabel: string = '';

  @Output() onTargetSelect = new EventEmitter<any>();
  @Output() onMoveToSource = new EventEmitter<any>();
  @Output() onMoveAllToSource = new EventEmitter<any>();
  @Output() onMoveToTarget = new EventEmitter<any>();
  @Output() onMoveAllToTarget = new EventEmitter<any>();
  @Output() onActionButtonClick = new EventEmitter<any>();

  get formattedsourceFilterPlaceholder(): string {
    return this.itemName.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  get formattedtargetFilterPlaceholder(): string {
    const formattedName = this.itemName.replace(/([a-z])([A-Z])/g, '$1 $2');
    return `Mapped ${formattedName}`;
  }

}
