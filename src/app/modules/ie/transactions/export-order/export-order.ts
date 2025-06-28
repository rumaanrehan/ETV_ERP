export interface ExportOrder {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ExportOrderDate: Date | null;
    ReferenceDate: Date | null;
    ReferenceNo: string | null;
    CustomerID: number | null;
    CustomerName: number | null;

    //Exchange Rate Details
    FCCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;

    IncotermID: number | null;
    IsDutyDrawable: boolean | null;
    IsRoDTEP: boolean | null;
    FreightChargeBC: number | null;
    InsuranceAmountBC: number | null;

    ProductList: ExportOrderDetail[];

    SubtotalAmountFC: number | null;
    TaxAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountBC: number | null;
    PaymentTerms: string | null;
    ShipmentModeID: string | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    DestinationName: string | null;
    Narration: string | null;
    StatusID: number | null;
}

export interface ExportOrderRequest {
    ExportOrderNo?: string | null;
    PopulateType?: string | null;
}

export interface ExportOrder_SelectList {
    ExportOrderID: number;
    ExportOrderNo: string;
}

export interface ExportOrderDetail{
    ProductID: number | null;
    ProductName: string | null;
    Quantity: number | null;
    TaxRate: number | null;
    RatePerUnitBC: number | null;
    RatePerUnitFC: number | null;
    TaxAmountBC: number | null;
    TaxAmountFC: number | null;
    TotalAmountBC: number | null;
    TotalAmountFC: number | null;
}

export interface ExportOrder_IndexTableFilter {
    ExportOrderNo: string | null;
    StatusID: number | null;
}

export interface ExportOrder_IndexTableList {
    ExportOrderID: number;
    ExportOrderNo: string;
    ExportOrderDate: Date;
    ReferenceNo: string;
    ReferenceDate: Date;
    CompanyName: string;
    IncotermID: number;
    IsDutyDrawable: boolean;
    IsRoDTEP: boolean;
    SubtotalAmountBC: number;
    TaxAmountBC: number;
    DestinationName: string;
    StatusID: number;
}

//Temp Intefaces

export interface Port_SelectList {
    PortID: number;
    PortName: string;
}