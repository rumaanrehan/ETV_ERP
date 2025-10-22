export interface ManufacturerMaster {
  ManufacturerID: number | null;
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
  ShortCode: string | null;
}

export interface Manufacturer_IndexTableFilter {
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
  ActiveStatusID: number | null;
}

export interface Manufacturer_IndexTableList {
  ManufacturerID: number;
  ManufacturerCode: string;
  ManufacturerName: string;
  ShortCode: string;
  ActiveStatus: boolean;
}

export interface Manufacturer_SelectList {
  ManufacturerID: number;
  ManufacturerName: string;
}

export interface ManufacturerRequest {
  ManufacturerID?: number | null;
  PopulateType?: string | null;
}

export interface Manufacturer_Details {
  ManufacturerID: number;
  ManufacturerCode: string | null;
  ManufacturerName: string | null;
  ShortCode: string | null;

}