export interface PlanMaster {
  PlanID: number | null;
  PlanCode: string | null;
  PlanName: string | null;
  PlanTypeID: number | null;
  BillCompanyID: number | null;
  IsCopyRate: boolean;
  CopyRateID: number | null;
  IsAllowedForOP: boolean;
  IsAllowedForIP: boolean;
  IsPreAuthorizationRequired: boolean;
  IsPharmacyIndentApprovalRequired: boolean;
  IsAllowedPHCreditAdjustmentInIPB: boolean;
  IsAllowedPHCreditAdjustmentInOPB: boolean;
  IsDefault: boolean;
  BillTypeMapping: PlanMaster_BillTypeMappingList[];
}

export interface PlanMaster_SelectList {
  PlanID: number;
  PlanName: string;
}

export interface PlanMaster_IndexTableFilter {
  PlanCode: string | null;
  PlanName: string | null;
  BillCompanyID: number | null;
  PlanTypeID: number | null;
  ActiveStatusID: number | null;
}

export interface PlanMaster_IndexTableList {
  RowID: number;
  PlanID: number;
  PlanCode: string;
  PlanName: string;
  BillCompanyName: string;
  PlanTypeName: string;
  IsAllowedForOP: boolean;
  IsAllowedForIP: boolean;
  IsPreAuthorizationRequired: boolean;
  IsDefault: boolean;
  ActiveStatus: boolean;
  CanDelete: boolean;
}

export interface PlanMaster_BillTypeMappingList {
  BillingSection: string | null;
  BillingSectionText: string | null;
  DefaultBillType: number | null;

  // For Outpatient
  IsAllowedCreditBillForOP: boolean;
  IsAllowedFreeBillForOP: boolean;
  OP_BillingAllowed_Days: number | null;
  OP_ReturnAllowed_BasedOn: number | null;
  OP_ReturnAllowed_BasedOn_Days: number | null;

  // For Inpatient
  IsAllowedCreditBillForIP: boolean;
  IsAllowedFreeBillForIP: boolean;
  IP_BillingAllowed_BasedOn: number | null;
  IP_BillingAllowed_BasedOn_Days: number | null;
  IP_ReturnAllowed_BasedOn: number | null;
  IP_ReturnAllowed_BasedOn_Days: number | null;
}
