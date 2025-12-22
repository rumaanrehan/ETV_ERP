import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface ProformaInvoice {
    ProformaInvoiceID: number | null;
    ProformaInvoiceNo: string | null;
    ProformaInvoiceDate: Date | null;
    BasedOn: number | null;
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
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
    Narration: number | null;
    StatusID: number | null;
    IsRoundOff: boolean | null;
    CoinAdjustment: number | null;

    ProductList: ProformaInvoiceDetail[];

    Customer?: CompanyMaster;

    ProductID: number | null;
    ProductName: string | null;
}

export interface ProformaInvoiceDetail {
    ProductID: number | null;
    ProductName: string | null;
    SalesQty: number | null;
    UOM: string | null;
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

export interface ProformaInvoice_SelectList {
    ProformaInvoiceID: number;
    ProformaInvoiceNo: string;
    CustomerName: string;
}

export interface ProformaInvoice_IndexTableFilter {
    ProformaInvoiceNo: string | null;
    BasedOn: number | null;
    ExportOrderNo: string | null;
    CustomerName: string | null;
    Status: number | null;
}

export interface ProformaInvoice_IndexTableList {
    ProformaInvoiceID: number;
    ProformaInvoiceNo: string;
    ProformaInvoiceDate: Date;
    BasedOn: string;
    ExportOrderNo: string;
    CustomerName: string;
    SubtotalAmountFC: number;
    TaxAmountFC: number;
    NetAmountFC: number;
    StatusText: string;
    StatusHex: string;
    CurrencySymbol: string;
}

export interface ProformaInvoiceRequest {
    // ProformaInvoiceNo?: string | null;
    SearchBy: number | null;
    SearchValue: string | null;
    PopulateType: string | null;
}

export interface ProformaInvoice_Detail {
  ProformaInvoiceID: number;
  ProformaInvoiceNo: string;
  BasedOn: number;
  ProformaInvoiceDate: Date;
  ExportOrderID?: number;
  ExportOrderNo?: string;
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
  SubtotalAmountFC: number;
  TaxAmountFC: number | null;
  NetAmountFC: number;
  StatusText: string;
  StatusHex: string;
  IsTaxAlreadyExists: boolean;
  ProductList: TList<ProformaInvoiceProductDetail>;
}

export interface ProformaInvoiceProductDetail {
  ProductID: number;
  ProductName: string;
  UOM: string;
  SalesQty: number;
  RatePerUnitFC: number;
  SalesTaxRate: number;
  TaxableAmountFC: number;
  TaxAmountFC: number;
  SalesAmountFC: number;
}