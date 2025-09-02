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

export interface MenuTypeItem {
  value: number;
  label: string;
}

export interface MenuMaster_IndexTableFilter {
  ModuleName: string | null;
  MenuType: number | null;
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

export interface MenuMasterRequest {
  MenuID: number | null;
  ModuleID: number | null;
  MenuType: number | null;
  GroupMenuID: number | null;
  ParentMenuID: number | null;
  MenuName: string | null;
  ControllerName: string | null;
  PopulateType: any;
}
