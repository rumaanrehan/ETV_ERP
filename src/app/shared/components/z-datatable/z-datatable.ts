import { TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DataTableFilterList } from "../../models/select-list";
import { DataViewFieldDef, DataViewSortRow } from "../z-dataview/z-dataview";

export interface DataTableDef<T> {
    tableKey: string;
    columnDef: DataTableColumnDef[];
    defaultSortColumn: DataTableDefaultSort;
    filterForm?: FormGroup;
    sortingForm?: FormGroup;
    sortFields?: DataViewSortRow[];
    filterFields?: DataViewFieldDef[];
    data: T[];
    totalRecords: number;
    loading: boolean;
}

export type DataTableColumnDef =
    | {
        data: string;
        label?: string;
        groupLabel?: string;
        orderable?: boolean;
        visible?: boolean;
        hideVisToggle?: boolean;
        filterable: true;
        filterType: 'select';
        filterKey: string; // Required when filterType is 'select' and filterable is true
        filterSelectList?: DataTableFilterList[];
        cssClass?: string;
        width?: string;
        customTemplate?: TemplateRef<any>;
    }
    | {
        data: string;
        label?: string;
        groupLabel?: string;
        orderable?: boolean;
        visible?: boolean;
        hideVisToggle?: boolean;
        filterable?: boolean;
        filterType?: 'text' | 'date' | 'daterange' | undefined;
        filterKey?: string; // Optional in other cases
        //   filterSelectList?: DataTableSelectList[];
        cssClass?: string;
        width?: string;
        customTemplate?: TemplateRef<any>;
    };

// export interface DataTableColumnDef {
//     data: string;
//     label?: string;
//     groupLabel?: string;
//     orderable?: boolean;
//     visible?: boolean;
//     hideVisToggle?: boolean; // sahi naam sochna hai
//     filterable?: boolean;
//     filterType?: 'text' | 'select' | 'date' | 'daterange';
//     filterKey?: string;
//     filterSelectList?: DataTableSelectList[];
//     cssClass?: string;
//     width?: string;
//     customTemplate?: TemplateRef<any>;
// }

export interface DataTableHeaderColDef {
    data: string;
    label: string;
    hasSubHeader?: boolean;
    colSpan?: number;
    orderable?: boolean;
    visible: boolean;
    hideVisToggle?: boolean;
    cssClass?: string;
}

export interface DataTableDefaultSort {
    sortField: string;
    sortOrder: number
}

export interface DataTableParams<T> {
    first?: number;
    last?: number;
    sortField?: string | string[] | null | undefined;
    sortOrder?: number | undefined | null;
    filters?: T;
}

export interface DataTableLazyLoadEvent {
    first?: number;
    last?: number;
    sortField?: string | string[] | null | undefined;
    sortOrder?: number | undefined | null;
}