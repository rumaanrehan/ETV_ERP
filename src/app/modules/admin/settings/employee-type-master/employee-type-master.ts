export interface EmployeeTypeMaster {
    EmployeeTypeID: number | null;
    EmployeeTypeCode: string | null;
    EmployeeTypeName: string | null;
    IsAllowedOverTime: boolean | null;    
}

export interface EmployeeType_SelectList {
    EmployeeTypeID: number;
    EmployeeTypeName: string;
}

export interface EmployeeType_IndexTableFilter {
    EmployeeTypeCode: string;
    EmployeeTypeName: string;
    ActiveStatusID: number;
}

export interface EmployeeType_IndexTableList {
    EmployeeTypeID: number;
    EmployeeTypeCode: string;
    EmployeeTypeName: string;
    IsAllowedOverTime: boolean | null;
    ActiveStatus: boolean;
}

export interface EmployeeTypeRequest {
    EmployeeTypeID?: number | null;
    PopulateType?: string | null;
}

export interface EmployeeType_Details {
    EmployeeTypeID: number | null;
    EmployeeTypeCode: string | null;
    EmployeeTypeName: string;
    IsAllowedOverTime: boolean | null;
}