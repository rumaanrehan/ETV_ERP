export interface ServiceMaster {
  ServiceID: number | null;
  ServiceCode: string | null;
  ServiceCategoryID: number | null;
  ServiceName: string | null;
  ServiceRate: number | null;
  TestType: number | null
  SIUnit: string | null;
  ShowMethodOnReport: boolean;
  ResultType: number | null;
  IsRangeBounds: boolean;
  ResultRange_MinValue: number | null;
  ResultRange_MaxValue: number | null;
  ResultRange_ReferenceValue: string | null;
  LabelArray: LableMaster[];


}
export interface ServiceMasterList {
  RowID: number;
  ServiceID: number;
  ServiceCode: string;
  ServiceName: string;
  TestType: number;
  ServiceCategoryName: string;
  SIUnit: string;
  ResultType: number;
  CreatedBy: string;
  ActiveStatus: any;
}

export interface LableMaster {
  Label: string | null;
}
