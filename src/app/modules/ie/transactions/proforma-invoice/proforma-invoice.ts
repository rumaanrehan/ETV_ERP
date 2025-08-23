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
    InsuranceAmountFC: number | null;
    InsuranceAmountBC: number | null;
    BankChargesFC: number | null;
    BankChargesBC: number | null;
    NetAmountFC: number | null;
    NetAmountBC: number | null;
    Narration: number | null;

    ProductList: ProformaInvoiceDetail[];

    Customer?: CompanyMaster;

    ProductID: number | null;
    ProductName: string | null;
}

export interface ProformaInvoiceDetail {
    ProductID: number | null;
    ProductName: string | null;
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