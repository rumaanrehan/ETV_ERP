import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface TaxInvoice {
    TaxInvoiceID: number | null;
    TaxInvoiceNo: string | null;
    TaxInvoiceDate: Date | null;
    BasedOn: number | null;
    DocumentID: number | null;
    DocumentNo: string | null;
    ReferenceDate: Date | null;
    ReferenceNo: string | null;
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
    FreightChargeBC: number | null;
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;
    BankChargesFC: number | null;
    BankChargesBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    PaymentTermID: number | null;
    ShipmentModeID: number | null;
    LoadingPortID: number | null;
    DischargePortID: number | null;
    LoadingPortName: string | null;
    DischargePortName: string | null;
    FinalDestination: string | null;
    Narration: number | null;
    // StatusID: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;

    ProductList: TaxInvoiceDetail[];

    Customer?: CompanyMaster;
}

export interface TaxInvoiceDetail {
    ProductID: number | null;
    ProductName: string | null;
    UOM: string | null;
    HSCode: string | null;
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
    BasedOn: number | null;
    DocumentNo: string | null;
    CustomerName: string | null;
    Status: number | null;
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
    StatusText: string;
    StatusHex: string;
    CurrencySymbol: string;
}

export interface TaxInvoiceRequest {
    SearchBy: number | null;
    SearchValue: string | null;
    PopulateType: string | null;
}

export interface Document_SelectList {
    DocumentID: number;
    DocumentNo: string;
    CustomerName: string
}

export interface TaxInvoice_Detail {
    TaxInvoiceID: number;
    TaxInvoiceNo: string;
    BasedOn: number;
    TaxInvoiceDate: Date;
    ProformaInvoiceID?: number;
    ProformaInvoiceNo?: string;
    ExportOrderID?: number;
    ExportOrderNo?: string;
    ReferenceNo: string;
    ReferenceDate: string;
    CustomerID: number;
    CustomerName: string;
    CustomerAddress?: string;
    FCCurrencyID: number;
    ExchangeRateDate: Date;
    ExchangeRateToBC: number;
    InsuranceAmountFC?: number;
    FreightChargeFC?: number;
    BankChargesFC?: number;
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
    ProductList: TList<TaxInvoiceProductDetail>;
}

export interface TaxInvoiceProductDetail {
    ProductID: number;
    ProductName: string;
    SalesQty: number;
    UOM: string;
    RatePerUnitFC: number;
    TaxRate: number;
    TaxableAmountFC: number;
    TaxAmountFC: number;
    SalesAmountFC: number;
}