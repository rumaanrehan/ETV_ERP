export interface UOMMaster {
  UOMID: number | null;
  UOMCode: string | null;
  UOMName: string | null;
}

export interface UOMMaster_IndexTableList {
  UOMID: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatus: boolean;
}

export interface UOMMaster_IndexTableFilter {
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatus: number | null;
}

export interface UOMMaster_SelectList {
  UOMID: number | null;
  UOMName: string | null;
}