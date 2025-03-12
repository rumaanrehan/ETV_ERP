export interface CategoryMaster {
  CategoryTypeID: number | null;
  CategoryID?: number | null;
  CategoryCode?: string | null;
  CategoryName: string;
  // CategoryType: string;
  ActiveStatus: boolean;
  // CreatedDateTime?: string;
  // ModifiedDateTime?: string;
  // CreatedBy?: string;
  // ModifiedBy?: string;
}

export interface CategoryType {
  CategoryTypeID: number;
  CategoryTypeName: string;
}
