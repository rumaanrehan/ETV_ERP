export interface ItemGroupMaster {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
}

export interface ItemGroupMaster_SelectList {
    ItemGroupID: number | null;
    ItemGroupName: string | null;
}

export interface ItemGroupMaster_IndexTableList {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeName: string | null;
    ActiveStatus: boolean;
}

export interface ItemGroupMaster_IndexTableFilter {
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
    ActiveStatusID: number | null;
}