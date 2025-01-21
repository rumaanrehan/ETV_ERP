export interface ConsultantUnitMaster {
  ConsultantUnitID: number | null;
  DepartmentID: number | null;
  ConsultantUnitCode: string | null;
  ConsultantUnitName: string | null;
  dtEffectiveFromDate: Date | null;
  //TermEndDate: Date | null;

  //Used in OP & IP Registration
  //RegistrationDate: Date | null;
  //IsDefault: boolean | null;
}

export interface ConsultantUnitMasterList {
  RowID: number;
  ConsultantUnitID: number;
  ConsultantUnitCode: string;
  ConsultantUnitName: string ;
  DepartmentName: string ;
  dtEffectiveFromDate: Date;
  ActionType: string | null;
  ActiveStatus: boolean;

  //Used in OP & IP Registration
  //RegistrationDate: Date;
  //IsDefault: boolean;
}
