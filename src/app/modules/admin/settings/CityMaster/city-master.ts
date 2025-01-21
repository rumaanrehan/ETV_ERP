export interface CityMaster {
  CityID: number | null;
  CityCode: string | null;
  CityName: string | null;
}
export interface CityMasterList {
  RowID: number;
  CityID: number;
  CityCode: string;
  CityName: string;
  ActionType: string | null;
  ActiveStatus: any;
}
