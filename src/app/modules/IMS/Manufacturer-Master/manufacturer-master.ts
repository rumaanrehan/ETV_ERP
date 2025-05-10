export interface ManufacturerMaster {
  ManufacturerID: number | null;
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
}

export interface ManufacturerMaster_IndexTableList {
  ManufacturerID: number | null;
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
  ActiveStatus: boolean;
}

export interface ManufacturerMaster_IndexTableFilter {
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
  ActiveStatusID: number | null;
}

export interface ManufacturerMaster_SelectList {
  ManufacturerID: number | null;
  ManufacturerName: string | null;
}
