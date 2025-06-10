export interface DepartmentMaster {
  DepartmentID: number | null;
  DepartmentCode: string | null;
  DepartmentName: string | null;
  ShortCode: string | null;
  IsSubDepartment: boolean | null;
  ParentDepartmentID: number | null;
}

export interface DepartmentMaster_SelectList {
  DepartmentID: number;
  DepartmentName: string;
}

export interface DepartmentMaster_IndexTableFilter {
  DepartmentCode: string | null;
  DepartmentName: string | null;
  ParentDepartmentName: string | null;
  ActiveStatusID: number | null;
}

export interface DepartmentMaster_IndexTableList {
  RowID: number;
  DepartmentID: number;
  DepartmentCode: string;
  DepartmentName: string;
  ShortCode: string;
  ParentDepartmentName: string;
  ActiveStatus: boolean;
}
