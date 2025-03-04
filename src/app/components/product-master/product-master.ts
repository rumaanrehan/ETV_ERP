export interface Product {
  CategoryID: number | null;
  ProductId?: number | null;
  productCode: string | null;
  productName: string | null;
  productCategory: string | null;
  productDescription: string | null;
  unit: string | null;
  manufacturerId: number | null;
  hsCode: string | null;
  unitPrice: number | null;
  costPrice: number | null;
  taxSlabId: number | null;
  purTaxRate: number | null;
  reorderLevel: number | null;
  reorderQty: number | null;
  measurementUnit: string | null;
  netWeight: number | null;
  grossWeight: number | null;
  Dimension: string | null;
  packagingType: string | null;
  isActive: boolean | null;
  createdBy?: string | null;
}

export interface UpdateProductList {
  ProductId: number;
  productCode: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  unit: string;
  manufacturerId: number;
  hsCode: string;
  unitPrice: number;
  costPrice: number;
  taxSlabId: number;
  purTaxRate: number;
  reorderLevel: number;
  reorderQty: number;
  measurementUnit: string;
  netWeight: number;
  grossWeight: number;
  dimensions: string;
  packagingType: string;
  isActive: boolean;
  createdBy?: string;
}

export interface ProductModel {
  ProductId?: number;
  productCode: string | null;
  productName: string | null;
  productCategory: string | null;
  productDescription: string | null;
  unit: string | null;
  manufacturerId: number | null;
  hsCode: string | null;
  unitPrice: number | null;
  costPrice: number | null;
  taxSlabId: number | null;
  purTaxRate: number | null;
  reorderLevel: number | null;
  reorderQty: number | null;
  measurementUnit: string | null;
  netWeight: number | null;
  grossWeight: number | null;
  dimensions: string | null;
  packagingType: string | null;
  isActive: boolean | null;
  createdBy?: string | null;
}
