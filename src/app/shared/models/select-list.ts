export interface StaticList {
    iValue: number;
    cValue: string;
    Text: string;
}

export interface StaticListRequest {
    AreaName: string;
    ControllerName: string;
    FieldName: string;
}

export interface DataTableFilterList {
    Value: number;
    Text: string;
}

export interface DataTableFilterListRequest {
    AreaName: string;
    ControllerName: string;
    TableName: string;
    ColumnName: string;
}