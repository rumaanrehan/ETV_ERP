export interface CountryMaster {
  CountryID: number | null;
  CountryCode: string | null;
  CountryName: string | null;
  CountryISOCode: string | null;
  IsDefault: boolean | null;
}

export interface CountryMaster_SelectList {
  CountryID: number;
  CountryName: string;
  IsDefault: boolean;
}

export interface CountryMaster_IndexTableFilter {
  CountryCode: string | null;
  CountryName: string | null;
  ActiveStatusID: number | null;
}

export interface CountryMaster_IndexTableList {
  RowID: number;
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
  IsDefault: boolean;
  ActiveStatus: boolean;
}