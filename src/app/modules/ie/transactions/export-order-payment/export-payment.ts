import { TemplateRef } from "@angular/core";

export interface ExportOrderPayment {
  ExportOrderPaymentID: number | null;
  ExportOrderPaymentNo: string | null;
  ExportOrderID: number | null;
  ExportOrderNo: string | null;
  PaymentRefNo: string | null;
  PaymentAmountFC: number | null;
  ExchangeRateToBC: number | null
  PaymentAmountBC: number | null;
  PaymentDate: string | null;
}

export interface ExportOrderPayment_IndexTableList {
  ExportOrderPaymentID: number;
  ExportOrderPaymentNo: string;
  ExportOrderNo: string;
  PaymentRefNo: string;
  PaymentAmountFC: number;
  PaymentDate: string;
  ActiveStatus: boolean;
}

export interface ExportOrderPayment_IndexTableFilter {
  ExportOrderPaymentNo: string | null;
  PaymentRefNo: string | null;
  ExportOrderNo: string;
  PaymentDate: string | null;
  IsCanceled: number | null;
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

export interface ExportOrderPaymentTemplate {
    SerialNoTemplate?: TemplateRef<any>;
    PaymentDateTemplate?: TemplateRef<any>;
    ActionTemplate?: TemplateRef<any>;
}