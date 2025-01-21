export interface AntibioticMaster {
  AntibioticID: number | null;
  AntibioticCode: string | null;
  AntibioticName: string | null;
}
export interface AntibioticMasterList {
  RowID: number;
  AntibioticID: number;
  AntibioticCode: string;
  AntibioticName: string;
  ActionType: string | null;
}
