export interface RoleMaster {
  RoleID: number | null;
  RoleCode: string | null;
  RoleName: string | null;
}
export interface RoleMasterList {
  RowID: number;
  RoleID: number;
  RoleCode: string;
  RoleName: string;
  ActiveStatus: boolean;
}
