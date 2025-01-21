export interface FinYearMaster {
  FinYearID: number | null;
  FinYearCode: string | null;
  FinYearName: string | null;
  FinYearStartDate: Date | null;
  FinYearEndDate: Date | null;
}

export interface FinYearMasterList {
  FinYearID: number;
  FinYearCode: string;
  FinYearName: string;
  FinYearStartDate: Date;
  FinYearEndDate: Date;
  ActiveStatus: any;
}
