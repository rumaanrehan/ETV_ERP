import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor() { }

  setValidationMessages(formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
    form.valueChanges.subscribe(data => this.onValueChanged(data, formValidationMessages, formErrors, form));
    this.onValueChanged(null, formValidationMessages, formErrors, form); // Reset validation messages initially
  }

  validateForm(formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
    this.onValueChanged(null, formValidationMessages, formErrors, form);
  }

  private onValueChanged(data: any, formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
    if (!form) {
      return;
    }

    for (const field in formErrors) {
      if (Object.prototype.hasOwnProperty.call(formErrors, field)) {
        formErrors[field] = '';
        const control = form.get(field);
        const element = document.querySelector(`[formControlName="${field}"]`);
        
        if (control && !control.valid && control.touched) {
          const messages = formValidationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}

export type FormValidationMessages = {
  [key: string]: {
    [key: string]: string;
  };
};

export type FormErrors = {
  [key: string]: string;
};
