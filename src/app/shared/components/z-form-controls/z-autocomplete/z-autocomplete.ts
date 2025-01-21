import { FormGroup } from "@angular/forms";

export type AutoCompleteDef<T> =
    | {
        type: 'formControl';
        group: FormGroup;
        control: string;
        label?: string | undefined;
        validationMessage?: string | undefined;
        placeholder: string;
        options: T[];
        optionLabel: string;
        columns?: { data: string; label: string; width?: string }[];
        hideHeader?: boolean;
    }
    | {
        type: 'suggestions';
        value: T;
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