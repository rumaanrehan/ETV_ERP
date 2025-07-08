export interface DepartmentMaster {
    DepartmentID: number | null;
    DepartmentCode: string | null;
    DepartmentTypeID: number | null;
    DepartmentName: string | null;
    ShortCode: string | null;
   
}

export interface Department_SelectList {
    DepartmentID: number | null;
    DepartmentName: string | null;
}

export interface Department_IndexTableList {
    DepartmentID: number | null;
    DepartmentCode: string | null;
    DepartmentName: string | null;
    DepartmentType: string | null;
    ShortCode: string | null;
   
}

export interface Department_IndexTableFilter {
    DepartmentCode: string | null;
    DepartmentName: string | null;
    DepartmentTypeID: number | null;
    ShortCode: string | null;
    ActiveStatusID: number | null;
}


export interface DepartmentRequest {
    DepartmentID?: number | null;
    PopulateType?: string | null;
}