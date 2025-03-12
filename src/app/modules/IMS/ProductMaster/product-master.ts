export interface ProductMaster {
  ProductID?: number | null;
  ProductCode: string | null;
  ProductName: string | null;
  CategoryID: number | null;
  GenericID: number | null;
  ManufacturerID: number | null;
  UOMID: number | null;
  Unit: number | null;
  HSCode: string | null;
  PurTaxOn: string | null;
  TaxSlabID: number | null;
  PurTaxRate: number | null;
  ReorderLevel: number | null;
  ReorderQty: number | null;
  IsApprovalRequiredToPurchase: boolean | null;
  IsApprovalRequiredToIssue: boolean | null;
  NetWeight: number | null;
  GrossWeight: number | null;
  ProductDescription: string | null;
}

export interface ProductMaster_IndexTableFilter {
  ProductCode: string | null;
  ProductName: string | null;
  ProductCategory: string | null;
  IsActive: boolean | null;
}

export interface ProductMaster_IndexTableList{
  RowID: number;
  ProductID: number ;
  ProductCode: string ;
  ProductName: string ;
  ProductCategory: string ;
  UOM: string ;
  UnitPrice: number;
  IsActive: boolean;
}