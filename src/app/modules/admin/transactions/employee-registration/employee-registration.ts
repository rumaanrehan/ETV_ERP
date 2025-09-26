export interface EmployeeRegistration {
  EmployeeID: number | null;
  EmployeeCode: string | null;

  // Personal Details
  EmployeePrefix: string | null;
  EmployeeName: string | null;
  Gender: number | null;
  DOB: Date | null;
  FatherSpouse: string | null;
  MaritalStatus: number | null;
  BloodGroup: string | null;
  MobileNo: string | null;
  AlternateMobileNo: string | null;
  EmailID: string | null;
  EmployeeAadhaarNo: string | null;
  EmployeePANNo: string | null;
  EmployeeAddress: string | null;
  EmployeeCity: string | null;
  EmployeeStateID: number | null;
  EmployeeCountryID: number | null;
  EmployeePinCode: string | null;

  /// Emergency Contact Details
  EmergencyContactDetails: boolean;
  EmergencyContactName: string | null;
  EmergencyContactMobileNo: string | null;
  EmergencyContactRelationship: number | null;

  /// Official Details
  DOJ: Date | null;
  DOT: Date | null;
  ReasonForTermination: string | null;
  EmployeeTypeID: number | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  StatusID: number | null;
  ReportingTo: number | null;
  CanApproveEmployeeRequest: boolean;
  CanApproveBillingDiscount: boolean;
  DisablePayroll: boolean;
  CanAccessERP: boolean | null;
  CanAccessEmployeePortal: boolean;
  RoleID: number | null;
  // Password: string | null;
  // StatusText: string | null;
  // HexValue: string | null;
  // CanUpdate: boolean;
}

export interface EmployeeRegistrationRequest {
  EmployeeID: number | null;
  EmployeeCode: string | null;
  EmployeeName: string | null;
  MobileNo: string | null;
  EmployeeTypeID: number | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  CanAccessERP: boolean | null;
  PopulateType: string | null;
}

export interface EmployeeRegistration_SelectList {
  EmployeeID: number;
  EmployeeCode: string;
  EmployeeName: string;
  MobileNo: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
}

export interface EmployeeRegistration_IndexTableFilter {
  EmployeeCode: string | null;
  EmployeeName: string | null;
  MobileNo: string | null;
  EmployeeTypeID: number | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  CanAccessERP: any;
  PopulateType: string | null;
}

export interface EmployeeRegistration_IndexTableList {
  RowID: number;
  EmployeeID: number;
  EmployeeCode: string;
  EmployeeName: string;
  MobileNo: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
  CanAccessERP: boolean | null;
  CanDelete: boolean;
}
