export interface DesignationMaster {
    DesignationID: number | null;
    DesignationCode: string | null;
    DesignationName: string | null;
}

export interface DesignationRequest {
    DesignationName?: number | null;
    PopulateType?: string | null;
}

export interface Designation_SelectList {
    DesignationID: number;
    DesignationName: string;
}

export interface Designation_IndexTableFilter {
    DesignationCode: string | null;
    DesignationName: string | null;
    ActiveStatusID: number | null;
}

export interface Designation_IndexTableList {
    DesignationID: number;
    DesignationCode: string;
    DesignationName: string;
    ActiveStatus: boolean;
}
export interface DesignationDetails{
    DesignationID: number;
    DesignationName: string;
    
}