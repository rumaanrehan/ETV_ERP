export interface EmployeeLoan {
  EmployeeLoanID: number | null;
  EmployeeLoanNo: string | null;
  dtEmployeeLoanDate: Date | null;

  /* Employee Details */
  EmployeeID: number | null;
  EmployeeCode: string | null;
  EmployeeName: string | null;
  MobileNo: number | null;
  EmployeeTypeName: string | null;
  DepartmentName: string | null;
  DesignationName: string | null;

  /* Loan Details */
  LoanTypeID: number | null;
  LoanTypeName: string | null;
  LoanAmount: number | null;
  LoanPeriod: number | null;
  InterestRate: number | null;
  InterestAmount: number | null;
  InstalmentAmount: number | null;
  InstalmentStartDate: Date | null;
  RepaymentMode: number | null;
  Narration: string | null;
  StatusID: number | null;
  SearchBy: number | null;
}
export interface EmployeeLoanList {
  RowID: number;
  EmployeeLoanID: number;
  EmployeeLoanNo: string;
  dtEmployeeLoanDate: Date;
  EmployeeID: number;
  EmployeeCode: string;
  EmployeeName: string;
  MobileNo: number;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;

  /* Loan Details */
  RepaymentMode: number;
  LoanTypeName: string;
  LoanAmount: number;
  LoanPeriod: number;
  StatusID: number;
  ActionType: string;
}
