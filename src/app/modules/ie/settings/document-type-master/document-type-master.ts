export interface DocumentTypeMaster {
  DocumentTypeID: number | null;
  DocumentTypeCode: string | null;
  DocumentTypeName: string | null;
  ActiveStatus?: boolean | null; 
}

export interface DocumentType_SelectList {
  DocumentTypeID: number | null;
  DocumentTypeName: string | null;
}

export interface DocumentType_IndexFilter {
  DocumentTypeCode: string;
  DocumentTypeName: string;
  
}

export interface DocumentType_IndexList {
  RowID: number;
  DocumentTypeID: number;
  DocumentTypeCode: string;
  DocumentTypeName: string;
  ActiveStatus: boolean | null; 
}

export interface DocumentTypeRequest {
  DocumentTypeCode?: string | null;
  DocumentTypeName?: string | null;
  PopulateType?: string | null;
}

