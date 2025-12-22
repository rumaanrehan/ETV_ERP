import { FormGroup } from "@angular/forms";

export interface DataViewDef<T> {
    tableKey: string;
    defaultSortColumn: DataViewDefaultSort;
    filterForm?: FormGroup;
    data: T[];
    totalRecords: number;
    loading: boolean;
}

export interface DataViewDefaultSort {
    sortField: string;
    sortOrder: number
}

export interface DataViewParams<T> {
    first?: number;
    last?: number;
    sortField?: string | string[] | null | undefined;
    sortOrder?: number | undefined | null;
    filters?: T;
}


export interface DataViewParams1<T, U> {
    first?: number;
    last?: number;
    filters?: T;
    sortings?: U;
}

export interface DataViewLazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string | string[] | null | undefined;
    sortOrder?: number | undefined | null;
}

export interface SortingForm {
    sortField: string | null;
    sortOrder: string | null;
}