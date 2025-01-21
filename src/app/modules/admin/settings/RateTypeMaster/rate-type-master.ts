export interface RateTypeMaster {
  RateTypeID: number | null;
  RateTypeCode: string | null;
  RateTypeName: string | null;
  ApplicableFor: number | null;
  IsCopyRate: boolean | null;
  CopyRateID: number | null;
}

export interface RateTypeMasterList {
  RowID: number;
  RateTypeID: number;
  RateTypeCode: string;
  RateTypeName: string;
  ApplicableFor: string;
  ActiveStatus: boolean;
}


