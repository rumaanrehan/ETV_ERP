export class CountryMaster {
  CountryID: number | null = null;
  BillCompanyCountryID: number | null = null;
  CountryCode: string | null = null;
  CountryName: string | null = null;
  CountryISOCode: string | null = null;
  IsDefault: boolean | null = null;
  ReasonToUpdate: string | null = null;
  ActionType: string | null = null;
}

export interface CountryMasterList {
  RowID: number;
  BillCompanyCountryID: number;
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
  IsDefault: boolean;
  ActiveStatus: any;
  ReasonToUpdate: string | null;
  ActionType: string | null;
}
