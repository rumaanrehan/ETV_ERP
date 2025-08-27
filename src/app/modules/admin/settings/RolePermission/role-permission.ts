export interface RoleMaster_RolePermission {
  RoleID: number | null;
  ModuleID: number | null;
  RoleMapping: RoleMaster_RolePermissionList[];
}

export interface RoleMaster_RolePermissionList {
  MenuID: number | null;
  GroupMenuName: string | null;
  MenuName: string | null;
  AccessControlName: string | null;
  CanRead: boolean;
  CanCreate: boolean;
  CanUpdate: boolean;
  CanDelete: boolean;
}
