export interface StateMaster {
    StateID: number | null;
    StateCode: string | null;
    StateName: string | null;
    CountryID: number | null;
    StateGSTCode: string | null;
    StateISOCode: string | null;
}

export interface State_SelectList {
    StateID: number;
    StateName: string;
}

export interface State_IndexTableFilter {
    StateCode: string | null;
    StateName: string | null;
    CountryName: string | null;
    ActiveStatusID: number | null;
}

export interface State_IndexTableList {
    StateID: number;
    StateCode: string;
    StateName: string;
    StateGSTCode: string | null;
    StateISOCode: string | null;
    CountryName: string;
    ActiveStatus: boolean;
}

export interface StateRequest {
    CountryID?: number | null;
    StateName?: string | null;
    PopulateType?: string | null;
}