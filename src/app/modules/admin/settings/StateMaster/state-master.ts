export interface StateMaster {
    StateID: number | null;
    StateCode: string | null;
    StateName: string | null;
    CountryID: number | null;
    StateGSTCode: string | null;
    StateISOCode: string | null;
}

export interface State_SelectList {
    StateID: number | null;
    StateName: string | null;
}

export interface State_IndexTableList {
    StateID: number | null;
    StateCode: string | null;
    StateName: string | null;
    CountryName: string | null;
    StateGSTCode: string | null;
    StateISOCode: string | null;
    ActiveStatus: boolean;
}

export interface State_IndexTableFilter {
    StateCode: string | null;
    StateName: string | null;
    CountryID: number | null;
    ActiveStatusID: number | null;
}


export interface StateRequest {
    CountryID?: number | null;
    StateID?: number | null;
    PopulateType?: string | null;
}