import { ItemCategoryMaster } from "../item-category-master/item-category-master";

export interface GenericMaster {
    GenericID: number | null;
    GenericCode: string | null;
    GenericName: string | null;
    ItemTypeID: number | null;
    ItemGroupID: number | null;
    ItemCategoryID: number | null;

    ItemCategory?: ItemCategoryMaster | null;
}

export interface Generic_SelectList{
    GenericID: number;
    GenericName: string;
}

export interface Generic_IndexTableFilter {
    GenericCode: string | null;
    GenericName: string | null;
    ItemCategoryName: string | null;
    ActiveStatusID: number | null;
}

export interface Generic_IndexTableList {
    RowID: number;
    GenericID: number;
    GenericCode: string;
    GenericName: string;
    ItemCategoryName: string;
    ActiveStatus: boolean;
}

export interface GenericRequest {
    ItemCategoryID?: number | null;
    GenericID?: number | null;
    PopulateType?: string | null;
}