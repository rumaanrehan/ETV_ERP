export interface ExportOrderBillRegulation {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ShippingBill: boolean | null;
    AirwayBill: boolean | null;
    IECCertificate: boolean | null;
    Invoice: boolean | null;
    PackingSlip: boolean | null;
    CustomerPO: boolean | null;
}

export interface ExportOrderBillRegulationRequest {
    ExportOrderID: number | null;
    SelectedDocuments: ExportOrderDocumentType[];
}

export enum ExportOrderDocumentType {
  ShippingBill = 1,
  AirwayBill = 2,
  IECCertificate = 3,
  Invoice = 4,
  PackingSlip = 5,
  CustomerPO = 6
}