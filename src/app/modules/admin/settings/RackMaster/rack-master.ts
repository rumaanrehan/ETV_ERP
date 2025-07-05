export interface RackMaster {
  RackCode: string | null;
  StoreID: number | null;
  RackName: string | null;
}

export interface RackMaster_SelectList {
  RackID: number | null;
  RackName: string | null;
}

export interface StoreMaster_SelectList {
  StoreID: number | null;
  StoreName: string | null;
}

export interface RackMaster_IndexTableFilter {
  RackCode: string | null;
  RackName: string | null;
  ActiveStatusID: number | null;
}

export interface RackMaster_IndexTableList {
  RowID: number | null;
  RackID: number | null;
  RackCode: string | null;
  StoreName: string | null;
  RackName: string | null;
  ActiveStatus: boolean | null;
}
