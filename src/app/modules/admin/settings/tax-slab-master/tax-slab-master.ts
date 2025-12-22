export interface TaxSlabMaster {
  TaxSlabID: number | null;
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  TaxTypeID: number | null;
  TaxRate: number | null;
}

export interface TaxSlabRequest {
  TaxSlabCode?: string | null;
  TaxSlabName?: string | null;
  PopulateType: string | null;
}

export interface TaxSlab_SelectList {
  TaxSlabID: number;
  TaxSlabName: string;
  TaxRate: number;
}

export interface TaxSlab_IndexTableFilter {
  TaxSlabCode: string | null;
  TaxSlabName: string | null;
  TaxRateID: number | null;
  ActiveStatusID: number | null;
}

export interface TaxSlab_IndexTableList {
  TaxSlabID: number;
  TaxSlabCode: string;
  TaxSlabName: string;
  TaxTypeID: number;
  TaxRate: number;
  ActiveStatus: boolean;
}

export interface TaxSlab_Details {
  TaxSlabID: number;
  TaxSlabCode: string;
  TaxSlabName: string;
  TaxTypeID: number;
  TaxTypeName: string;     
  TaxRate: number;
}