import { StringUtils } from "../../../../core/utility/string-utils";

export interface CompanyMaster {
    CompanyID: number | null;
    CompanyCode: string | null;
    CompanyName: string | null;
    CompanyTypeID: number | null;
    CountryID: number | null;
    StateID: number | null;
    CompanyContactName: string | null;
    CompanyPhoneNo: string | null;
    CompanyEmailID: string | null;
    ImportLicenseNo: string | null;
    GSTNo: string | null;
    TANNo: string | null;
    PANNo: string | null;
    BillingAddress: string | null;
    ShippingAddress: string | null;
}

export interface Company_SelectList {
    CompanyID: number;
    CompanyCode: number | null;
    CompanyName: string;
    CompanyContactName: string | null;
    CompanyEmailID: string | null;
    CompanyPhoneNo: string | null;
    BillingAddress: string | null;
}

export interface Company_IndexTableFilter {
    CompanyCode: string | null;
    CompanyName: string | null;
    CompanyTypeID: number | null;
    ActiveStatusID: number | null;
}

export interface Company_IndexTableList {
    CompanyID: number;
    CompanyCode: string;
    CompanyName: string;
    CompanyTypeName: number;
    CompanyEmailID: string;
    ImportLicenseNo: string;
    AcitveStatus: string;
}

export interface CompanyRequest {
    CompanyID?: number | null;
    CompanyCode?: string | null;
    CompanyName?: string | null;
    CompanyTypeID?: number | null;
    PopulateType?: string | null;
}

export interface Company_Details {
    CompanyID: number | null;
    CompanyCode: string | null;
    CompanyName: string | null;
    CompanyTypeID: number | null;
    CountryID: number | null;
    CompanyPhoneNo: string | null;
    CompanyEmailID: string | null;
    ImportLicenseNo: string | null;
    GSTNo: string | null;
    TANNo: string | null;
    PANNo: string | null;
    BillingAddress: string | null;
}

export interface State_SelectList {
    StateID: number;
    StateName: String;
}

export interface Country_SelectList {
    CountryID: number;
    CountryName: String;
}