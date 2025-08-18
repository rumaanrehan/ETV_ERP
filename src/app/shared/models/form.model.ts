import { ValidatorFn } from '@angular/forms';

export type FormConfigType<T> = {
  [P in keyof T]: T[P] extends Array<infer U> // Check if T[P] is an array
  ? {
    type: 'array';
    items: FormConfigType<U>; // Array of configurations for each item in the array
    // validators?: ValidatorFn[];
    // validationMessages?: { [key: string]: string };
  }
  : T[P] extends object // Check if T[P] is an object
  ? {
    type: 'group';
    items: FormConfigType<T[P]>; // Recursive group structure
  }
  : {
    label: string;
    defaultValue: T[P];
    disabled?: boolean; // Added this property
    validators?: ValidatorFn[];
    validationMessages?: { [key: string]: string };
    error?: string;
    type?: 'control';
  };
};

export type DataTableFilterFormConfigType<T> = {
  [P in keyof T]: T[P];
};

// Root configuration interface
export interface FormConfig {
  [key: string]: FormFieldConfig;
}

// Union type for all form field configurations
type FormFieldConfig = FormControlConfig | FormGroupConfig | FormArrayConfig;

// Interface for an array of controls
interface FormArrayConfig {
  type: 'array';
  items: { [key: string]: FormControlConfig }; // Configuration for each item in the array
}

// Interface for a nested group of controls
interface FormGroupConfig {
  type: 'group';
  items: { [key: string]: FormControlConfig }; // Recursive structure
}

// Interface for a single control within the form configuration
interface FormControlConfig {
  label: string;
  defaultValue: any;
  disabled?: boolean;
  validators?: ValidatorFn[];
  validationMessages?: { [key: string]: string };
  error?: FormConfigError;
  type?: 'control';
}

// Unified error type
type FormConfigError = string | { [key: number]: string };

// Deprecated Interface
export type FormValidationMessages = {
  [key: string]: {
    [key: string]: string;
  };
};

export type FormErrors = {
  [key: string]: string;
};

interface ValidationMessages {
  [key: string]: string;
}

// // Interface for individual control configuration
// interface FormControlConfig<T> {
//   label: string;
//   defaultValue: T;
//   validators?: ValidatorFn[];
//   validationMessages?: { [key: string]: string };
//   error?: string;
//   type?: 'control' | 'group' | 'array';
//   children?: FormConfig<T>;
// }

// // Interface for array configuration
// interface FormArrayConfig<U> extends FormControlConfig<U> {
//   type: 'array';
//   children: FormConfig<U>;
// }

// // Recursive FormConfig interface that uses conditional types
// export type FormConfig<T> = {
//   [P in keyof T]: T[P] extends Array<infer U>
//     ? FormArrayConfig<U>
//     : FormControlConfig<T[P]>;
// };

// interface FormArrayControlConfig {
//   label: string;
//   defaultValue: any;
//   validators?: ValidatorFn[];
//   validationMessages?: { [key: string]: string };
//   error?: { [key: string]: string };
//   type?: 'control';
// }

// interface FormFieldConfig {
//   label: string;
//   defaultValue: any;
//   validators?: ValidatorFn[];
//   validationMessages?: ValidationMessages;
//   error?: string;
//   children?: { [key: string]: FormFieldConfig };
// }

// export interface FormConfig {
//   [key: string]: FormFieldConfig;
// }

// Define FormConfig to require all keys in HolidayMaster
// export type FormConfigType1<T> = {
//   [K in keyof T]: FormFieldConfig;
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';
//     children?: FormConfigType<T[P]>; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends object ? (T[P] extends Array<any> ? {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'array';
//     children: FormConfigType<T[P][number]>; // For handling array of objects
//   } : {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'group';
//     children: FormConfigType<T[P]>; // For handling nested objects
//   }) : {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'control'; // For simple types like string, number, boolean
//   };
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U> // When T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array'; // Type is array
//         children: FormConfigType<U>; // children for each item in the array
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'control'; // For non-array properties, use 'control'
//       };
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';
//     children?: FormConfigType<T[P]> | null; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';  // Added types for 'control', 'array', and 'group'
//     children?: FormConfigType<T[P]> | FormConfigType<T[P]>[] | null; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U>  // Check if T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array';
//         children: FormConfigType<U>; // For arrays, use FormConfigType<U> for individual item config
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type?: 'control' | 'group';
//         children?: FormConfigType<T[P]>; // For nested groups/objects
//       };
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U> // If T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array'; // Add 'array' as a valid type
//         children: FormConfigType<U>[]; // Nested configuration for each item
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type?: 'control' | 'group';
//         children?: FormConfigType<T[P]>; // Nested groups/objects
//       };
// };









// Zunified Code

// import { ValidatorFn } from "@angular/forms";

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U>  // Check if T[P] is an array
//   ? {
//     type: 'array';
//     items: FormConfigType<U>; // Array of configurations for each item in the array
//   }
//   : T[P] extends object // Check if T[P] is an object
//   ? {
//     type: 'group';
//     items: FormConfigType<T[P]>; // Recursive group structure
//   }
//   : {
//     label: string;
//     defaultValue: T[P];
//     disabled?: boolean; // Added this property
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control';
//   };
// };

// export type DataTableFilterFormConfigType<T> = {
//   [P in keyof T]: T[P];
// };



// // Root configuration interface
// export interface FormConfig {
//   [key: string]: FormFieldConfig;
// }

// // Union type for all form field configurations
// type FormFieldConfig = FormControlConfig | FormGroupConfig | FormArrayConfig;

// // Interface for an array of controls
// interface FormArrayConfig {
//   type: 'array';
//   items: { [key: string]: FormControlConfig }; // Configuration for each item in the array
// }

// // Interface for a nested group of controls
// interface FormGroupConfig {
//   type: 'group';
//   items: { [key: string]: FormControlConfig }; // Recursive structure
// }

// // Interface for a single control within the form configuration
// interface FormControlConfig {
//   label: string;
//   defaultValue: any;
//   disabled?: boolean;
//   validators?: ValidatorFn[];
//   validationMessages?: { [key: string]: string };
//   error?: FormConfigError;
//   type?: 'control';
// }

// // Unified error type
// type FormConfigError = string | { [key: number]: string };



// // Deprecated Interface
// export type FormValidationMessages = {
//   [key: string]: {
//     [key: string]: string;
//   };
// };

// export type FormErrors = {
//   [key: string]: string;
// };

// interface ValidationMessages {
//   [key: string]: string;
// }

// // Interface for individual control configuration
// interface FormControlConfig<T> {
//   label: string;
//   defaultValue: T;
//   validators?: ValidatorFn[];
//   validationMessages?: { [key: string]: string };
//   error?: string;
//   type?: 'control' | 'group' | 'array';
//   children?: FormConfig<T>;
// }

// // Interface for array configuration
// interface FormArrayConfig<U> extends FormControlConfig<U> {
//   type: 'array';
//   children: FormConfig<U>;
// }

// // Recursive FormConfig interface that uses conditional types
// export type FormConfig<T> = {
//   [P in keyof T]: T[P] extends Array<infer U>
//     ? FormArrayConfig<U>
//     : FormControlConfig<T[P]>;
// };

// interface FormArrayControlConfig {
//   label: string;
//   defaultValue: any;
//   validators?: ValidatorFn[];
//   validationMessages?: { [key: string]: string };
//   error?: { [key: string]: string };
//   type?: 'control';
// }

// interface FormFieldConfig {
//   label: string;
//   defaultValue: any;
//   validators?: ValidatorFn[];
//   validationMessages?: ValidationMessages;
//   error?: string;
//   children?: { [key: string]: FormFieldConfig };
// }

// export interface FormConfig {
//   [key: string]: FormFieldConfig;
// }

// Define FormConfig to require all keys in HolidayMaster
// export type FormConfigType1<T> = {
//   [K in keyof T]: FormFieldConfig;
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';
//     children?: FormConfigType<T[P]>; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends object ? (T[P] extends Array<any> ? {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'array';
//     children: FormConfigType<T[P][number]>; // For handling array of objects
//   } : {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'group';
//     children: FormConfigType<T[P]>; // For handling nested objects
//   }) : {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type: 'control'; // For simple types like string, number, boolean
//   };
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U> // When T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array'; // Type is array
//         children: FormConfigType<U>; // children for each item in the array
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'control'; // For non-array properties, use 'control'
//       };
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';
//     children?: FormConfigType<T[P]> | null; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: {
//     label: string;
//     defaultValue: T[P];
//     validators?: ValidatorFn[];
//     validationMessages?: { [key: string]: string };
//     error?: string;
//     type?: 'control' | 'array' | 'group';  // Added types for 'control', 'array', and 'group'
//     children?: FormConfigType<T[P]> | FormConfigType<T[P]>[] | null; // For nested groups/arrays
//   }
// };

// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U>  // Check if T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array';
//         children: FormConfigType<U>; // For arrays, use FormConfigType<U> for individual item config
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type?: 'control' | 'group';
//         children?: FormConfigType<T[P]>; // For nested groups/objects
//       };
// };



// export type FormConfigType<T> = {
//   [P in keyof T]: T[P] extends Array<infer U> // If T[P] is an array
//     ? {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type: 'array'; // Add 'array' as a valid type
//         children: FormConfigType<U>[]; // Nested configuration for each item
//       }
//     : {
//         label: string;
//         defaultValue: T[P];
//         validators?: ValidatorFn[];
//         validationMessages?: { [key: string]: string };
//         error?: string;
//         type?: 'control' | 'group';
//         children?: FormConfigType<T[P]>; // Nested groups/objects
//       };
// };