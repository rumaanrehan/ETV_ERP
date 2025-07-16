export interface DepartmentMaster {
    DepartmentID: number | null;
    DepartmentCode: string | null;
    DepartmentTypeID: number | null;
    DepartmentName: string | null;
    ShortCode: string | null;    
}

export interface Department_SelectList {
    DepartmentID: number;
    DepartmentName: string;
}

export interface Department_IndexTableFilter {
    DepartmentCode: string | null;
    DepartmentType: number | null;
    DepartmentName: string | null;
    ActiveStatusID: number | null;
}

export interface Department_IndexTableList {
    DepartmentID: number;
    DepartmentCode: string;
    DepartmentName: string;
    ShortCode: string | null;    
    DepartmentType: number | null;
    ActiveStatus: boolean;
}

export interface DepartmentRequest {
    DepartmentTypeID?: number | null;
    DepartmentName?: number | null;
    PopulateType?: string | null;
}