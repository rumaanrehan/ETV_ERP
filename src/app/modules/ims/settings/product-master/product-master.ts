export interface ProductMaster {
  ProductID: number | null;
  ModelCode: string | null;
  ProductCode: string | null;
  ItemCategoryID: number | null;
  ProductName: string | null;
  UOMID: number | null;
  Unit: number | null;
  HSCode: string | null;
  TaxSlabID: number | null;
  PurTaxOn: string | null;
}

export interface ProductRequest {
  ProductCode?: string | null;
  ProductName?: string | null;
  PopulateType?: string | null;
}

export interface Product_SelectList {
  ProductID: number | null;
  ProductCode?: string | null;
  ProductName: string | null;
  UOM?: string | null;
  HSCode?: string | null;
  PurTaxRate?: number | null;
}

export interface Product_IndexTableFilter {
  ProductCode: string | null;
  ProductName: string | null;
  ItemCategoryName: string | null;
  UOMName: string | null;
  ActiveStatusID: number | null;
}

export interface Product_IndexTableSort {
  ProductCode: number;
  ProductName: number;
}

export interface Product_IndexTableList {
  RowID: number;
  ProductID: number;
  ProductCode: string;
  ProductName: string;
  ItemCategoryName: string;
  UOMName: string;
  ActiveStatus: boolean;
}

export interface Product_Details {
  ProductID: number | null;
  ModelCode: string | null;
  ProductCode: string | null;
  ItemCategoryID: number | null;
  ProductName: string | null;
  UOMID: number | null;
  Unit: number | null;
  HSCode: string | null;
  TaxSlabID: number | null;
  PurTaxOn: string | null;
}
