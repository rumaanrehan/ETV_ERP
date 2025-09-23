export interface TaxSlabMaster {
  TaxSlabID: number | null;
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  TaxTypeID: number | null;
  TaxRate: number | null;
}

export interface TaxSlab_SelectList {
  TaxSlabID: number | null;
  TaxSlabName: string | null;
  TaxRate: number | null
}

export interface TaxSlab_IndexTableFilter {
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  TaxRate: number | null;
  ActiveStatusID: number | null;
}

export interface TaxSlab_IndexTableList {
  TaxSlabID: number | null;
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  TaxTypeID: number | null;
  TaxRate: number | null;
  ActiveStatus: boolean | null;
}

export interface TaxSlabRequest {
  TaxSlabID?: number | null;
  PopulateType: string | null;
}