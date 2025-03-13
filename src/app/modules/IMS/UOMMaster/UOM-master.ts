export interface UOMMaster {
  UOMID: number | null;
  UOMCode: string | null;
  UOMName: string | null;
}

export interface UOMMaster_SelectList {
  UOMID: number | null;
  UOMName: string | null;
}

export interface DeleteUOM_Master {
  UOMID?: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatus? : boolean
  ActionType: string;
  ReasonToUpdate: string;
}
