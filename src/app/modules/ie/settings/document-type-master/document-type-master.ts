export interface DocumentTypeMaster {
  DocumentTypeID: number | null;
  DocumentTypeCode: string | null;
  DocumentTypeName: string | null;
  ShortCode: string | null;
  IsVerificationRequired: boolean | null;
  Description: string | null;
}

export interface DocumentType_SelectList {
  DocumentTypeID: number;
  DocumentTypeName: string;
}

export interface DocumentType_IndexFilter {
  DocumentTypeCode: string | null;
  DocumentTypeName: string | null;
  ShortCode: string | null;
  IsApprovalRequired: number | null;
  ActiveStatusID: number | null;
}

export interface DocumentType_IndexList {
  DocumentTypeID: number;
  DocumentTypeCode: string;
  DocumentTypeName: string;
  ShortCode: string;
  IsVerificationRequired: boolean;
  ActiveStatus: boolean | null; 
}

export interface DocumentTypeRequest {
  DocumentTypeCode?: string | null;
  DocumentTypeName?: string | null;
  PopulateType?: string | null;
}

export interface DocumentTypeDetails{
  DocumentTypeID: number;
  DocumentTypeCode: string;
  DocumentTypeName: string;
  ShortCode: string | null;
  IsVerificationRequired: boolean;
}

