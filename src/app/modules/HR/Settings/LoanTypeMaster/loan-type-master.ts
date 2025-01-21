export interface LoanTypeMaster {
  LoanTypeID: number | null;
  LoanTypeCode: string | null;
  LoanTypeName: string | null;
  InterestRate: number | null;
}
export interface LoanTypeMasterList {
  RowID: number;
  LoanTypeID: number;
  LoanTypeCode: string;
  LoanTypeName: string;
  InterestRate: number;
  ActionType: string | null;
}
