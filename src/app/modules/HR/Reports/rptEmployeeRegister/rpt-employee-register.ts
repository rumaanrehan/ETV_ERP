export interface rptEmployeeRegister {
  EmployeeTypeID: number | null;
  GroupBy: number | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  DateRange_SearchBy: number | null;
  FromDate: Date | null;
  ToDate: Date | null;
  StatusID: number | null;
  JoiningMonthID: number | null;
}
export interface rptEmployeeRegisterDetails {
  RowID: number;
  TotalRecords: number;
  GroupBy: string;
  EmployeeCode: string;
  EmployeeName: string;
  Gender: string;
  DOB: string;
  FatherSpouse: string;
  BloodGroup: string;
  MobileNo: string;
  EmailID: string;
  EmployeeAadhaarNo: string;
  EmployeePANNo: string;
  EmployeeAddress: string;
  EmergencyContactName: string;
  EmergencyContactMobileNo: string;
  DOJ: string;
  Duration: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
  BiometricID: string;
  PFAccountNo: string;
  PFUniversalAccountNo: string;
  ESIAccountNo: string;
  BankAccountNo: string;
  BankAccountIFSCCode: string;
  BankName: string;
  DOT: string;
  ROT: string;
  BasicPay: number;
  GrossPay: number;
  StatusText: string;
  HexValue: string;
  ActiveStatus: any;

}
