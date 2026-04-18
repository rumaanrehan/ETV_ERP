export interface UOMMaster {
  UOMID: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ShortCode: string | null;
}

export interface UOM_IndexTableList {
  UOMID: number;
  UOMCode: string;
  UOMName: string;
  ShortCode: string;
  ActiveStatus: boolean;
}

export interface UOM_IndexTableFilter {
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatusID: number | null;
}

export interface UOM_IndexTableSort {
  UOMCode: number;
  UOMName: number;
}

export interface UOM_SelectList {
  UOMID: number;
  UOMName: string;
}

export interface UOMRequest {
  UOMID?: number | null
  PopulateType?: string | null;
}

export interface UOM_Details {
  UOMID: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ShortCode: string | null;
}
