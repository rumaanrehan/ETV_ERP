export interface ProductMaster {
  ProductID: number | null;
  ProductCode: string | null;
  ItemTypeID: number | null;
  ItemGroupID: number | null;
  ItemCategoryID: number | null;
  ProductName: string | null;
  GenericID: number | null;
  ManufacturerID: number | null;
  UOMID: number | null;
  Unit: number | null;
  HSCode: string | null;
  TaxSlabID: number | null;
  PurTaxRate: number | null;
  ReorderLevel: number | null;
  ReorderQty: number | null;
  IsApprovalRequiredToPurchase: boolean | null;
  IsApprovalRequiredToIssue: boolean | null;
  NetWeight: number | null;
  GrossWeight: number | null;
  ProductDescription: string | null;
  PurTaxOn: number | null;
}

export interface Product_SelectList {
  ProductID: number | null;
  ProductCode: number | null;
  ProductName: string | null;
  PurTaxRate: number | null;
}

export interface ProductMaster_IndexTableFilter {
  ProductCode: string | null;
  ProductName: string | null;
  ItemGroupName: string | null;
  ItemCategoryName: string | null;
  GenericName: string | null;
  ManufacturerName: string | null;
  UOMName: string | null;
  ActiveStatusID: number | null;
}

export interface ProductMaster_IndexTableList {
  RowID: number;
  ProductID: number;
  ProductCode: string;
  ProductName: string;
  ItemGroupName: string;
  ItemCategoryName: string;
  GenericItemName: string;
  ManufacturerName: string;
  UOMName: string;
  UnitPrice: number;
  ActiveStatus: boolean;
}

export interface ProductRequest {
  ProductCode?: string | null;
  ProductName?: string | null;
  PopulateType?: string | null;
}