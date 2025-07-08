export interface ExportOrderPayment {
  ExportOrderPaymentID: number | null;
  ExportOrderPaymentNo: string | null;
  PaymentRefNo: string | null;
  PaymentAmountFC: number | null;
  // PaymentAmountBC: number | null;
  PaymentDate: string | null;
}

export interface ExportOrderPayment_IndexTableList {
  ExportOrderPaymentID: number;
  ExportOrderPaymentNo: string;
  PaymentRefNo: string;
  PaymentAmountFC: number;
  PaymentDate: string;
  IsCanceled: boolean;
}

export interface ExportOrderPayment_IndexTableFilter {
  ExportOrderPaymentNo: string | null;
  PaymentRefNo: string | null;
  // PaymentDate: string | null;
  IsCanceled: boolean | null;
}

export interface ExportOrderPayment_SelectList {
  ExportOrderPaymentID: number | null;
  ExportOrderPaymentNo: string | null;
}

export interface ExportOrderPaymentRequest {
  ExportOrderPaymentNo?: string | null;
  PaymentRefNo?: string | null;
  PopulateType?: string | null;
}
