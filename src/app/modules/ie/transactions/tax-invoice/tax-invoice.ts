import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface TaxInvoice {
    TaxInvoiceID: number | null;
    TaxInvoiceNo: string | null;
    TaxInvoiceDate: Date | null;
    BasedOn: number | null;
    DocumentID: number | null;
    DocumentNo: string | null;
    CustomerID: number | null;
    CustomerName: string | null;
    FCCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    FreightChargeFC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;
    BankChargesFC: number | null;
    BankChargesBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    Narration: number | null;
    StatusID: number | null;

    ProductList: TaxInvoiceDetail[];

    Customer?: CompanyMaster;

    ProductID: number | null;
    ProductName: string | null;
}

export interface TaxInvoiceDetail {
    ProductID: number | null;
    ProductName: string | null;
    SalesQty: number | null;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;
    SalesTaxRate: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    SalesAmountFC: number | null;
    SalesAmountBC: number | null;
    //Foreign Keys
    Product?: ProductMaster;
}

export interface TaxInvoice_SelectList {
    TaxInvoiceID: number;
    TaxInvoiceNo: string;
    CustomerName: string;
}

export interface TaxInvoice_IndexTableFilter {
    TaxInvoiceNo: string | null;
    CustomerName: string | null;
    StatusID: number | null;
}

export interface TaxInvoice_IndexTableList {
    TaxInvoiceID: number;
    TaxInvoiceNo: string;
    TaxInvoiceDate: Date;
    BasedOn: string;
    DocumentNo: string;
    CustomerName: string;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusID: number;
}

export interface TaxInvoiceRequest {
    SearchBy: number | null;
    SearchValue: string | null;
    PopulateType: string | null;
}