export interface ExportOrderDocumentMapping {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    DocumentTypeID: number | null;
    DocumentFile: string | null;
}

export interface ExportOrderDocument_IndexTableFilter {
    ExportOrderCode: string | null;
    DocumentTypeID: number  | null;
    ActiveStatusID: number | null;
}

export interface ExportOrderDocument_IndexTableList {
    ExportOrderID: number;
    ExportOrderCode: string | null;
    ExportOrderNo: string | null;
    DocumentTypeName: string | null;
    ActiveStatus: boolean;
}



