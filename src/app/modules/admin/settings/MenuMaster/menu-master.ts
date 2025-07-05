export interface MenuMaster {
  MenuID: number | null;
  ModuleID: number | null;
  MenuType: number | null;
  MenuName: string | null;
  GroupMenuID: number | null;
  ParentMenuID: number | null;
  ControllerName: string | null;
  ActionName: string | null;
  DisplayOrder: string | null;
  IsDeveloperOnly: boolean;
}
export interface MenuMaster_SelectList {
  ModuleName: string | null;
  MenuTypeName: string | null;
  ParentMenuName: string | null;
  MenuName: string | null;
  ControllerName: string | null;
  ActionName: string | null;
  ActiveStatus: boolean;
}

export interface MenuMaster_IndexTableFilter {
  ModuleName: string | null;
  MenuTypeName: string | null;
  ParentMenuName: string | null;
  MenuName: string | null;
  ControllerName: string | null;
  ActiveStatusID: number | null;
}

export interface MenuMaster_IndexTableList {
  RowID: number;
  MenuID: number | null;
  ModuleName: string | null;
  MenuTypeName: string | null;
  ParentMenuName: string | null;
  MenuName: string | null;
  ControllerName: string | null;
  ActionName: string | null;
  DisplayOrder: string | null;
  IsDeveloperOnly: any | null;
  ActiveStatus: boolean;
}
