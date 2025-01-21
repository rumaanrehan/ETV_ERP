import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NotEqualToValidator(compareTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;
    if (!form) return null;

    const compareControl = form.get(compareTo);
    if (!compareControl) return null;

    return control.value !== compareControl.value ? null : { notEqualTo: true };
  };
}
