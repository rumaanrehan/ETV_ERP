export interface StateMaster {
  StateID: number | null;
  StateCode: string | null;
  StateName: string | null;
  StateGSTCode: string | null;
  StateISOCode: string | null;
  CountryID: number | null;
  IsDefault: boolean | null;
}

export interface StateMasterList {
  RowID: number;
  StateID: number;
  StateCode: string;
  StateName: string;
  StateGSTCode: string;
  StateISOCode: string;
  CountryName: string;
  IsDefault: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}
