export interface CurrencyMaster {
    CurrencyID: number | null;
    CurrencyCode: string | null;
    CountryID: number | null;
    CurrencyName: string | null;
    CurrencySymbol: string | null;
    CurrencyISOCode: string | null;
}

export interface Currency_SelectList {
    CurrencyID: number;
    CurrencyName: string;
}

export interface Currency_IndexTableFilter {
    CurrencyCode: string | null;
    CountryName: string | null;
    CurrencyName: string | null;
    CurrencySymbol: string | null;
    ActiveStatusID: number | null;
}

export interface Currency_IndexTableList {
    CurrencyID: number;
    CurrencyCode: string;
    CurrencyName: string;
    CurrencyISOCode: string | null;
    CountryName: string;
    ActiveStatus: boolean;
}

export interface CurrencyRequest {
    CountryID?: number;
    CurrencyName?: number;
    PopulateType?: string;
}

export interface Currency_Detail {
    CurrencyID: number;
    CurrencyCode: string;
    CountryID: number;
    CurrencyName: string;
    CurrencySymbol: string;
    CurrencyISOCode: string | null;
}