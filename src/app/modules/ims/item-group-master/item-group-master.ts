export interface ItemGroupMaster {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
}

export interface ItemGroup_SelectList {
    ItemGroupID: number | null;
    ItemGroupName: string | null;
}

export interface ItemGroup_IndexTableList {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeName: string | null;
    ActiveStatus: boolean;
}

export interface ItemGroup_IndexTableFilter {
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
    ActiveStatusID: number | null;
}


export interface ItemGroupRequest {
    ItemTypeID?: number | null;
    ItemGroupID?: number | null;
    PopulateType?: string | null;
}