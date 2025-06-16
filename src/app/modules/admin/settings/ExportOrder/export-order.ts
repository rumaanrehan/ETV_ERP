export interface ExportOrder {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ExportOrderDate: Date | null;
    ReferenceNo: string | null;
    ReferenceDate: Date | null;
    PaymentReferenceNo: string | null;
    CustomerID: number | null;
    CustomerAddress: string | null;
    CurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    IncotermID: number | null;
    FreightChargeBC: number | null;
    InsuranceAmountBC: number | null;
    IsDutyDrawable: boolean | null;
    IsRoDTEP: boolean | null;
    ProductList: ExportOrderDetail[];
    AmountBeforeTaxFC: number | null;
    TaxAmountFC: number | null;
    AmountBeforeTaxBC: number | null;
    TaxAmountBC: number | null;
    PaymentTerms: string | null;
    ShipmentMode: string | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    DestinationName: string | null;
    Narration: string | null;
    StatusID: number | null;
}

interface ExportOrderDetail{
    ProductID: number | null;
    Quantity: number | null;
    RatePerUnitBC: number | null;
}

export interface ExportOrder_IndexTableFilter {
    ExportOrderNo: string | null;
    StatusID: number | null;
}

export interface ExportOrder_IndexTableList {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ExportOrderDate: Date | null;
    AmountBeforeTaxBC: number | null;
    TaxAmountBC: number | null;
    DestinationName: string | null;
    StatusID: number | null;
}
