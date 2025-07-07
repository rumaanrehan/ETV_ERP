export interface CountryMaster {
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
}

export interface Country_IndexTableFilter {
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
  ActiveStatusID: number;
}

export interface Country_IndexTableList {
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
  ActiveStatus: boolean;
}

export interface Country_SelectList {
  CountryID: number;
  CountryName: string;
}

export interface CountryRequest {
  CountryID?: number | null;
  CountryName?: string | null;
  PopulateType?: string | null;
}