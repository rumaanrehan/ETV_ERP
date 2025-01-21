import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function SpecialCharacterValidator(): ValidatorFn {
  const pattern = /^[-&$#/%()+, '\xA0@.A-Za-z0-9]*$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return !pattern.test(control.value) ? null : { specialcharacter: 'Input values cannot contain special characters.' };
  };
}