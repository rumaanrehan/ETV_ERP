import { TList } from "../../../../shared/models/api-response";

export interface PurchaseRequisition {
    PurchaseRequisitionID: number | null;
    PurchaseRequisitionNo: string | null;
    RequisitionDate: Date | null;
    CustomerID: number | null;
    CustomerName: string | null;
    ExchangeRateDate: Date | null;
    RequiredByDate: Date | null;
    ExchangeRateToBC: number | null;
    FCCurrencyID: number | null;
    Note: string | null;
    ProductList: PurchaseRequisitionDetail[];

    ProductID: string | null;
    ProductName: string | null;
    // Customer?: CompanyMaster;
}

export interface PurchaseRequisitionDetail {
    ProductID: number | null;
    ProductName: string | null;
    RequestedQty: number | null;
    UOM: string | null;
    Remarks: string | null;

    // Product?: ProductMaster; // Ye hatega
}

export interface PurchaseRequisition_SelectList {
    PurchaseRequisitionID: number;
    PurchaseRequisitionNo: string;
    CustomerName: string;
    StatusID: number;
}

export interface PurchaseRequisition_IndexTableFilter {
    PurchaseRequisitionNo: string | null;
    CustomerName: string | null;
    StatusID: number | null;
}

export interface PurchaseRequisition_IndexTableSort {
    PurchaseRequisitionNo: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
}

export interface PurchaseRequisition_IndexTableList {
    PurchaseRequisitionID: number;
    PurchaseRequisitionNo: string;
    CustomerName: string;
    RequisitionDate: Date;
    RequiredByDate: Date;
    ProductCount: number;
    StatusText: string;
    StatusHex: string;
}

export interface PurchaseRequisitionRequest {
    PurchaseRequisitionNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}
//get detail interface
export interface PurchaseRequisition_Detail {
    PurchaseRequisitionID: number;
    PurchaseRequisitionNo: string;
    RequisitionDate: Date;
    RequiredByDate: Date;
    CustomerID: number;
    CustomerName: string;
    ExchangeRateDate: Date;
    ExchangeRateToBC: number;
    FCCurrencyID: number;
    Note: string | null;
    StatusText: string;
    StatusHex: string;
    IsQuotationAlreadyExists: boolean;
    ProductList: TList<PurchaseRequisitionDetail>;
}