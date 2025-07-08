 
  export interface EmployeeTypeMaster {
   EmployeeTypeID: number | null;
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
   IsAllowedOvertime: boolean | null;
}

export interface EmployeeType_SelectList {
   EmployeeTypeID: number | null;
   EmployeeTypeName: string | null;
}

export interface EmployeeType_IndexTableList {
   EmployeeTypeID: number | null;
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
    IsAllowedOvertime: boolean | null;
    ActiveStatus: boolean;
}

export interface EmployeeType_IndexTableFilter {
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
    ActiveStatusID: number | null;
}


export interface EmployeeTypeRequest {
   
   EmployeeTypeID?: number | null;
    PopulateType?: string | null;
}