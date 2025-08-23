import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface ExportOrder {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ExportOrderDate: Date | null;
    ReferenceDate: Date | null;
    ReferenceNo: string | null;
    CustomerID: number | null;
    CustomerName: string | null;

    //Exchange Rate Details
    FCCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;

    IncotermID: number | null;
    IsDutyDrawable: boolean | null;
    IsRoDTEP: boolean | null;
    BankChargesFC: number | null;
    BankChargesBC: number | null;
    FreightChargeFC: number | null;
    FreightChargeBC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;

    ProductList: ExportOrderDetail[];

    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    PaymentTermID: number | null;
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

export interface ExportOrderRequest {
    ExportOrderNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface ExportOrder_SelectList {
    ExportOrderID: number;
    ExportOrderNo: string;
    CustomerName: string;
}

export interface ExportOrderDetail {
    ProductID: number | null;
    ProductName: string | null;
    SalesQty: number | null;
    SalesTaxRate: number | null;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    SalesAmountFC: number | null;
    SalesAmountBC: number | null;

    //Foreign Keys
    Product?: ProductMaster;
}

export interface ExportOrder_IndexTableFilter {
    ExportOrderNo: string | null;
    ReferenceNo: string | null;
    CustomerName: string | null;
    IncotermID: number | null;
    DutyDrawableID: number | null;
    RoDTEPID: number | null;
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    StatusID: number | null;
}

export interface ExportOrder_IndexTableList {
    ExportOrderID: number;
    ExportOrderNo: string;
    ExportOrderDate: string;
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

export interface ExportOrderDocumentList {
    ExportOrderDocumentID: number;
    ExportOrderID: number;
    ExportOrderNo: string;
    DocumentTypeName: string;
    DocumentPath: string;
    IsVerfied: boolean;
    UploadedBy: string;
    UploadedDateTime: Date;
}

export interface ExportOrderPaymentList {
    ExportOrderPaymentID: number;
    ExportOrderNo: string;
    ExportOrderPaymentNo: string;
    PaymentRefNo: string;
    PaymentAmountBC: number;
    PaymentDate: Date;
    CreatedBy: string;
}
