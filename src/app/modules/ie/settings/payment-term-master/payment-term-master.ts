export interface PaymentTermMaster {
  PaymentTermID: number | null;
  PaymentTermCode: string | null;
  PaymentTermName: string | null;
  Description: string | null;
}

export interface PaymentTerm_IndexTableList {
  PaymentTermID: number;
  PaymentTermCode: string;
  PaymentTermName: string;
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

export interface PaymentTerm_Details {
  PaymentTermID: number | null;
  PaymentTermCode: string | null;
  PaymentTermName: string | null;
  Description: string | null;
}