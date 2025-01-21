import { TemplateRef } from "@angular/core";

export interface TableDef<T> {
  columnDef: TableColumnDef[];
  data: T[];
}

interface TableColumnDef {
  data: string;
  label: string;
  groupLabel?: string;
  visible?: boolean;
  colVisToggle?: boolean;
  cssClass?: string;
  width?: string;
  customTemplate?: TemplateRef<any>;
}

export interface TableHeaderColDef {
    data: string;
    label: string;
    hasSubHeader?: boolean;
    colSpan?: number;
    visible?: boolean;
    colVisToggle?: boolean;
    cssClass?: string;
}