import { TList } from "../../../../shared/models/api-response";

export interface SalesQuotation {
    SalesQuotationID: number | null;
    SalesQuotationNo: string | null;
    BasedOn: number | null;
    SalesQuotationDate: Date | null;
    ValidityDate: Date | null;
    SalesEnquiryID: number | null;
    SalesEnquiryNo: string | null;
    CustomerID: number | null;
    CustomerName: string | null;
    FCCurrencyID: number | null;
    ExchangeRateToBC: number | null;
    IncotermID: number | null;
    ProductList: SalesQuotationDetail[];
    PaymentTermID: number | null;
    Narration: string | null;
    //Amount releted fields
    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;
}

export interface SalesQuotationDetail {
    ProductID: number | null;
    ProductName: string | null;
    QuotedQty: number | null;
    UOM: string | null;
    TaxRate: number | null;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    QuotationAmountFC: number | null;
    QuotationAmountBC: number | null;
}

export interface SalesQuotation_IndexTableFilter {
    SalesQuotationNo: string | null;
    CustomerName: string | null;
    BasedOn: number | null;
    StatusID: number | null;
}

export interface SalesQuotation_IndexTableSort {
    SalesQuotationNo: 1 | 0 | -1;
    SalesQuotationDate: 1 | 0 | -1;
    NetAmountFC: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
}

export interface SalesQuotation_IndexTableList {
    SalesQuotationID: number;
    SalesQuotationNo: string;
    SalesQuotationDate: string;
    BasedOn: string;
    CustomerName: string;
    NoOfProducts: number;
    ValidityDate: Date | null;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusText: string;
    CurrencySymbol: string;

    /** UI only */
    _selected?: boolean;
}

export interface SalesQuotationRequest {
    SalesQuotationNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface SalesQuotation_Detail {
    SalesQuotationID: number;
    SalesQuotationNo: string;
    BasedOn: number;
    SalesQuotationDate: string;
    ValidityDate: string | null;
    SalesEnquiryID: number | null;
    SalesEnquiryNo: string | null;
    CustomerID: number;
    CustomerName: string;
    CustomerAddress: string | null;
    FCCurrencyID: number;
    ExchangeRateToBC: number;
    IncotermID: number | null;
    PaymentTermID: number | null;
    Narration: string | null;
    IsRoundOff: boolean;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusText: string;
    StatusHex: string;
    IsExportAlreadyExists: boolean;
    ProductList: TList<SalesQuotationProduct_Detail>;
}

export interface SalesQuotationProduct_Detail {
    ProductID: number;
    ProductName: string;
    UOM: string;
    QuotedQty: number;
    RatePerUnitFC: number;
    TaxRate: number;
    TaxableAmountFC: number;
    TaxAmountFC: number;
    QuotationAmountFC: number;
}

export interface SalesQuotation_SelectList {
    SalesQuotationID: number;
    SalesQuotationNo: string;
    CustomerName: string;
    StatusID: number;
}

export interface SalesQuotationBulkUpdateRequest {
    SalesQuotationIDs: number[];
    StatusID: number;
}