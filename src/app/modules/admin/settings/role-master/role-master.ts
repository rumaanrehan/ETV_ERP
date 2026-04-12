export interface RoleMaster {
  RoleID: number | null;
  RoleCode: string | null;
  RoleName: string | null;
}

export interface RoleMaster_SelectList {
  RoleID: number | null;
  RoleName: string | null;
}

export interface RoleMaster_IndexTableFilter {
  RoleCode: string | null;
  RoleName: string | null;
  ActiveStatusID: number | null;
}

export interface RoleMaster_IndexTableSort {
  RoleCode: number;
  RoleName: number;
}

export interface RoleMaster_IndexTableList {
  RoleID: number;
  RoleCode: string;
  RoleName: string;
  ActiveStatus: boolean;
}

export interface RoleRequest {
  RoleID: number | null;
  RoleCode: string | null;
  RoleName: string | null;
}

export interface RoleMaster_Details {
  RoleID: number | null;
  RoleCode: string | null;
  RoleName: string | null;
  ActiveStatus: boolean | null;
  CreatedBy: number | null;
  CreatedDateTime: string | null;
  ModifiedBy: number | null;
  ModifiedDateTime: string | null;
}
