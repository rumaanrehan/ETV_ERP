export interface HsnSacMaster {
  HsnCode: string | null;
  IsServiceAccountCode: boolean | null;
  Description: string | null;
  SectionName: string | null;
  ChapterName: string | null;
  HeadingName: string | null;
  TaxSlabID: number | null;
}

export interface HsnSacMaster_SelectList {
  HsnID: number | null;
  Description: string | null;
}

export interface HsnSacMaster_IndexTableFilter {
  HsnCode: string | null;
  ActiveStatusID: number | null;
}

export interface HsnSacMaster_IndexTableList {
  RowID: number | null;
  HsnID: number | null;
  HsnCode: string | null;
  Description: string | null;
  IsServiceAccountCode: boolean | null;
  TaxSlabName: string | null;
  ActiveStatus: boolean | null;
}