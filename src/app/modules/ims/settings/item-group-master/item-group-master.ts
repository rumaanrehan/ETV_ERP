import { ItemTypeMaster } from "../item-type-master/item-type-master";

export interface ItemGroupMaster {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;

    ItemType?: ItemTypeMaster | null;
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

export interface ItemGroup_Details {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ItemTypeID: number | null;
}