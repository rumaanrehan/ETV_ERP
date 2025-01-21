export interface PrefixMaster {
  PrefixID: number | null;
  PrefixCode: string | null;
  PrefixName: string | null;
  PrefixGender: number | null;
  IsAllowedForPatient: boolean | null;
  IsAllowedForStaff: boolean | null;
  DisplayOrder:number | null;
  
}

export interface PrefixMasterList {
  RowID: number;
  PrefixID: number;
  PrefixCode: string;
  PrefixName: string;
  PrefixGender: string;
  IsAllowedForPatient: boolean;
  IsAllowedForStaff: boolean;
  DisplayOrder: number;
  ActionType: string | null;
  ActiveStatus: boolean;
}
