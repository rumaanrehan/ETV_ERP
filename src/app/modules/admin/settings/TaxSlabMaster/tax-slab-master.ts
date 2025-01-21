export interface TaxSlabMaster {
  TaxSlabID: number | null;
  TaxSlabCode: string | null;
  TaxType: number | null;
  TaxSlabName: string | null;
  TaxRate: number | null;
}
export interface TaxSlabMasterList {
  RowID: number;
  TaxSlabID: number;
  TaxSlabCode: string;
  TaxType: number;
  TaxSlabName: string;
  TaxRate: number;
  ActiveStatus: boolean;
}


