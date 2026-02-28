import { FormGroup } from "@angular/forms";
import { DataTableFilterList } from "../../models/select-list";

export type FieldType = 'text' | 'number' | 'date' | 'dropdown';

export interface DataViewFilterDropdownOptions {
    label: string;
    value: number | string;
}

export interface DataViewFieldDef {
    field: string;
    label: string;
    type: FieldType;
    options?: DataTableFilterList[]; // for dropdown
}


export interface DataViewDefaultSort {
    sortField: string;
    sortOrder: number
}

export interface DataViewSortRow {
    field: string;
    label: string;
    enabled: boolean;
    order: 1 | 0 | -1;
}

export interface DataViewParams<T, U> {
    first?: number;
    last?: number;
    filters?: T;
    sortings?: U;
}

export interface DataViewDef<T> {
    tableKey: string;
    defaultSortColumn: DataViewDefaultSort;

    filterForm: FormGroup;
    sortingForm: FormGroup;

    filterFields?: DataViewFieldDef[];
    sortFields?: DataViewSortRow[];

    data: T[];
    totalRecords: number;
    loading: boolean;
}

export interface DataViewLazyLoadEvent {
    first: number;
    rows?: number;
    sortField?: string | string[] | null | undefined;
    sortOrder?: number | undefined | null;
}