export interface DiscountReasonMaster {
  DiscountReasonID: number | null;
  DiscountReasonCode: string | null;
  DiscountReasonName: string | null;
  IsAllowedAdditionalDescription: boolean | null;
  IsAdditionalDescriptionRequired: boolean | null;
  IsDiscountApprovalRequired: boolean | null;
  DiscountPercent: number | null;
  IsAllowedForOPRegistration: boolean | null;
  IsAllowedForBilling: boolean | null;
  IsAllowedForPharmacy: boolean | null;
}

export interface DiscountReasonMasterList {
  RowID: number;
  DiscountReasonID: number;
  DiscountReasonCode: string;
  DiscountReasonName: string;
  IsAllowedAdditionalDescription: boolean;
  IsAdditionalDescriptionRequired: boolean;
  IsDiscountApprovalRequired: boolean;
  DiscountPercent: number;
  IsAllowedForOPRegistration: boolean;
  IsAllowedForBilling: boolean;
  IsAllowedForPharmacy: boolean;
  ActionType: string | null;
  ActiveStatus: boolean;
}
