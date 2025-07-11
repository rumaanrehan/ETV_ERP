export interface ExportOrderPayment {
  PaymentID: number | null;
  PaymentNo: string | null;
  PaymentRefNo: string | null;
  PaymentAmountFC: number | null;
  // PaymentAmountBC: number | null;
  PaymentDate: string | null;
}

export interface ExportOrderPayment_IndexTableList {
  PaymentID: number;
  PaymentNo: string;
  PaymentRefNo: string;
  PaymentAmountFC: number;
  PaymentDate: string;
  ActiveStatus: boolean;
}

export interface ExportOrderPayment_IndexTableFilter {
  PaymentNo: string | null;
  PaymentRefNo: string | null;
  PaymentDate: string | null;
  IsCanceled: number | null;
}

export interface ExportOrderPayment_SelectList {
  PaymentID: number | null;
  PaymentNo: string | null;
}

export interface ExportOrderPaymentRequest {
  PaymentNo?: string | null;
  PaymentRefNo?: string | null;
  PopulateType?: string | null;
}
