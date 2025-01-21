export interface DepartmentMaster {
  DepartmentID: number | null;
  DepartmentCode: string | null;
  DepartmentName: string | null;
  IsSubDepartment: boolean | null;
  ShortCode: string | null;
  DepartmentTypeID: number | null;
  ParentDepartmentID: number | null;
  IsAllowedForOP: boolean | null;
  IsAllowedForIP: boolean | null;
  DepartmentLocation: string | null;
  NMC_DepartmentCode: string | null;
}

export interface DepartmentMasterList {
  RowID: number;
  DepartmentID: number;
  DepartmentCode: string;
  DepartmentName: string;
  IsSubDepartment: boolean;
  ShortCode: string;
  DepartmentTypeName: string;
  ParentDepartmentName: string;
  IsAllowedForOP: boolean;
  IsAllowedForIP: boolean;
  DepartmentLocation: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}
