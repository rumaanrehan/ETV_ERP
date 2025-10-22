export interface EmployeeTypeMaster {
    EmployeeTypeID: number | null;
    EmployeeTypeCode: string | null;
    EmployeeTypeName: string | null;
    IsAllowedOverTime: string | null;    
}

export interface EmployeeType_SelectList {
    EmployeeTypeID: number;
    EmployeeTypeName: string;
}

export interface EmployeeType_IndexTableFilter {
    EmployeeTypeCode: string | null;
    EmployeeTypeName: string | null;
    IsAllowedOverTime: string | null;
    ActiveStatusID: number | null;
}

export interface EmployeeType_IndexTableList {
    EmployeeTypeID: number;
    EmployeeTypeCode: string;
    EmployeeTypeName: string;
    IsAllowedOverTime: string | null;
    ActiveStatus: boolean;
}

export interface EmployeeTypeRequest {
    EmployeeTypeID?: number | null;
    PopulateType?: string | null;
}

export interface EmployeeTypeDetails {
    EmployeeTypeID?: number | null;
    EmployeeTypeCode: string | null;
    EmployeeTypeName: string;
    IsAllowedOverTime: string | null;

}