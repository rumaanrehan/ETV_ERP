import { ErrorHandler, inject, Injectable } from '@angular/core';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { ErrorLogService } from '../services/error-log.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  alertService = inject(AlertNotificationService);
  logger = inject(ErrorLogService);
  
  handleError(error: any): void {
    this.logger.logError(error);

    const title = error?.status === 0
    ? 'Connection/Network Issue Detected'
    : 'Something Went Wrong';

    const message = error?.status === 0
    ? 'There was an issue with the connection and unable to reach the server. <b>Please try again.</b>'
    : 'An unexpected error occurred. Please try again later.'; //error?.message || error.toString()
    
    this.alertService.showAlert({
      type: 'error',
      title: title,
      text: message
    });
  }
}
