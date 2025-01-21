import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function NumericRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value != null && (isNaN(value) || value < min || value > max)) {
      return { numericrange: `The number must be between ${min} and ${max}.` };
    }
    return null;
  };
}