export interface ItemGroupMaster {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemTypeID: number | null;
    ItemGroupName: string | null;
}

export interface ItemGroupRequest {
    ItemTypeID?: number | null;
    ItemGroupCode?: string | null;
    ItemGroupName?: string | null;
    PopulateType: string | null;
}

export interface ItemGroup_SelectList {
    ItemGroupID: number;
    ItemGroupName: string;
}

export interface ItemGroup_IndexTableFilter {
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
    ActiveStatusID: number | null;
}

export interface ItemGroup_IndexTableList {
    ItemGroupID: number;
    ItemGroupCode: string;
    ItemGroupName: string;
    ItemTypeName: string;
    ActiveStatus: boolean;
}

export interface ItemGroup_Detail {
    ItemGroupID: number;
    ItemGroupCode: string;
    ItemTypeID: number;
    ItemGroupName: string;
}