import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";
export interface PurchaseRequisition {
    PurchaseRequisitionID: number | null;
    RequisitionNo: string | null;
    RequisitionDate: Date | null;
    RequestedBy: string | null;
    FCCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    RequiredByDate: Date | null;
    ExchangeRateToBC: number | null;
    Note: string | null;
    ProductList: PurchaseRequisitionDetail[];

    ProductID: string | null;
    ProductName: string | null;
    Customer?: CompanyMaster;
}

export interface PurchaseRequisitionDetail {
    ProductID: number | null;
    ProductName: string | null;
    RequestedQty: number | null;
    UOM: string | null;
    Remarks: string | null;

    Product?: ProductMaster; 
}

export interface PurchaseRequisition_SelectList {
    PurchaseRequisitionID: number;
    RequisitionNo: string;
    RequestedBy: string;
    StatusID: number;
}

export interface PurchaseRequisition_IndexTableFilter {
    RequisitionNo: string | null;
    RequestedBy: string | null;
    StatusID: number | null;
}

export interface PurchaseRequisition_IndexTableSort {
    RequisitionNo: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
}

export interface PurchaseRequisition_IndexTableList {
    PurchaseRequisitionID: number;
    RequisitionNo: string;
    RequestedBy: string;
    RequisitionDate: Date;
    FCCurrencyID: number;
    RequiredByDate: Date;
    ProductCount: number;
    StatusText: string;
    StatusHex: string;
}

export interface PurchaseRequisitionRequest {
    SearchBy?: number | null;
    SearchValue?: string | null;
    RequisitionNo?: string | null;
    PopulateType?: string | null;
}

export interface PurchaseRequisition_Detail {
    PurchaseRequisitionID: number;
    RequisitionNo: string;
    RequisitionDate: Date;
    RequiredByDate: Date;
    ExchangeRateDate: Date;
    RequestedBy: number;
    Note: string | null;
    StatusText: string;
    StatusHex: string;
    IsQuotationAlreadyExists: boolean;
    ProductList: TList<PurchaseRequisition_Detail>;
}

export interface PurchaseRequisition_Detail {
    ProductID: number;
    ProductName: string;
    UOM: string;
    RequestedQty: number;
    Remarks: string | null;
}