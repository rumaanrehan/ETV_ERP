export interface UOM_Master {
  UOMID?: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatus? : boolean | null
}

export interface DeleteUOM_Master {
  UOMID?: number | null;
  UOMCode: string | null;
  UOMName: string | null;
  ActiveStatus? : boolean
  ActionType: string;
  ReasonToUpdate: string;
}
