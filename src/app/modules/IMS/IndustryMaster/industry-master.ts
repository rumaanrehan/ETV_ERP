export interface IndustryMaster {
  IndustryID: number | null;
  IndustryCode: string | null;
  IndustryName: string | null;
  ActiveStatus: boolean;
}

export interface IndustryMaster_IndexTableList {
  IndustryID: number | null;
  IndustryCode: string | null;
  IndustryName: string | null;
  ActiveStatus: boolean;
}

export interface IndustryMaster_IndexTableFilter {
  IndustryCode: string | null;
  IndustryName: string | null;
  ActiveStatus: number | null;
}

export interface IndustryMaster_SelectList {
  IndustryID: number | null;
  IndustryName: string | null;
}