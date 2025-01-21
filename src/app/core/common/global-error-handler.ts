import { ErrorHandler, inject, Injectable } from '@angular/core';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  alertService = inject(AlertNotificationService);
  
  handleError(error: any): void {
    console.log(error);
    this.alertService.showAlert({
      type: 'error',
      title: 'Oops! An Error Occurred',
      text: error
    });
  }
}
