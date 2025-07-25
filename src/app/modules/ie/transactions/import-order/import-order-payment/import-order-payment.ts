export class ImportOrderPayment {
}
export interface ImportOrderPayment {
  ImportOrderPaymentID: number | null;
  ImportOrderPaymentNo: string | null;
  ImportOrderID: number | null;
  ImportOrderNo: string | null;
  PaymentRefNo: string | null;
  PaymentAmountFC: number | null;
  ExchangeRateToBC: number | null
  PaymentAmountBC: number | null;
  PaymentDate: string | null;
}

export interface ImportOrderPayment_IndexTableList {
  ImportOrderPaymentID: number;
  ImportOrderPaymentNo: string;
  ImportOrderNo: string;
  PaymentRefNo: string;
  PaymentAmountFC: number;
  PaymentDate: string;
  ActiveStatus: boolean;
}

export interface ImportOrderPayment_IndexTableFilter {
  ImportOrderPaymentNo: string | null;
  PaymentRefNo: string | null;
  ImportOrderNo: string;
  PaymentDate: string | null;
  IsCanceled: number | null;
}

export interface ImportOrderPayment_SelectList {
  ImportOrderPaymentID: number | null;
  ImportOrderPaymentNo: string | null;
}

export interface ImportOrderPaymentRequest {
  ImportOrderPaymentNo?: string | null;
  PaymentRefNo?: string | null;
  PopulateType?: string | null;
}
