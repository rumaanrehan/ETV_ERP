import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NonZero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value == null || value === '') return null; // let required validator handle empty

        const numericValue = Number(value);

        return numericValue !== 0
            ? null
            : { nonZero: { actualValue: value } };
    };
}
