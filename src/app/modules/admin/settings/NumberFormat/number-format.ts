export interface NumberFormat {
  SampleNumberFormat: string | null;
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
  PopulateType: string | null;
  // BillingSection: string | null;
  // CounterID: number | null;
  // NumberFormatID: number | null;
}

export interface NumberFormatList {
  NumberFormatID: number;
  SampleNumberFormat: string;
  ModuleCode: string;
  FormatFor: string;
  StartNumber: number;
  WidthOfNumberPart: number;
  PrefillZero: boolean;
  PrefixFront: string;
  PrefixRear: string;
  Suffix: string;
  EffectiveFromDate: Date;
  TermEndDate: Date;
  RestartType: string;
  CreatedBy: string;
  CreatedDateTime: string;
  ActiveStatus: boolean;
}

export interface FormatForList {
  Value: string;
  Text: string;
}
