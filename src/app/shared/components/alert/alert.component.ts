import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, NgbModule,MessagesModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  //isVisible = true;

  messages!: Message[];

  @Input() alert: IAlert = {
    type: 'success',
    message: '',
    isVisible: false
  }

  ngOnInit() {
      this.messages = [{ severity: this.alert.type, detail: this.alert.message }];
  }
}

export interface IAlert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
}
