import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to check for non-whitespace input
export function NotOnlyWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const pattern = /^[-&$#/%()+, '\xA0@.A-Za-z0-9]*$/;
    // Check if the value is empty or only contains whitespace
    if (typeof value === 'string' && value.trim() === '' && value != '') {
      return { whitespace: 'Input value can not be whitespace only.' }; // Return error if value is only whitespace
    }
    return null; // No error
  };
}

export function notBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { notBeforeToday: true };
    }

    return null;
  };
}