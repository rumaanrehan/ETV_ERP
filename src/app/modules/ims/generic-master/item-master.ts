export interface ItemMaster {
    ItemID: number | null;
    ItemCode: string | null;
    ItemName: string | null;
    ItemCategoryID: number | null;
}

export interface ItemMaster_SelectList{
    ItemID: number;
    ItemName: string;
}

export interface ItemMaster_IndexTableFilter {
    ItemCode: string | null;
    ItemName: string | null;
    ItemCategoryName: string | null;
    ActiveStatusID: number | null;
}

export interface ItemMaster_IndexTableList {
    RowID: number;
    ItemID: number;
    ItemCode: string;
    ItemName: string;
    ItemCategoryName: string;
    ActiveStatus: boolean;
}