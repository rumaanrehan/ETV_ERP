export interface DynamicAmountMaster {
  DynamicAmountID: number | null;
  DynamicAmountCode: string | null;
  DynamicAmountName: string | null;
  DynamicAmountTypeID: number | null;
}

export interface DynamicAmountMaster_SelectList {
  DynamicAmountID: number;
  DynamicAmountName: string;
}

export interface DynamicAmountMaster_IndexTableFilter {
  DynamicAmountCode: string | null;
  DynamicAmountName: string | null;
  DynamicAmountTypeName: string | null;
  ActiveStatusID: number | null;
}

export interface DynamicAmountMaster_IndexTableList {
  RowID: number;
  DynamicAmountID: number;
  DynamicAmountCode: string;
  DynamicAmountName: string;
  DynamicAmountTypeName: string;
  ActiveStatus: boolean;
}