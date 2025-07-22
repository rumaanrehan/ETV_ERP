export interface PaymentTermMaster {
  PaymentTermID: number | null;
  PaymentTermCode: string | null;
  PaymentTermName: string | null;
  Description: string | null;
  ActiveStatus?: boolean | null;
  CreatedBy?: string | null;
  CreatedDateTime?: string | null;
  ModifiedBy?: string | null;
  ModifiedDateTime?: string | null;
}

export interface PaymentTerm_IndexTableList {
  PaymentTermID: number;
  PaymentTermCode: string;
  PaymentTermName: string;
  Description: string;
  ActiveStatus: boolean;
}

export interface PaymentTerm_IndexTableFilter {
  PaymentTermCode: string | null;
  PaymentTermName: string | null;
  ActiveStatusID: number | null;
}

export interface PaymentTerm_SelectList {
  PaymentTermID: number;
  PaymentTermName: string;
}

export interface PaymentTermRequest {
  PaymentTermID?: number | null;
  PopulateType?: string | null;
}