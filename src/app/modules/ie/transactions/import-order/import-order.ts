import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface ImportOrder {
    ImportOrderID: number | null;
    ImportOrderNo: string | null;
    ImportOrderDate: Date | null;
    ReferenceDate: Date | null;
    ReferenceNo: string | null;
    VendorID: number | null;
    VendorName: number | null;

    //Exchange Rate Details
    FCCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;

    IncotermID: number | null;
    FreightChargeBC: number | null;
    InsuranceAmountBC: number | null;

    ProductList: ImportOrderDetail[];

    SubtotalAmountFC: number | null;
    TaxAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountBC: number | null;
    PaymentTerms: string | null;
    ShipmentModeID: string | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    FinalDestination: string | null;
    Narration: string | null;
    StatusID: number | null;
    
    ProductID: number | null;
    ProductName: string | null;

    Customer?: CompanyMaster
}

export interface ImportOrderRequest {
    ImportOrderNo?: string | null;
    PopulateType?: string | null;
}

export interface ImportOrder_SelectList {
    ImportOrderID: number;
    ImportOrderNo: string;
}

export interface ImportOrderDetail {
    ProductID: number | null;
    ProductName: string | null;
    SalesQty: number | null;
    SalesTaxRate: number | null;
    RatePerUnitBC: number | null;
    RatePerUnitFC: number | null;
    TaxAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxableAmountBC: number | null;
    TaxableAmountFC: number | null;

    //Foreign Keys
    Product?: ProductMaster;
}

export interface ImportOrder_IndexTableFilter {
    ImportOrderNo: string | null;
    StatusID: number | null;
}

export interface ImportOrder_IndexTableList {
    ImportOrderID: number;
    ImportOrderNo: string;
    ImportOrderDate: string;
    ReferenceNo: string;
    ReferenceDate: string;
    CompanyName: string;
    ShipmentMode: string;
    LoadingPortName: string;
    FinalDestination: string;
    NetAmountBC: number;
    IsKnockOff: boolean;
    StatusID: number;
}
