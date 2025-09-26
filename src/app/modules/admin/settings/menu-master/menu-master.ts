export interface MenuMaster {
  MenuID: number | null;
  ModuleID: number | null;
  MenuType: number | null;
  MenuName: string | null;
  ParentMenuID: number | null;
  ControllerName: string | null;
  ActionName: string | null;
  DisplayOrder: number | null;
  IsDeveloperOnly: boolean;
}

export interface MenuMaster_SelectList {
  MenuID: number | null;
  MenuName: string | null;
}

export interface MenuMaster_IndexTableFilter {
  ModuleName: string | null;
  MenuType: number | null;
  MenuTypeName: string | null;
  MenuName: string | null;
  ParentMenuName: string | null;
  ControllerName: string | null;
  ActiveStatusID: number | null;
}

export interface MenuMaster_IndexTableList {
  RowID: number;
  MenuID: number | null;
  MenuName: string | null;
  MenuTypeName: string | null;
  ParentMenuName: string | null;
  ControllerName: string | null;
  ActionName: string | null;
  ModuleName: string | null;
  DisplayOrder: string | null;
  IsDeveloperOnly: boolean;
  ActiveStatus: boolean;
}

export interface MenuMasterRequest {
  ModuleID?: number | null;
  MenuType?: number | null;
  GroupMenuID?: number | null;
  ParentMenuID?: number | null;
  PopulateType: any;
}
