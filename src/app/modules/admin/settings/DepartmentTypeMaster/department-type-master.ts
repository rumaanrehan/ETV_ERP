export interface DepartmentTypeMaster {
  DepartmentTypeID: number | null;
  DepartmentTypeCode: string | null;
  DepartmentTypeName: string | null;
}

export interface DepartmentTypeMasterList {
  RowID: number;
  DepartmentTypeID: number;
  DepartmentTypeCode: string;
  DepartmentTypeName: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}
