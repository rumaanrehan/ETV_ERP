import { FormGroup } from "@angular/forms";

export type AutoCompleteDef<T> =
    | {
        type: 'formControl';
        group: FormGroup;
        control: string;
        inputId?: string;
        label?: string | undefined;
        validationMessage?: string | undefined;
        placeholder: string;
        options: T[];
        optionLabel: string;
        columns?: { data: string; label: string; width?: string }[];
        hideHeader?: boolean;
        multiple?: boolean;
    }
    | {
        type: 'suggestions';
        value: T;
        inputId?: string;
        label?: string | undefined;
        placeholder: string;
        options: T[];
        optionLabel: string;
        columns?: { data: string; label: string; width?: string }[];
        hideHeader?: boolean;
    };



    
export interface AutoCompleteDef12<T> {
    group?: FormGroup;
    control?: string | undefined;
    value?: T;
    label?: string | undefined;
    validationMessage?: string | undefined;
    placeholder: string;
    options: T[];
    optionLabel: string;
    columns?: { data: string; label: string; width?: string }[];
    showHeader?: boolean;
}
