import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function LessThanOrEqual(compareTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) return null;

        const compareControl = control.parent.get(compareTo);
        if (!compareControl) return null;

        const currentValue = control.value;
        const compareValue = compareControl.value;

        if (currentValue == null || compareValue == null) return null;

        return currentValue <= compareValue
            ? null
            : { lessThanOrEqual: { compareTo, currentValue, compareValue } };
    };
}
