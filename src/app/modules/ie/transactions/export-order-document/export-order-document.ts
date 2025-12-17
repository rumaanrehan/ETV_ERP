import { TemplateRef } from "@angular/core";

export interface ExportOrderDocument {
    ExportOrderDocumentID: number | null;
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    DocumentTypeID: number | null;
    DocumentTypeName: string | null;
    DocumentFile: File | null;
}

export interface ExportOrderDocument_IndexTableFilter {
    ExportOrderNo: string | null;
    DocumentTypeName: string | null;
}

export interface ExportOrderDocument_IndexTableList {
    ExportOrderDocumentID: number | null;
    ExportOrderNo: number | null;
    DocumentTypeCode: string | null;
    DocumentTypeName: string | null;
    IsDeleted: boolean;
}

export interface ExportOrderDocumentTemplate {
    SerialNoTemplate?: TemplateRef<any>;
    IsVerfiedTemplate?: TemplateRef<any>;
    UpdateDateTemplate?: TemplateRef<any>;
    ActionTemplate?: TemplateRef<any>;
}