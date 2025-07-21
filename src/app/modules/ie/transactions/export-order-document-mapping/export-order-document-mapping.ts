export interface ExportOrderDocumentMapping {
    ExportOrderDocumentMappingID: number | null;
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    DocumentTypeID: number | null;
    DocumentFile: string | null;
}

export interface ExportOrderDocument_IndexTableFilter {
    ExportOrderNo: string | null;
    DocumentFile: string | null;
}

export interface ExportOrderDocument_IndexTableList {
    ExportOrderDocumentMappingID: number | null;
    ExportOrderNo: number | null;
    DocumemntTypeCode: string | null;
    FileName: string | null;
    IsDeleted: boolean;
}