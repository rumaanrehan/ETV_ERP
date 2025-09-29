import { TList } from "../../../../shared/models/api-response";
import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface SalesEnquiry {
    SalesEnquiryID: number | null;
    SalesEnquiryNo: string | null;
    EnquiryDate: Date | null;
    CustomerID: number | null;
    CustomerName: string | null;
    ContactName: string | null;
    ContactEmail: string | null;
    ContactPhone: number | null;
    ExpectedDeliveryDate: Date | null;
    Note: string | null;
    ProductList: SalesEnquiryDetail[];

    ProductID: string | null;
    ProductName: string | null;
    Customer?: CompanyMaster;
}

export interface SalesEnquiryDetail {
    ProductID: number | null;
    ProductName: string | null;
    RequestedQty: number | null;
    Remarks: string | null;

    Product?: ProductMaster; // Ye hatega
}

export interface SalesEnquiry_SelectList {
    SalesEnquiryID: number;
    SalesEnquiryNo: string;
    CustomerName: string;
}

export interface SalesEnquiry_IndexTableFilter {
    SalesEnquiryNo: string | null;
    CustomerName: string | null;
    StatusID: number | null;
}

export interface SalesEnquiry_IndexTableList {
    SalesEnquiryID: number;
    SalesEnquiryNo: string;
    CustomerName: string;
    ContactName: string;
    ContactEmail: string;
    EnquiryDate: Date;
    ExpectedDeliveryDate: Date;
    ProductCount: number;
    StatusText: string;
    StatusHex: string;
}

export interface SalesEnquiryRequest {
    SalesEnquiryNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface SalesEnquiry_Detail {
    SalesEnquiryID: number;
    SalesEnquiryNo: string;
    EnquiryDate: Date;
    CustomerID: number;
    CustomerName: string;
    ContactName: string;
    CustomerAddress: string;
    ContactEmail: string;
    ContactPhone: number | null;
    ExpectedDeliveryDate: Date | null;
    Note: string | null;
    StatusText: string;
    StatusHex: string;
    ProductList: TList<SalesEnquiryProduct_Detail>;
}

export interface SalesEnquiryProduct_Detail {
    ProductID: number;
    ProductName: string;
    RequestedQty: number;
    Remarks: string | null;
}