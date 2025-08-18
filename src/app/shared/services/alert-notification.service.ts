import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ServerResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AlertNotificationService {
  constructor() { }

  showToast(options: AlertOptions) {
    options.type = options.type || 'info';
    options.text = options.text || 'Something went wrong!';
    options.position = options.position || 'top';
    options.timer = options.timer || 3000;

    const swalOptions = {
      toast: true,
      icon: options.type,
      title: options.text,
      showConfirmButton: false,
      position: options.position,
      timer: options.timer
    };

    return Swal.fire(swalOptions);
  }

  showServerResponseToast(response: ServerResponse): void { //{ Status, Message, ValidationErrors }: ApiResponse add this in future
    if (response.Status == "Info") {
      this.showToast({
        type: "info",
        text: response.Message
      });
    }
    else if (response.Status == "Invalid") {
      const htmlString = `
        <ul>
          ${response.ValidationErrors?.map(error =>
        `<li>${error.ErrorMessage}</li>`
      ).join('')}
        </ul>
      `;
      this.showToast({
        type: "warning",
        text: htmlString
      });
    }
    else if (response.Status == "Warning") {
      this.showToast({
        type: "warning",
        text: response.Message
      });
    }
    else {
      this.showServerErrorAlert({ text: response.Message });
    }
  }

  showAlert(options: AlertOptions) {
    options.type = options.type || 'info';
    if (options.type !== 'success') {
      options.title = options.title || 'Warning Message';
    }
    options.text = options.text || 'Something went wrong!';
    options.position = options.position || 'top';
    options.confirmButtonText = options.confirmButtonText || 'Okay';

    const swalOptions = {
      icon: options.type,
      title: options.title,
      html: options.text,
      footer: options.footer,
      position: options.position,
      allowOutsideClick: false,
      allowEnterKey: true,
      focusConfirm: true,
      showConfirmButton: true,
      confirmButtonText: options.confirmButtonText,
      timer: options.timer
    };

    return Swal.fire(swalOptions);
  }

  showServerErrorAlert(options: AlertOptions) {
    options.type = 'error';
    options.title = options.title || 'Server Error';
    options.footer = 'If the problem persists then please contact to the system administrator.';

    if (!(options.text)) {
      options.title = 'Oops';
      options.text = 'Something went wrong! Please try again.';
    }
    else if (options.text == 'ExecutionTimeoutExpired') {
      options.type = 'warning';
      options.title = 'Timeout Expired';
      options.text = 'The timeout period elapsed prior to completion of the operation, or the server is taking too long to respond. <b>Please try again in few moments.</b>';
    }
    else if (options.text == 'ServerErrorOccurred') {
      options.text = 'The server encountered an internal error and was unable to complete your request. <b>Please try again.</b>';
    }
    this.showAlert(options);
  }

  showServerResponseAlert(response: ServerResponse): void { //{ Status, Message, ValidationErrors }: ApiResponse add this in future
    if (response.Status == "Info") {
      this.showAlert({
        type: "info",
        title: "Info Message",
        text: response.Message
      });
    }
    else if (response.Status == "Invalid") {
      const htmlString = `
        <ul>
          ${response.ValidationErrors?.map(error =>
        `<li>${error.ErrorMessage}</li>`
      ).join('')}
        </ul>
      `;
      this.showAlert({
        type: "warning",
        title: "Form Validation Failed",
        text: htmlString
      });
    }
    else if (response.Status == "Warning") {
      this.showAlert({
        type: "warning",
        title: "Warning Message",
        text: response.Message
      });
    }
    else {
      this.showServerErrorAlert({ text: response.Message });
    }
  }

  showConfirmation(options: AlertOptions): Promise<any> {
    options.type = options.type || 'question';
    options.text = options.text || 'Are you sure?';
    options.position = options.position || 'top';
    options.confirmButtonText = options.confirmButtonText || 'Confirm';
    options.cancelButtonText = options.cancelButtonText || 'Cancel';

    const swalOptions = {
      icon: options.type,
      html: options.text,
      position: options.position,
      width: '500px',
      allowOutsideClick: false,
      allowEnterKey: true,
      focusCancel: true,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      reverseButtons: true
    };

    return Swal.fire(swalOptions);
  }

  showConfirmationWithInput(options: AlertOptions): Promise<any> {
    options.type = options.type || 'question';
    options.position = options.position || 'top';
    options.confirmButtonText = options.confirmButtonText || 'Confirm';
    options.cancelButtonText = options.cancelButtonText || 'Cancel';
    options.input = options.input || 'textarea';
    options.inputRequired = options.inputRequired || true;
    options.inputPlaceholder = options.inputPlaceholder || 'Reason to Update';
    options.inputValue = options.inputValue || '';

    const swalOptions = {
      icon: options.type,
      html: options.text,
      position: options.position,
      width: '500px',
      allowOutsideClick: false,
      allowEnterKey: true,
      focusCancel: true,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      reverseButtons: true,
      input: options.input,
      inputPlaceholder: options.inputPlaceholder,
      inputValue: options.inputValue,
      inputOptions: options.inputOptions,
      inputValidator: (value: any) => {
        if (options.inputRequired && !value) {
          return `${options.inputPlaceholder} is Required.`;
        }
        return null;
      }
    };

    return Swal.fire(swalOptions);
  }

  showValidationToast(validationErrors?: any): void {
    let html = '';
    if (validationErrors) {
      html = `<div>
        <ul>
          ${Object.keys(validationErrors).map(key => validationErrors[key] ? `<li>${validationErrors[key]}</li>` : '').join('')}
        </ul>
      </div>`
    }
    else {
      html = 'The form contains validation errors. Please review and correct the highlighted fields before submitting again.'
    }

    this.showToast({
      type: "warning",
      text: html
    });
  }

  showValidationAlert(validationErrors?: any): void {
    let html = '';
    if (validationErrors) {
      html = `<div>
        <ul>
          ${Object.keys(validationErrors).map(key => validationErrors[key] ? `<li>${validationErrors[key]}</li>` : '').join('')}
        </ul>
      </div>`
    }
    else {
      html = 'The form contains validation errors. Please review and correct the highlighted fields before submitting again.'
    }

    this.showAlert({
      type: "warning",
      title: "Form Validation Errors",
      text: html
    }).then(result => {
      setTimeout(() => {
        (document.querySelector('input.ng-invalid, textarea.ng-invalid, .p-element.ng-invalid .p-element') as HTMLElement)?.focus();
      }, 300);
    });;
  }
}

interface AlertOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'question';
  title?: string;
  text?: string;
  footer?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  toast?: boolean;
  position?: 'top' | 'bottom' | 'center';
  timer?: number;
  input?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'range';
  inputPlaceholder?: string;
  inputValue?: any;
  inputOptions?: { [key: string]: string };
  inputRequired?: boolean;
}

// interface ServerResponse {
//   Status: string;
//   Message?: string;
//   ValidationErrors?: ValidationError[];
// }
