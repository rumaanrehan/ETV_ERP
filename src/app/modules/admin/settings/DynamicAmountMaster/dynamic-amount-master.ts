export interface DynamicAmountMaster {
  DynamicAmountID: number | null;
  DynamicAmountCode: string | null;
  DynamicAmountName: string | null;
  DynamicAmountTypeID: number | null;
}

export interface DynamicAmountMasterList {
  RowID: number;
  DynamicAmountID: number;
  DynamicAmountCode: string;
  DynamicAmountName: string;
  DynamicAmountTypeName: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}


