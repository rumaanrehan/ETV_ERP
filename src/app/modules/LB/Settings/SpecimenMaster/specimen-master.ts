export interface SpecimenMaster {
  SpecimenID: number | null;
  SpecimenCode: string | null;
  SpecimenName: string | null;
}
export interface SpecimenMasterList {
  RowID: number;
  SpecimenID: number;
  SpecimenCode: string;
  SpecimenName: string;
  ActionType: string | null;
}
