export interface PaymentMode {
  PaymentModeID: number | null;
  PaymentModeCode: string | null;
  PaymentModeName: string | null;
  ReferenceNo_IsAllowed: boolean | null;
  ReferenceNo_IsRequired: boolean | null;
  ReferenceNo_Label: string | null;
  ReferenceDate_IsAllowed: boolean | null;
  ReferenceDate_IsRequired: boolean | null;
  ReferenceDate_Label: string | null;
  Bank_IsAllowed: boolean | null;
  Bank_IsRequired: boolean | null;
  Bank_Label: string | null;
  PaymentModeMapping: PaymentModeMappingList[];
}

export interface PaymentModeList {
  RowID: number; 
  PaymentModeID: number ;
  PaymentModeCode: string ;
  PaymentModeName: string ;
  ReferenceNo_IsAllowed: boolean ;
  ReferenceNo_IsRequired: boolean ;
  ReferenceNo_Label: string ;
  ReferenceDate_IsAllowed: boolean ;
  ReferenceDate_IsRequired: boolean ;
  ReferenceDate_Label: string ;
  Bank_IsAllowed: boolean ;
  Bank_IsRequired: boolean ;
  Bank_Label: string ;
  ActionType: string | null;
  ActiveStatus: boolean;

}
export interface PaymentModeMappingList {
  // RowID: number;
  // PaymentModeID: number;
  PaymentModeName: string | null;
  AllowedForPaymentMode: boolean | false;
}