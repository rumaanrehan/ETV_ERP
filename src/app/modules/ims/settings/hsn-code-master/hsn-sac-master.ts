export interface HsnSacMaster {
  HSNCodeID: number | null;
  HSNCode: string | null;
  IsServiceAccountCode: boolean | null;
  HSNCodeDescription: string | null;
  SectionName: string | null;
  ChapterName: string | null;
  HeadingName: string | null;
  TaxSlabID: number | null;
}

export interface HsnSacMaster_SelectList {
  HsnID: number | null;
  HSNCode: string | null;
}

export interface HsnSacMaster_IndexTableFilter {
  HSNCode: string | null;
  HSNCodeDescription: string | null;
  ActiveStatusID: number | null;
}

export interface HsnSacMaster_IndexTableList {
  RowID: number | null;
  HSNCodeID: number | null;
  HSNCode: string | null;
  HSNCodeDescription: string | null;
  IsServiceAccountCode: boolean | null;
  TaxRate: string | null;
  ActiveStatus: boolean | null;
}