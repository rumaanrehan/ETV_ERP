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

export interface RoleMaster_IndexTableList {
  RoleID: number;
  RoleCode: string;
  RoleName: string;
  ActiveStatus: boolean;
}