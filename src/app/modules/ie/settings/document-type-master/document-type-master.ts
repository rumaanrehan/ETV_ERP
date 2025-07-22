export interface DocumentTypeMaster {
  DocumentTypeID: number | null;
  DocumentTypeCode: string | null;
  DocumentTypeName: string | null;
  ShortCode: string | null;
  IsApprovalRequired: boolean | null;
  Description: string | null;
}

export interface DocumentType_SelectList {
  DocumentTypeID: number;
  DocumentTypeName: string;
}

export interface DocumentType_IndexFilter {
  DocumentTypeCode: string | null;
  DocumentTypeName: string | null;
  ActiveStatusID: number | null;
}

export interface DocumentType_IndexList {
  RowID: number;
  DocumentTypeID: number;
  DocumentTypeCode: string;
  DocumentTypeName: string;
  ShortCode: string;
  IsApprovalRequired: boolean;
  ActiveStatus: boolean | null; 
}

export interface DocumentTypeRequest {
  DocumentTypeCode?: string | null;
  DocumentTypeName?: string | null;
  PopulateType?: string | null;
}

