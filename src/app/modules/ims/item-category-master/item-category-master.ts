export interface ItemCategoryMaster {
  ItemCategoryID: number | null;
  ItemCategoryCode: string | null;
  ItemCategoryName: string | null;
  ItemGroupID: number | null;
}

export interface ItemCategory_SelectList {
  ItemCategoryID: number | null;
  ItemCategoryName: string | null;
}

export interface ItemCategory_IndexFilter {
  ItemCategoryCode: string;
  ItemCategoryName: string;
  ItemGroupName: string;
  ActiveStatusID: number | null;
}

export interface ItemCategory_IndexList {
  RowID: number;
  ItemCategoryID: number;
  ItemCategoryCode: string;
  ItemCategoryName: string;
  ItemGroupName: string;
  ActiveStatus: boolean;
}