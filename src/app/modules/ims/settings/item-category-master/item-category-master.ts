export interface ItemCategoryMaster {
  ItemCategoryID: number | null;
  ItemCategoryCode: string | null;
  ItemTypeID: number | null;
  ItemGroupID: number | null;
  ItemCategoryName: string | null;
}

export interface ItemCategoryRequest {
  ItemCategoryCode?: string | null;
  ItemGroupID?: number | null;
  ItemCategoryName?: string | null;
  PopulateType: string | null;
}

export interface ItemCategory_SelectList {
  ItemCategoryID: number;
  ItemCategoryName: string;
}

export interface ItemCategory_IndexFilter {
  ItemCategoryCode: string | null;
  ItemCategoryName: string | null;
  ItemGroupName: string | null;
  ActiveStatusID: number | null;
}

export interface ItemCategory_IndexList {
  ItemCategoryID: number;
  ItemCategoryCode: string;
  ItemCategoryName: string;
  ItemGroupName: string;
  ActiveStatus: boolean;
}

export interface ItemCategory_Details {
  ItemCategoryID: number;
  ItemCategoryCode: string;
  ItemTypeID: number;
  ItemGroupID: number;
  ItemCategoryName: string;
}