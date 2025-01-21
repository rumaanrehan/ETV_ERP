import { Component } from '@angular/core';
import { DataTablesModule } from "angular-datatables";
import { DropdownModule } from 'primeng/dropdown';
import { AlertComponent, IAlert } from '../../shared/components/alert/alert.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';

@Component({
  selector: 'app-emptypage',
  standalone: true,
  imports: [AlertComponent, ModalComponent, DataTablesModule,DropdownModule],
  templateUrl: './emptypage.component.html',
  styleUrl: './emptypage.component.scss'
})
export class EmptypageComponent {
  constructor(private alertService: AlertNotificationService) { }

  alert: IAlert = {
    type: 'success',
    message: 'Tariq bhai gharbojh karva de.',
    isVisible: true
  }

  ngOnInit(): void {

  }

  showToast() {
    this.alertService.showToast({
      text: 'This is a test toast',
      type: 'success',
      position: 'top',
      timer: 3000
    });
  }

  showAlert() {
    this.alertService.showAlert({
      title: 'Test Alert',
      text: 'This is a test alert',
      type: 'info'
    });
  }

  showConfirmation() {
    this.alertService.showConfirmation({
      title: 'Confirm',
      text: 'Are you sure?',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Confirmed');
      } else if (result.isDismissed) {
        console.log('Cancelled');
      }
    });
  }

  showConfirmationWithInput() {
    this.alertService.showConfirmationWithInput({
      text: 'Please enter your textarea address:',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Email entered:', result.value);
      } else if (result.isDismissed) {
        console.log('Cancelled');
      }
    });
  }

  showConfirmationWithSelect() {
    this.alertService.showConfirmationWithInput({
      title: 'Choose an option',
      text: 'Please choose one of the following options:',
      input: 'select',
      inputOptions: {
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3'
      },
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Option selected:', result.value);
      } else if (result.isDismissed) {
        console.log('Cancelled');
      }
    });
  }

  open(content: any) {

  }
}
