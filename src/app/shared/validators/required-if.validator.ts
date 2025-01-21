import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Extend the AbstractControl to include a custom property
interface CustomAbstractControl extends AbstractControl {
  [key: string]: any; // Allow indexing with string keys
}

// Define the comparison types as an enum for clarity
export enum Operator {
  EqualTo = 'EqualTo',
  NotEqualTo = 'NotEqualTo',
  GreaterThan = 'GreaterThan',
  GreaterThanOrEqualTo = 'GreaterThanOrEqualTo',
  LessThan = 'LessThan',
  LessThanOrEqualTo = 'LessThanOrEqualTo',
  RegExMatch = 'RegExMatch',
  NotRegExMatch = 'NotRegExMatch',
}

export function RequiredIf(compareTo: string, operator: Operator, conditionValue: any): ValidatorFn {
  return (control: CustomAbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null; // Form is not yet initialized
    }

    const compareControl = control.parent.get(compareTo);
    if (!compareControl) {
      return null; // Compared control doesn't exist
    }

    // Unique listener key for this particular validator
    const listenerKey = `requiredIfListener_${compareTo}`;

    // Set up a listener for changes on the `compareControl` if not already present
    if (!control[listenerKey]) {
     compareControl.valueChanges.subscribe(() => {
       control.updateValueAndValidity(); // Trigger re-validation on changes
     });
     control[listenerKey] = true; // Flag to avoid re-subscribing
    }

    // Check the condition based on the selected operator
    let isConditionMet = false;

    switch (operator) {
      case Operator.EqualTo:
        isConditionMet = compareControl.value === conditionValue;
        break;
      case Operator.NotEqualTo:
        isConditionMet = compareControl.value != conditionValue;
        break;
      case Operator.GreaterThan:
        isConditionMet = compareControl.value > conditionValue;
        break;
      case Operator.GreaterThanOrEqualTo:
        isConditionMet = compareControl.value >= conditionValue;
        break;
      case Operator.LessThan:
        isConditionMet = compareControl.value < conditionValue;
        break;
      case Operator.LessThanOrEqualTo:
        isConditionMet = compareControl.value <= conditionValue;
        break;
      case Operator.RegExMatch:
        const regex = new RegExp(conditionValue);
        isConditionMet = regex.test(compareControl.value);
        break;
      case Operator.NotRegExMatch:
        const notRegex = new RegExp(conditionValue);
        isConditionMet = !notRegex.test(compareControl.value);
        break;
    }

    return isConditionMet && !control.value ? { requiredIf: true } : null;
  };
}
