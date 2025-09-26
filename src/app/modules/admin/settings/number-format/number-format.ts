export interface NumberFormat {
  // SampleNumberFormat: string | null;
  ModuleCode: string | null;
  FormatFor: string | null;
  StartNumber: number | null;
  WidthOfNumberPart: number | null;
  PrefillZero: boolean | null;
  PrefixFront: string | null;
  PrefixRear: string | null;
  Suffix: string | null;
  EffectiveFromDate: Date | null;
  RestartType: number;
}

export interface NumberFormatRequest {
  ModuleCode?: string | null;
  FormatFor?: string | null;
  PopulateType: string | null;
}

export interface NumberFormatList {
  SampleNumberFormat: string;
  EffectiveFromDate: Date;
  TermEndDate: Date;
  StartNumber: number;
  WidthOfNumberPart: number;
  PrefillZero: boolean;
  PrefixFront: string;
  PrefixRear: string;
  Suffix: string;
  RestartType: string;
  CreatedDateTime: string;
}