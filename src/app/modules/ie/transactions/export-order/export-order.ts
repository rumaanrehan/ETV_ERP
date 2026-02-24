import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface ExportOrder {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ExportOrderDate: Date | null;
    BasedOn: number | null;
    SalesQuotationID: number | null;
    SalesQuotationNo: string | null;
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
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    LoadingPortName: string | null;
    DischargePortName: string | null;
    FinalDestination: string | null;
    Narration: string | null;
    StatusID: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;
    Customer?: CompanyMaster
}

export interface ExportOrdersDetail {
    ExportOrderID: number;
    ExportOrderNo: string;
    ExportOrderDate: Date;
    BasedOn: number;
    SalesQuotationID: number | null;
    SalesQuotationNo: string | null;
    ReferenceDate: Date | null;
    ReferenceNo: string | null;
    CustomerID: number;
    CustomerName: string;
    FCCurrencyID: number;
    ExchangeRateDate: Date;
    ExchangeRateToBC: number;
    IncotermID: number;
    IsDutyDrawable: boolean;
    IsRoDTEP: boolean;
    BankChargesFC: number | null;
    BankChargesBC: number | null;
    FreightChargeFC: number | null;
    FreightChargeBC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;
    SubtotalAmountFC: number;
    SubtotalAmountBC: number;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    NetAmountFC: number;
    NetAmountBC: number;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;
    PaymentTermID: number;
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    FinalDestination: string;
    Narration: string | null;
    StatusText: number;
    ProductList: TList<ExportOrderProduct_Detail>;
}

export interface ExportOrderProduct_Detail {
    ProductID: number;
    ProductName: string;
    SalesQty: number;
    RatePerUnitFC: number;
    RatePerUnitBC: number;
    SalesTaxRate: number | null;
    TaxableAmountFC: number;
    TaxableAmountBC: number;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    SalesAmountFC: number;
    SalesAmountBC: number;
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
    UOM: string | null;
    HSCode: string | null;
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
    BasedOn: number | null;
    IncotermID: number | null;
    DutyDrawableID: number | null;
    RoDTEPID: number | null;
    ShipmentModeID: number | null;
    FinalDestination: string | null;
    StatusID: number | null;
}

export interface ExportOrder_IndexTableSort {
    ExportOrderNo: 1 | 0 | -1;
    ExportOrderDate: 1 | 0 | -1;
    NetAmountBC: 1 | 0 | -1;
    StatusID: 1 | 0 | -1;
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
    NetAmountFC: number;
    IsKnockOff: boolean;
    StatusID: number;
    StatusText: string;
    ExportOrderPackingListID: number | null;
    CurrencySymbol: string;

    /** UI only */
    _selected?: boolean;
}

export interface ExportOrderBulkUpdateRequest {
    ExportOrderIDs: number[];
    StatusID: number;
}

export interface ExportOrderCancelRequest {
    ExportOrderID: number;
    ReasonToCancel: number;
}

export interface ExportOrder_Detail {
    ExportOrderID: number;
    ExportOrderNo: string;
    BasedOn: number;
    ExportOrderDate?: Date;
    ReferenceDate: Date;
    ReferenceNo?: string;
    SalesQuotationID?: number;
    SalesQuotationNo?: string;
    CustomerID: number;
    CustomerName: string;
    CustomerAddress?: string;
    FCCurrencyID: number;
    ExchangeRateDate: Date;
    ExchangeRateToBC: number;
    IncotermID?: number;
    FreightChargeFC?: number;
    BankChargesFC?: number;
    InsuranceAmountFC?: number;
    IsDutyDrawable: boolean;
    IsRoDTEP: boolean;
    PaymentTermID?: number;
    IsRoundOff: boolean;
    ShipmentModeID?: number;
    LoadingPortID?: number;
    DischargePortID?: number;
    LoadingPortName: string;
    DischargePortName: string;
    FinalDestination?: string;
    Narration?: string;
    SubtotalAmountFC: number;
    TaxAmountFC: number | null;
    NetAmountFC: number;
    StatusText: string;
    StatusHex: string;
    IsDocumentAlreadyExists: boolean;
    ProductList: TList<ExportOrderProductDetail>;
}

export interface ExportOrderProductDetail {
    ProductID: number;
    ProductName: string;
    UOM: string;
    HSCode: string | null;
    SalesQty: number;
    RatePerUnitFC: number;
    SalesTaxRate: number;
    TaxableAmountFC: number;
    TaxAmountFC: number;
    SalesAmountFC: number;
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

export interface ExportOrderBillRegulation {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ShippingBill: boolean | null;
    AirwayBill: boolean | null;
    IECCertificate: boolean | null;
    Invoice: boolean | null;
    PackingSlip: boolean | null;
    CustomerPO: boolean | null;
}

export interface ExportOrderBillRegulationRequest {
    ExportOrderID: number | null;
    SelectedDocuments: ExportOrderDocumentType[];
}

export enum ExportOrderDocumentType {
    ShippingBill = 1,
    AirwayBill = 2,
    IECCertificate = 3,
    Invoice = 4,
    PackingSlip = 5,
    CustomerPO = 6
}

//#region Packing List
// ExportOrderPackingList model
export interface ExportOrderPackingList {
    ExportOrderPackingListID: number | null;
    ExportOrderPackingListNo: string | null;
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    CustomerName: string | null;
    NoOfBox: number | null;
    PackingIdentityID: number | null;
    BoxList: ExportOrderPackingListBox[];
}

// ExportOrderPackingListBox model
export interface ExportOrderPackingListBox {
    ExportOrderPackingListBoxID: number | null;
    ExportOrderPackingListBoxNo: string | null;
    NoOfProduct: number | null;
    BoxLength: number | null;
    BoxWidth: number | null;
    BoxHeight: number | null;
    BoxWeight: number | null;
    BoxGrossWeight: number | null;
    PackedBy: string | null;
    PackedDateTime: Date | null;
    InspectedBy: string | null;
    InspectedDateTime: Date | null;
    ProductList: ExportOrderPackingListBoxDetail[];
}

// ExportOrderPackingListBoxDetail model
export interface ExportOrderPackingListBoxDetail {
    ProductID: number | null;
    ProductCode?: string | null;
    ProductName: string | null;
    PackedQty: number | null;
    WeightPerUnit: number | null;
}

export interface ProductList {
  ProductID: number;
  ProductCode?: string;
  ProductName: string;
  ProuductCount: number;
}

export interface ExportOrderPackingList_Detail {
    ExportOrderID: number;
    ExportOrderNo: string;
    CustomerName: string;
    ProductList: TList<ExportOrderProductList_Detail>;
}

export interface ExportOrderProductList_Detail {
    ProductID: number;
    ProductCode: string;
    ProductName: string;
    SalesQty: number;
}

export interface OpenPackingDialogParams {
  isEditMode: boolean;
  productList?: ExportOrderPackingList_Detail | null;
  packingList?: ExportOrderPackingList | null;
}
//#endregion 