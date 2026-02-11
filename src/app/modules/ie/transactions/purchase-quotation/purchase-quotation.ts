import { TList } from "../../../../shared/models/api-response";

export interface PurchaseQuotation {
    PurchaseQuotationID: number | null;
    PurchaseQuotationNo: string | null;
    BasedOn: number | null;
    PurchaseQuotationDate: Date | null;
    VendorID: number | null;
    VendorName: string | null;
    PurchaseRequisitionID: number | null;
    PurchaseRequisitionNo: string | null;
    FCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    ValidityDate: number | null;
    IncotermID: number | null;
    ProductList: PurchaseQuotationDetail[];
    PaymentTermID: number | null;
    Narration: string | null;
    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;

    //AutoComplete releted fields
    ProductID: number | null;
    ProductName: string | null;
}

export interface PurchaseQuotationDetail {
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
    TotalAmountFC: number | null;
    TotalAmountBC: number | null;
}

export interface PurchaseQuotation_IndexTableFilter {
    PurchaseQuotationNo: string | null;
    BasedOn: number | null;
    VendorName: string | null;
    IncotermID: number | null;
    StatusID: number | null;
}

export interface PurchaseQuotation_IndexTableSort {
    PurchaseQuotationNo: 1 | 0 | -1;
    PurchaseQuotationDate: 1 | 0 | -1;
    NetAmountFC: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
}

export interface PurchaseQuotation_IndexTableList {
    PurchaseQuotationID: number;
    PurchaseQuotationNo: string;
    PurchaseQuotationDate: string;
    BasedOn: string;
    VendorName: string;
    NoOfProducts: number;
    ValidityDate: Date | null;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusText: string;
    StatusHex: string;
}

export interface PurchaseQuotationRequest {
    PurchaseQuotationNo?: string | null;
    VendorName?: string | null;
    PopulateType: string | null;
}

export interface PurchaseQuotation_Detail {
    PurchaseQuotationID: number;
    PurchaseQuotationNo: string;
    BasedOn: number;
    VendorID: number;
    VendorName: string;
    VendorAddress: string | null;
    PurchaseQuotationDate: string;
    ValidityDate: string | null;
    PurchaseRequisitionID: number | null;
    PurchaseRequisitionNo: string | null;
    FCurrencyID: number;
    ExchangeRateDate: string;
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
    IsPurchaseAlreadyExists: boolean;
    ProductList: TList<PurchaseQuotationProduct_Detail>;
}

export interface PurchaseQuotationProduct_Detail {
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

export interface PurchaseQuotation_SelectList {
    PurchaseQuotationID: number;
    PurchaseQuotationNo: string;
    VendorName: string;
    StatusID: number;
}