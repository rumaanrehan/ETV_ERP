export interface TaxSlabMaster {
  TaxSlabID: number | null;
  TaxSlabCode: string | null;
  TaxTypeID: number | null;
  TaxSlabName: string | null;
  TaxRate: number | null;
}

export interface TaxSlab_SelectList {
  TaxSlabID: number | null;
  TaxSlabName: string | null;
}

export interface TaxSlab_IndexTableFilter {
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  ActiveStatusID: number | null;
}

export interface TaxSlab_IndexTableList {
  TaxSlabID: number;
  TaxSlabCode: string;
  TaxSlabName: string;
  TaxType: number;
  TaxRate: number;
  ActiveStatus: boolean;
}