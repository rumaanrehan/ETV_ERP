export interface StateMaster {
  StateID: number | null;
  StateCode: string | null;
  CountryID: number | null;
  StateName: string | null;
  StateISOCode: string | null;
  StateGSTCode: string | null;
  IsDefault: boolean | null;
}

export interface StateMaster_SelectList {
  StateID: number;
  StateName: string;
}

export interface StateMaster_IndexTableFilter {
  StateCode: string;
  StateName: string;
  CountryName: string;
  ActiveStatusID: number;
}

export interface StateMaster_IndexTableList {
  RowID: number;
  StateID: number;
  StateCode: string;
  StateName: string;
  StateGSTCode: string;
  StateISOCode: string;
  CountryName: string;
  IsDefault: string;
  ActiveStatus: boolean;
}
