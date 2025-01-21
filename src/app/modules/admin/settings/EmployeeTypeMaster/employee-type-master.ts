export interface EmployeeTypeMaster {
  EmployeeTypeID: number | null;
  EmployeeTypeCode: string | null;
  EmployeeTypeName: string | null;
  IsAllowedOverTimePay: boolean | null;
}

export interface EmployeeTypeMasterList {
  RowID: number;
  EmployeeTypeID: number;
  EmployeeTypeCode: string;
  EmployeeTypeName: string;
  IsAllowedOverTimePay: boolean;
  ActionType: string | null;
  ActiveStatus: any;
}
