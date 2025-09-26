import { ProductMaster } from "../../../ims/settings/product-master/product-master";
import { CompanyMaster } from "../../settings/company-master/company-master";

export interface SalesEnquiry {
    EnquiryID: number | null;
    EnquiryNo: string | null;
    EnquiryDate: Date | null;
    CustomerID: number | null;
    CustomerName: string | null;
    ContactPersonName: string | null;
    Email: string | null;
    Phone: number | null;
    Note: string | null;
    ExpectedDeliveryDate: Date | null;
    ProductID: string | null;
    ProductName: string | null;
    StatusID: number | null;

    ProductList: SalesEnquiryDetail[];  

    Customer?: CompanyMaster
}
export interface SalesEnquiryDetail {
    ProductID: number | null;
    ProductName: string | null;
    RequestedQty: number | null;
    Remark: string | null;

    Product?: ProductMaster;
}

export interface SalesEnquiryRequest {
    EnquiryNo?: string | null;
    CustomerName?: string | null;
    PopulateType?: string | null;
}

export interface SalesEnquiry_SelectList {
    EnquiryID: number;
    EnquiryNo: string;
    CustomerName: string;
    Remark: string | null;
}


export interface SalesEnquiry_IndexTableFilter {
    EnquiryNo: string | null;
    CustomerName: string | null;
    StatusID: number | null;
}

export interface SalesEnquiry_IndexTableList {
    CustomerName: string;
    EnquiryID: number;
    EnquiryNo: string;
    ContactPersonName: string;
    Email: string;
    ExpectedDeliveryDate: Date | null;
    StatusID: number;
}


