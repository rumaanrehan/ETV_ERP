import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormConfig, FormConfigType, FormErrors, FormValidationMessages } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
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
            const control = new FormControl({value: config.defaultValue, disabled: config.disabled || false}, config.validators);
            formGroup.addControl(key, control);
        }
    }
    return formGroup;
  }
  
  // Helper to create FormArray items
  createFormArrayItem<T>(itemConfig: FormConfigType<T>): FormGroup {
    return this.createFormGroup(itemConfig);
  }

  createFormGroup_DataTableFilter<T>(model : T): FormGroup {
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

  resetFormValue<T>(formConfig: FormConfigType<T>, form: FormGroup): void{
    console.log("yaha aaya hjun");
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
    if(Array.isArray(formArrayData)) {
      return formArrayData.map(item => this.transformFormData(item));
    }
    return formArrayData;
  }
  
  transformFormData(formData: any): any {
    for (const key in formData) {
      const value = formData[key];
      // console.log(value);
  
      if(Array.isArray(value)) {
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
  }

  private setFieldValidationErrors(data: any, formConfig: FormConfig, form: FormGroup | FormArray): void {
    if (!form) {
      return;
    }
    
    Object.keys(formConfig).forEach(field => {
      const control = form.get(field);
  
      if (control) {
        if(formConfig[field].type == 'array' && control instanceof FormArray) {
          const nestedFormConfig = formConfig[field];
          Object.keys(nestedFormConfig.items).forEach(element => {
            nestedFormConfig.items[element].error = {};
          });
          
          control.controls.forEach((arrayItem, index) => {
            if(arrayItem instanceof FormGroup){
              for(const arrayFormField in arrayItem.controls){
                const fieldcontrol = arrayItem.get(arrayFormField);
                if(fieldcontrol){
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
     else if (formData !== null)
     {
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
    console.log('called with data ' + data);
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