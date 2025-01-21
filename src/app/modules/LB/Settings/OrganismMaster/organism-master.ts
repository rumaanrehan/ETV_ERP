export interface OrganismMaster {
  OrganismID: number | null;
  OrganismCode: string | null;
  OrganismName: string | null;
}
export interface OrganismMasterList {
  RowID: number;
  OrganismID: number;
  OrganismCode: string;
  OrganismName: string;
  ActionType: string | null;
  ActiveStatus: any;
}
