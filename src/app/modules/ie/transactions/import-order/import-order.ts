import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface ImportOrder {
    ImportOrderID: number | null;
    ImportOrderNo: string | null;
    ImportOrderDate: Date | null;
    BasedOn: number | null;
    PurchaseQuotationID: number | null;
    VendorID: number | null;
    ForeignCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    IncotermID: number | null;
    PaymentTermID: number | null;
    FreightAmountFC: number | null;
    FreightAmountBC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;
    
    ProductList: ImportOrderDetail[];
    
    CustomDutyFC: number | null;
    CustomDutyBC: number | null;
    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    // PaidAmountFC: number | null;
    // PaidAmountBC: number | null;
    // BalanceAmountFC: number | null;
    // BalanceAmountBC: number | null;
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    LoadingPortName: string | null;
    DischargePortName: string | null;
    FinalDestination: string | null;
    Narration: string | null;
    // BillOfEntryNo: string | null;
    // BillOfEntryDate: Date | null;
    // AirwayBillNo: string | null;
    // AirwayBillDate: Date | null;
    StatusID: number | null;

    ProductID: number | null;
    ProductName: string | null;

    Customer?: CompanyMaster
}

export interface ImportOrderDetail {
    ProductID: number | null;
    ProductName: string | null;
    PurchaseQty: number | null;
    UOM: string | null;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;
    PurchaseTaxRate: number | null;    
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    TotalAmountFC: number | null;
    TotalAmountBC: number | null;
    IsDeleted: boolean | null;

    //Foreign Keys
    Product?: ProductMaster;
}

export interface ImportOrderRequest {
    ImportOrderNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface ImportOrder_SelectList {
    ImportOrderID: number;
    ImportOrderNo: string;
    CustomerName: string;
}

export interface ImportOrder_Detail {
    ImportOrderID: number | null;
    ImportOrderNo: string | null;
    ImportOrderDate: Date | null;
    BasedOn: number | null;
    PurchaseQuotationID: number | null;
    PurchaseQuotationNo: string | null;
    VendorID: number | null;
    VendorName: string;
    VendorAddress?: string;
    ForeignCurrencyID: number | null;
    ExchangeRateDate: Date | null;
    ExchangeRateToBC: number | null;
    IncotermID: number | null;
    PaymentTermID: number | null;
    FreightAmountFC: number | null;
    FreightAmountBC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;    
    CustomDutyFC: number | null;
    CustomDutyBC: number | null;
    SubtotalAmountFC: number | null;
    SubtotalAmountBC: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    PaidAmountFC: number | null;
    PaidAmountBC: number | null;
    BalanceAmountFC: number | null;
    BalanceAmountBC: number | null;
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    FinalDestination: string | null;
    Narration: string | null;
    BillOfEntryNo: string | null;
    BillOfEntryDate: Date | null;
    AirwayBillNo: string | null;
    AirwayBillDate: Date | null;
    StatusText: string;
    StatusHex: string;
    ProductList: TList<ImportOrderProductDetail>;
}

export interface ImportOrderProductDetail {
    ProductID: number;
    ProductName: string;
    PurchaseQty: number;
    UOM: string;
    RatePerUnitFC: number | null;
    RatePerUnitBC: number | null;
    PurchaseTaxRate: number | null;  
    TaxableAmountFC: number | null;
    TaxableAmountBC: number | null;  
    TaxAmountFC: number | null;
    TaxAmountBC: number | null;
    PurchaseAmountFC: number | null;
    PurchaseAmountBC: number | null;
}

export interface ImportOrder_IndexTableSort {
    ImportOrderNo: SortDirection;
    ImportOrderDate: SortDirection;
    NetAmountBC: SortDirection;
    StatusID: SortDirection;
}

export interface ImportOrder_IndexTableFilter {
    ImportOrderNo: string | null;
    CustomerName: string | null;
    StatusID: number | null;
}

export interface ImportOrder_IndexTableList {
    ImportOrderID: number;
    ImportOrderNo: string;
    ImportOrderDate: string;
    VendorName: string;
    ShipmentMode: string;
    LoadingPortName: string;
    FinalDestination: string;
    NetAmountBC: number;
    StatusText: string;
    StatusHex: string;
    StatusID: number;
    CurrencySymbol: string;
}

export enum SortDirection {
    Desc = -1,
    None = 0,
    Asc = 1
}
