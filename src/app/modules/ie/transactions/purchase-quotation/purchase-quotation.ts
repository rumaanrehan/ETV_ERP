import { TList } from "../../../../shared/models/api-response";

export interface PurchaseQuotation {
    QuotationID: number | null;
    QuotationNo: string | null;
    QuotationDate: Date | null;
    VendorID: number | null;
    VendorName: string | null;
    BasedOn: number | null;
    RequisitionID: number | null;
    ForeignCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    ValidityDate: number | null;
    IncotermID: number | null;
    ProductList: PurchaseQuotationDetail[];
    PaymentTermID: number | null;
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
    QuotationAmountFC: number | null;
    QuotationAmountBC: number | null;
}

export interface PurchaseQuotation_IndexTableFilter {
    QuotationNo: string | null;
    CustomerName: string | null;
    BasedOn: number | null;
    StatusID: number | null;
}

export interface PurchaseQuotation_IndexTableSort {
    QuotationNo: 1 | 0 | -1;
    QuotationDate: 1 | 0 | -1;
    NetAmountFC: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
}

export interface PurchaseQuotation_IndexTableList {
    QuotationID: number;
    QuotationNo: string;
    QuotationDate: string;
    BasedOn: string;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusText: string;
    StatusHex: string;
}

export interface PurchasesQuotationRequest {
    QuotationNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface PurchaseQuotation_Detail {
    QuotationID: number;
    QuotationNo: string;
    BasedOn: number;
    VendorID: number;
    QuotationDate: string;
    VendorName: string;
    VendorAddress: string;
    ValidityDate: string | null;
    EnquiryID: number | null;
    EnquiryNo: string | null;
    CustomerID: number;
    CustomerName: string;
    CustomerAddress: string | null;
    ForeignCurrencyID: number;
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
    IsImportAlreadyExists: boolean;
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
    QuotationID: number;
    QuotationNo: string;
    CustomerName: string;
    StatusID: number;
}