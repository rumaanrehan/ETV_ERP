export interface RoomTypeMaster {
  RoomTypeID: number | null;
  RoomTypeCode: string | null;
  RoomTypeName: string | null;
  RoomRate: number | null;
  RateTypeID: number | null;
}
export interface RoomTypeMasterList {
  RowID: number;
  RoomTypeID: number;
  RoomTypeCode: string;
  RoomTypeName: string;
  RateTypeName: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}
