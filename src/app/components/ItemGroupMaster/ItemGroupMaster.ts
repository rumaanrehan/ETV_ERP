export interface ItemGroupMaster {
  ItemGroupID?: number | null;
  ItemGroupName: string | null;
  ItemGroupCode: string | null;
  CreatedBy? : string | null;
  ModifiedBy?: String | null;
  CreatedDateTime? : string | null;
  ModifiedDateTime?: string | null;
}

export interface DeleteGroupItem {
  ItemGroupID: number;
}
