import { ItemTypeMaster } from "../../modules/ims/settings/item-type-master/item-type-master";

export interface ItemGroup {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ActiveStatus: boolean;

    ItemType?: ItemTypeMaster | null;
}

export interface ItemGroup_IndexTableList {
    ItemGroupID: number | null;
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ActiveStatus: boolean;
}

export interface ItemGroup_IndexTableFilter {
    ItemGroupCode: string | null;
    ItemGroupName: string | null;
    ActiveStatus: number | null;
}

export interface ItemGroup_SelectList {
    ItemGroupID: number | null;
    ItemGroupName: string | null;
}
