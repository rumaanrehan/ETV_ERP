export interface ImportOrderDocument {
    ImportOrderDocumentID: number | null;
    ImportOrderID: number | null;
    ImportOrderNo: string | null;
    DocumentTypeID: number | null;
    DocumentFile: string | null;
}

export interface ImportOrderDocument_IndexTableFilter {
    ImportOrderNo: string | null;
    DocumentFile: string | null;
}

export interface ImportOrderDocument_IndexTableList {
    ImportOrderDocumentID: number | null;
    ImportOrderNo: number | null;
    DocumemntTypeCode: string | null;
    FileName: string | null;
    IsDeleted: boolean;
}
