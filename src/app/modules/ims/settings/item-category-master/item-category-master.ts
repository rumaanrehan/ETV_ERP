import { ItemGroup } from "../../../../components/Item-Group/item-group";


export interface ItemCategoryMaster {
  ItemCategoryID: number | null;
  ItemCategoryCode: string | null;
  ItemTypeID: number | null;
  ItemGroupID: number | null;
  ItemCategoryName: string | null;

  ItemGroup?: ItemGroup | null;
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

export interface ItemCategoryRequest {
    ItemGroupID?: number | null;
    ItemCategoryID?: number | null;
    PopulateType?: string | null;
}