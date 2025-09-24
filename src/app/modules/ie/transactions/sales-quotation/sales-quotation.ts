import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface SalesQuotation {
    QuotationID: number | null;
    QuotationNo: string | null;
    QuotationDate: Date | null;
    EnquiryID: number | null;
    CustomerID: number | null;
    CustomerName: string | null;
    FCCurrencyID: number | null;
    ExchangeRateToBC: number | null;
    ValidityDate: Date | null;

    ProductList: SalesQuotationDetail[];

    PaymentTermID: number | null;
    Narration: string | null;
    IncotermID: number | null;
    ProductID: number | null;
    ProductName: string | null;

    SubtotalAmountFC : number | null;
    SubtotalAmountBC : number | null;
    TaxAmountFC : number | null;
    TaxAmountBC : number | null;
    NetAmountFC : number | null;
    NetAmountBC : number | null;
    StatusID: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustmentFC: number | null;
    CoinAdjustmentBC: number | null;
    
    Customer?: CompanyMaster;
}

export interface SalesQuotationDetail {
    ProductID: number | null;
    ProductName: string | null;
    QuotedQty : number | null;
    TaxRate: number | null;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    QuotationAmountFC : number | null;
    QuotationAmountBC : number | null;

    //Foreign Keys
    Product?: ProductMaster;
}

export interface SalesQuotationRequest {
    QuotationNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface SalesQuotation_SelectList {
    QuotationID: number;
    QuotationNo: string;
    CustomerName: string;
}

export interface SalesQuotation_IndexTableFilter {
    QuotationNo: string | null;
    CustomerName: string | null;
    IncotermID: number | null;
    StatusID: number | null;
}

export interface SalesQuotation_IndexTableList {
    QuotationID: number;
    QuotationNo: string;
    QuotationDate: string;
    CompanyName: string;
    ValidityDate: string;
    NetAmountBC: number;
    StatusID: number;
}