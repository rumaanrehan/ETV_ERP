export interface ModuleMaster {
  ModuleID: number | null;
  ModuleCode: string | null;
  ModuleName: string | null;
  ImagePath: string | null;
  DisplayOrder: number | null;
}

export interface ModuleMaster_SelectList {
  ModuleID: number | null;
  ModuleName: string | null;
  ModuleCode: string | null;
}

export interface ModuleMaster_IndexTableFilter {
  ModuleCode: string | null;
  ModuleName: string | null;
  DisplayOrder: number | null;
  ActiveStatusID: number | null;
}

export interface ModuleMaster_IndexTableSort {
  ModuleCode: 1 | 0 | -1;
  ModuleName: 1 | 0 | -1;
}

export interface ModuleMaster_IndexTableList {
  RowID: number | null;
  ModuleID: number | null;
  ModuleCode: string | null;
  ModuleName: string | null;
  ImagePath: string | null;
  DisplayOrder: number | null;
  ActiveStatus: boolean | null;
}

export interface ModuleRequest {
  PopulateType: string | null;
}
