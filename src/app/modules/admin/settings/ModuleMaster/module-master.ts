export interface ModuleMaster {
  ModuleID: number | null;
  ModuleCode: string | null;
  ModuleName: string | null;
  ImagePath: string | null;
  DisplayOrder: number | null;
}
export interface ModuleMasterList {
  RowID: number;
  ModuleID: number;
  ModuleCode: string;
  ModuleName: string;
  ImagePath: string;
  DisplayOrder: number;
  ActiveStatus: boolean;
}
