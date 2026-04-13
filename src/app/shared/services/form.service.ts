import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormConfig, FormConfigType, FormErrors, FormValidationMessages } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private highlightedInvalidElement?: HTMLElement;
  private highlightResetTimer?: ReturnType<typeof setTimeout>;

  constructor(private formBuilder: FormBuilder) { }

  createNullObject<T extends object>(): {
    [P in keyof T]: T[P] extends boolean ? false :
    T[P] extends number ? 0 :
    T[P] extends string ? '' :
    T[P] extends any[] ? [] :
    null
  } {
    const result = {} as {
      [P in keyof T]: T[P] extends boolean ? false :
      T[P] extends number ? 0 :
      T[P] extends string ? '' :
      T[P] extends any[] ? [] :
      null
    };

    // Loop through each key in the resulting object
    Object.keys(result).forEach((key) => {
      const typedKey = key as keyof T;

      // Check the type of each property and assign the appropriate default value
      if (typeof (result[typedKey] as unknown) === 'boolean') {
        result[typedKey] = false as any;
      } else if (typeof (result[typedKey] as unknown) === 'number') {
        result[typedKey] = 0 as any;
      } else if (typeof (result[typedKey] as unknown) === 'string') {
        result[typedKey] = '' as any;
      } else if (Array.isArray(result[typedKey])) {
        result[typedKey] = [] as any;
      } else {
        result[typedKey] = null as any;
      }
    });
    return result;
  }

  createFormGroup<T>(formConfig: FormConfigType<T>): FormGroup {
    const formGroup = new FormGroup({});

    for (const key in formConfig) {
      const config = formConfig[key];

      if (config.type === 'array') {
        // Create FormArray
        const formArray = new FormArray([]);
        formGroup.addControl(key, formArray);
      } else if (config.type === 'group') {
        // Recursive call for nested FormGroup
        const nestedGroup = this.createFormGroup(config.items!);
        formGroup.addControl(key, nestedGroup);
      } else {
        // Create FormControl {value: config.defaultValue, disabled: config.disabled || false}
        const control = new FormControl({ value: config.defaultValue, disabled: config.disabled || false }, config.validators);
        formGroup.addControl(key, control);
      }
    }
    return formGroup;
  }

  // Helper to create FormArray items
  createFormArrayItem<T>(itemConfig: FormConfigType<T>): FormGroup {
    return this.createFormGroup(itemConfig);
  }

  createFormGroup_DataTableFilter<T>(model: T): FormGroup {
    const formGroup = new FormGroup({});

    for (const key in model) {
      formGroup.addControl(key, new FormControl(model[key]));
    }
    return formGroup;
  }

  patchFormGroupValue(form: FormGroup, patchObject: any): void { //not in use current
    Object.keys(patchObject).forEach(key => {
      if (patchObject[key] && typeof patchObject[key] === 'object') {
        this.patchFormGroupValue(form.get(key) as FormGroup, patchObject[key]);
      } else {
        form.get(key)?.setValue(patchObject[key]);
      }
    });
  }

  resetFormValue<T>(formConfig: FormConfigType<T>, form: FormGroup): void {
    form.reset(
      Object.fromEntries(
        Object.keys(formConfig).map(key => {
          const config = formConfig[key as keyof FormConfigType<T>];
          if (config.type === 'array') {
            return [key, []];
          }
          else if (config.type === 'group') {
            return [key, {}];
          }
          else {
            return [key, config.defaultValue];
          }
        })
        // Object.keys(formConfig).map(key => [
        //   key, 
        //   formConfig[key as keyof FormConfigType<T>].defaultValue
        // ])
      )
    );
  }

  //#region Transform Form Data
  transformFormArrayData(formArrayData: any): any { //this will be removed if worked from below logic
    if (Array.isArray(formArrayData)) {
      return formArrayData.map(item => this.transformFormData(item));
    }
    return formArrayData;
  }

  transformFormData(formData: any): any {
    for (const key in formData) {
      const value = formData[key];

      if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {
        continue;
      }
      else if (Array.isArray(value)) {
        // Recursively transform each item in the array
        formData[key] = value.map(item => this.transformFormData(item));
      }
      else {
        /* Set Empty String as NULL */
        if (value === '') {
          formData[key] = null;
        }

        /* Set true/false in String as Boolean */
        else if (typeof value === 'string' && /^(true|false)$/i.test(value)) {
          formData[key] = value.toLowerCase() === 'true';
        }

        /* Set Local Datetime as UTC Datetime */
        else if (value instanceof Date) {
          formData[key] = new Date(Date.UTC(
            value.getFullYear(),
            value.getMonth(),
            value.getDate(),
            value.getHours(),
            value.getMinutes(),
            value.getSeconds()
          ));
        }
      }
    }
    return formData;
  }

  //#endregion

  //#region Form Validation Message
  initializeFormValidationMessage<T>(formConfig: FormConfigType<T>, form: FormGroup) {
    form.valueChanges.subscribe(data => this.setFieldValidationErrors(data, formConfig as FormConfig, form));
    this.setFieldValidationErrors(null, formConfig as FormConfig, form); // Reset validation messages initially
  }

  validateFormFields<T>(formConfig: FormConfigType<T>, form: FormGroup) {
    this.setFieldValidationErrors(null, formConfig as FormConfig, form);
    this.focusAndHighlightFirstInvalidField();
  }

  private setFieldValidationErrors(data: any, formConfig: FormConfig, form: FormGroup | FormArray): void {
    if (!form) {
      return;
    }

    Object.keys(formConfig).forEach(field => {
      if (formConfig[field].type === 'control') {
        formConfig[field].error = '';
      }

      // if (formConfig[field].type === 'array') {
      //   Object.keys(formConfig[field].items).forEach(item => {
      //     item
      //     formConfig[field].[item].error = {};
      //   });
      // }
    });

    Object.keys(formConfig).forEach(field => {
      const control = form.get(field);

      if (control) {
        if (formConfig[field].type == 'array' && control instanceof FormArray) {
          const nestedFormConfig = formConfig[field];
          Object.keys(nestedFormConfig.items).forEach(element => {
            nestedFormConfig.items[element].error = {};
          });

          control.controls.forEach((arrayItem, index) => {
            if (arrayItem instanceof FormGroup) {
              for (const arrayFormField in arrayItem.controls) {
                const fieldcontrol = arrayItem.get(arrayFormField);
                if (fieldcontrol) {
                  if (!fieldcontrol.valid && fieldcontrol.touched) {
                    const errorMessages: { [key: number]: string } = nestedFormConfig.items[arrayFormField].error ?? {};
                    const messages = nestedFormConfig.items[arrayFormField]?.validationMessages ?? {};
                    for (const key in fieldcontrol.errors) {
                      if (errorMessages && Object.prototype.hasOwnProperty.call(fieldcontrol.errors, key)) {
                        // const errorKey: string = index as unknown as string;
                        errorMessages[index] = (messages[key] ?? fieldcontrol.errors[key]) + '';
                        break;
                      }
                    }
                  }
                }
              }
            }
          });
        }
        // else if ((control instanceof FormGroup || control instanceof FormArray)) {
        //   // Recursively handle nested FormGroup or FormArray  && formConfig[field].children && formConfig[field].type == "array"
        //   const nestedFormConfig = formConfig[field] as unknown as FormArrayConfig;
        //   this.setFieldValidationErrors(data, nestedFormConfig.children, control);
        // }
        else if (formConfig[field].type == 'control' && !control.valid && control.touched) {
          formConfig[field].error = '';
          const messages = formConfig[field]?.validationMessages ?? {};
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              formConfig[field].error = (messages[key] ?? control.errors[key]) + '';
              break;
            }
          }
        }
      }
    });
  }

  getValidationMessages(formConfig: FormConfig): string[] {
    const messages: string[] = [];

    Object.keys(formConfig).forEach(field => {
      const config = formConfig[field];

      // ✅ Normal control error (string)
      if (config.type === 'control' && typeof config.error === 'string' && config.error) {
        messages.push(config.error);
      }

      // ✅ FormArray errors (object → strings)
      if (config.type === 'array' && config.items) {
        Object.keys(config.items).forEach(itemKey => {
          const itemError = config.items[itemKey].error;

          if (itemError && typeof itemError === 'object') {
            Object.values(itemError).forEach(err => {
              if (typeof err === 'string') {
                messages.push(err);
              }
            });
          }
        });
      }
    });

    return messages;
  }

  private focusAndHighlightFirstInvalidField(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const invalidSelector = [
      'input.ng-invalid',
      'textarea.ng-invalid',
      '.p-inputtext.ng-invalid',
      '.p-element.ng-invalid .p-inputtext',
      '.p-element.ng-invalid .p-dropdown',
      '.p-element.ng-invalid .p-multiselect',
      '.p-element.ng-invalid .p-calendar input',
      '.p-element.ng-invalid .p-autocomplete input',
      '.p-element.ng-invalid .p-inputnumber input',
      '.p-element.ng-invalid .p-checkbox-box',
      '.p-element.ng-invalid .p-radiobutton-box',
      '.p-element.ng-invalid .p-inputswitch-slider'
    ].join(', ');

    const invalidElement = Array
      .from(document.querySelectorAll(invalidSelector))
      .find((element) => this.isVisibleElement(element as HTMLElement)) as HTMLElement | undefined;

    if (!invalidElement) {
      this.clearInvalidFieldHighlight();
      return;
    }

    const highlightTarget = this.resolveInvalidHighlightTarget(invalidElement);
    const focusTarget = this.resolveInvalidFocusTarget(invalidElement, highlightTarget);

    this.clearInvalidFieldHighlight();
    highlightTarget.classList.add('invalid-field-highlight');
    this.highlightedInvalidElement = highlightTarget;

    highlightTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });

    focusTarget?.focus({ preventScroll: true });

    this.highlightResetTimer = setTimeout(() => {
      this.clearInvalidFieldHighlight();
    }, 8000);
  }

  private resolveInvalidHighlightTarget(sourceElement: HTMLElement): HTMLElement {
    return sourceElement.closest(
      '.p-float-label, .input-group, .p-inputwrapper, .p-dropdown, .p-multiselect, .p-calendar, .p-autocomplete, .p-inputnumber, .p-checkbox, .p-radiobutton, .p-inputswitch'
    ) as HTMLElement ?? sourceElement;
  }

  private resolveInvalidFocusTarget(sourceElement: HTMLElement, highlightTarget: HTMLElement): HTMLElement | null {
    if (this.isFocusableElement(sourceElement)) {
      return sourceElement;
    }

    return (highlightTarget.querySelector(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null);
  }

  private isFocusableElement(element: HTMLElement): boolean {
    return element.matches('input, textarea, select, button, [tabindex]:not([tabindex="-1"])');
  }

  private isVisibleElement(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      return false;
    }

    return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
  }

  private clearInvalidFieldHighlight(): void {
    if (this.highlightedInvalidElement) {
      this.highlightedInvalidElement.classList.remove('invalid-field-highlight');
      this.highlightedInvalidElement = undefined;
    }

    if (this.highlightResetTimer) {
      clearTimeout(this.highlightResetTimer);
      this.highlightResetTimer = undefined;
    }
  }

  // private setFieldValidationErrors(data: any, formConfig: FormConfig, form: FormGroup): void {
  //   if (!form) {
  //     return;
  //   }

  //   for (const field in formConfig) {
  //     if (Object.prototype.hasOwnProperty.call(formConfig, field)) {
  //       formConfig[field].error = '';
  //       const control = form.get(field);

  //       if (control && !control.valid && control.touched) {
  //         const messages = formConfig[field]?.validationMessages ?? {};
  //         for (const key in control.errors) {
  //           if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
  //             formConfig[field].error += (messages[key] ?? control.errors[key]) + '';
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  //#endregion

  //#region Deprecated Methods
  processFormData(formData: any): any {
    for (const key in formData) {
      if (formData[key] === '') {
        formData[key] = null;
      }

      else if (typeof formData[key] === 'string' && /^(true|false)$/i.test(formData[key])) {
        formData[key] = formData[key].toLowerCase() === 'true';
      }

      else if (formData[key] instanceof Date) {
        formData[key] = new Date(Date.UTC(
          formData[key].getFullYear(),
          formData[key].getMonth(),
          formData[key].getDate(),
          formData[key].getHours(),
          formData[key].getMinutes(),
          formData[key].getSeconds()
        ));
      }
    }
    return formData;
  }

  processFormDataList(formData: any): any {
    if (Array.isArray(formData)) {
      return formData.map(item => this.processFormDataList(item));
    }
    else if (formData !== null) {
      for (const key in formData) {
        if (typeof formData[key] === 'string') {
          if (formData[key].toLowerCase() === 'true') {
            formData[key] = true;
          } else if (formData[key].toLowerCase() === 'false') {
            formData[key] = false;
          }
        }
      }
    }
    return formData;
  }

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
              formErrors[field] += (messages[key] ?? control.errors[key]) + '';
              break;
            }
          }
        }
      }
    }
  }
  //#endregion
}







// Zunified Code


// @Injectable({
//   providedIn: 'root'
// })
// export class FormService {

//   constructor(private formBuilder: FormBuilder) { }

//   createNullObject<T extends object>(): {
//     [P in keyof T]: T[P] extends boolean ? false :
//     T[P] extends number ? 0 :
//     T[P] extends string ? '' :
//     T[P] extends any[] ? [] :
//     null
//   } {
//     const result = {} as {
//       [P in keyof T]: T[P] extends boolean ? false :
//       T[P] extends number ? 0 :
//       T[P] extends string ? '' :
//       T[P] extends any[] ? [] :
//       null
//     };

//     // Loop through each key in the resulting object
//     Object.keys(result).forEach((key) => {
//       const typedKey = key as keyof T;

//       // Check the type of each property and assign the appropriate default value
//       if (typeof (result[typedKey] as unknown) === 'boolean') {
//         result[typedKey] = false as any;
//       } else if (typeof (result[typedKey] as unknown) === 'number') {
//         result[typedKey] = 0 as any;
//       } else if (typeof (result[typedKey] as unknown) === 'string') {
//         result[typedKey] = '' as any;
//       } else if (Array.isArray(result[typedKey])) {
//         result[typedKey] = [] as any;
//       } else {
//         result[typedKey] = null as any;
//       }
//     });
//     return result;
//   }

//   createFormGroup<T>(formConfig: FormConfigType<T>): FormGroup {
//     const formGroup = new FormGroup({});

//     for (const key in formConfig) {
//       const config = formConfig[key];

//       if (config.type === 'array') {
//         // Create FormArray
//         const formArray = new FormArray([]);
//         formGroup.addControl(key, formArray);
//       } else if (config.type === 'group') {
//         // Recursive call for nested FormGroup
//         const nestedGroup = this.createFormGroup(config.items!);
//         formGroup.addControl(key, nestedGroup);
//       } else {
//         // Create FormControl {value: config.defaultValue, disabled: config.disabled || false}
//         const control = new FormControl({ value: config.defaultValue, disabled: config.disabled || false }, config.validators);
//         formGroup.addControl(key, control);
//       }
//     }
//     return formGroup;
//   }

//   // Helper to create FormArray items
//   createFormArrayItem<T>(itemConfig: FormConfigType<T>): FormGroup {
//     return this.createFormGroup(itemConfig);
//   }

//   createFormGroup_DataTableFilter<T>(model: T): FormGroup {
//     const formGroup = new FormGroup({});

//     for (const key in model) {
//       formGroup.addControl(key, new FormControl(model[key]));
//     }

//     return formGroup;
//   }

//   patchFormGroupValue(form: FormGroup, patchObject: any): void { //not in use current
//     Object.keys(patchObject).forEach(key => {
//       if (patchObject[key] && typeof patchObject[key] === 'object') {
//         this.patchFormGroupValue(form.get(key) as FormGroup, patchObject[key]);
//       } else {
//         form.get(key)?.setValue(patchObject[key]);
//       }
//     });
//   }

//   resetFormValue<T>(formConfig: FormConfigType<T>, form: FormGroup): void {
//     console.log("yaha aaya hjun");
//     form.reset(
//       Object.fromEntries(
//         Object.keys(formConfig).map(key => {
//           const config = formConfig[key as keyof FormConfigType<T>];
//           if (config.type === 'array') {
//             return [key, []];
//           }
//           else if (config.type === 'group') {
//             return [key, {}];
//           }
//           else {
//             return [key, config.defaultValue];
//           }
//         })
//         // Object.keys(formConfig).map(key => [
//         //   key,
//         //   formConfig[key as keyof FormConfigType<T>].defaultValue
//         // ])
//       )
//     );
//   }

//   //#region Transform Form Data
//   transformFormArrayData(formArrayData: any): any { //this will be removed if worked from below logic
//     if (Array.isArray(formArrayData)) {
//       return formArrayData.map(item => this.transformFormData(item));
//     }
//     return formArrayData;
//   }

//   transformFormData(formData: any): any {
//     for (const key in formData) {
//       const value = formData[key];
//       // console.log(value);

//       if (Array.isArray(value)) {
//         // Recursively transform each item in the array
//         formData[key] = value.map(item => this.transformFormData(item));
//       }
//       else {
//         /* Set Empty String as NULL */
//         if (value === '') {
//           formData[key] = null;
//         }

//         /* Set true/false in String as Boolean */
//         else if (typeof value === 'string' && /^(true|false)$/i.test(value)) {
//           formData[key] = value.toLowerCase() === 'true';
//         }

//         /* Set Local Datetime as UTC Datetime */
//         else if (value instanceof Date) {
//           formData[key] = new Date(Date.UTC(
//             value.getFullYear(),
//             value.getMonth(),
//             value.getDate(),
//             value.getHours(),
//             value.getMinutes(),
//             value.getSeconds()
//           ));
//         }
//       }
//     }
//     return formData;
//   }
//   //#endregion

//   //#region Form Validation Message
//   initializeFormValidationMessage<T>(formConfig: FormConfigType<T>, form: FormGroup) {
//     form.valueChanges.subscribe(data => this.setFieldValidationErrors(data, formConfig as FormConfig, form));
//     this.setFieldValidationErrors(null, formConfig as FormConfig, form); // Reset validation messages initially
//   }

//   validateFormFields<T>(formConfig: FormConfigType<T>, form: FormGroup) {
//     this.setFieldValidationErrors(null, formConfig as FormConfig, form);
//   }

//   private setFieldValidationErrors(data: any, formConfig: FormConfig, form: FormGroup | FormArray): void {
//     if (!form) {
//       return;
//     }

//     Object.keys(formConfig).forEach(field => {
//       const control = form.get(field);

//       if (control) {
//         if (formConfig[field].type == 'array' && control instanceof FormArray) {
//           const nestedFormConfig = formConfig[field];
//           Object.keys(nestedFormConfig.items).forEach(element => {
//             nestedFormConfig.items[element].error = {};
//           });

//           control.controls.forEach((arrayItem, index) => {
//             if (arrayItem instanceof FormGroup) {
//               for (const arrayFormField in arrayItem.controls) {
//                 const fieldcontrol = arrayItem.get(arrayFormField);
//                 if (fieldcontrol) {
//                   if (!fieldcontrol.valid && fieldcontrol.touched) {
//                     const errorMessages: { [key: number]: string } = nestedFormConfig.items[arrayFormField].error ?? {};
//                     const messages = nestedFormConfig.items[arrayFormField]?.validationMessages ?? {};
//                     for (const key in fieldcontrol.errors) {
//                       if (errorMessages && Object.prototype.hasOwnProperty.call(fieldcontrol.errors, key)) {
//                         // const errorKey: string = index as unknown as string;
//                         errorMessages[index] = (messages[key] ?? fieldcontrol.errors[key]) + '';
//                         break;
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           });
//         }
//         // else if ((control instanceof FormGroup || control instanceof FormArray)) {
//         //   // Recursively handle nested FormGroup or FormArray  && formConfig[field].children && formConfig[field].type == "array"
//         //   const nestedFormConfig = formConfig[field] as unknown as FormArrayConfig;
//         //   this.setFieldValidationErrors(data, nestedFormConfig.children, control);
//         // }
//         else if (formConfig[field].type == 'control' && !control.valid && control.touched) {
//           formConfig[field].error = '';
//           const messages = formConfig[field]?.validationMessages ?? {};
//           for (const key in control.errors) {
//             if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
//               formConfig[field].error = (messages[key] ?? control.errors[key]) + '';
//               break;
//             }
//           }
//         }
//       }
//     });
//   }

//   // private setFieldValidationErrors(data: any, formConfig: FormConfig, form: FormGroup): void {
//   //   if (!form) {
//   //     return;
//   //   }

//   //   for (const field in formConfig) {
//   //     if (Object.prototype.hasOwnProperty.call(formConfig, field)) {
//   //       formConfig[field].error = '';
//   //       const control = form.get(field);

//   //       if (control && !control.valid && control.touched) {
//   //         const messages = formConfig[field]?.validationMessages ?? {};
//   //         for (const key in control.errors) {
//   //           if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
//   //             formConfig[field].error += (messages[key] ?? control.errors[key]) + '';
//   //             break;
//   //           }
//   //         }
//   //       }
//   //     }
//   //   }
//   // }
//   //#endregion

//   //#region Deprecated Methods
//   processFormData(formData: any): any {
//     for (const key in formData) {
//       if (formData[key] === '') {
//         formData[key] = null;
//       }

//       else if (typeof formData[key] === 'string' && /^(true|false)$/i.test(formData[key])) {
//         formData[key] = formData[key].toLowerCase() === 'true';
//       }

//       else if (formData[key] instanceof Date) {
//         formData[key] = new Date(Date.UTC(
//           formData[key].getFullYear(),
//           formData[key].getMonth(),
//           formData[key].getDate(),
//           formData[key].getHours(),
//           formData[key].getMinutes(),
//           formData[key].getSeconds()
//         ));
//       }
//     }
//     return formData;
//   }

//   processFormDataList(formData: any): any {
//     if (Array.isArray(formData)) {
//       return formData.map(item => this.processFormDataList(item));
//     }
//     else if (formData !== null) {
//       for (const key in formData) {
//         if (typeof formData[key] === 'string') {
//           if (formData[key].toLowerCase() === 'true') {
//             formData[key] = true;
//           } else if (formData[key].toLowerCase() === 'false') {
//             formData[key] = false;
//           }
//         }
//       }
//     }
//     return formData;
//   }

//   setValidationMessages(formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
//     form.valueChanges.subscribe(data => this.onValueChanged(data, formValidationMessages, formErrors, form));
//     this.onValueChanged(null, formValidationMessages, formErrors, form); // Reset validation messages initially
//   }

//   validateForm(formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
//     this.onValueChanged(null, formValidationMessages, formErrors, form);
//   }

//   private onValueChanged(data: any, formValidationMessages: FormValidationMessages, formErrors: FormErrors, form: FormGroup) {
//     console.log('called with data ' + data);
//     if (!form) {
//       return;
//     }

//     for (const field in formErrors) {
//       if (Object.prototype.hasOwnProperty.call(formErrors, field)) {
//         formErrors[field] = '';
//         const control = form.get(field);
//         const element = document.querySelector(`[formControlName="${field}"]`);

//         if (control && !control.valid && control.touched) {
//           const messages = formValidationMessages[field];
//           for (const key in control.errors) {
//             if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
//               formErrors[field] += (messages[key] ?? control.errors[key]) + '';
//               break;
//             }
//           }
//         }
//       }
//     }
//   }
//   //#endregion
// }
