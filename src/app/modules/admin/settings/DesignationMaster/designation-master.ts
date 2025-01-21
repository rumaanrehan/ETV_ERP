export interface DesignationMaster {
  DesignationID: number | null;
  DesignationCode: string | null;
  DesignationName: string | null;
}

export interface DesignationMasterList {
  DesignationID: number;
  DesignationCode: string;
  DesignationName: string;
  ActiveStatus: any;
}
