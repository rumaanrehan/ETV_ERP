export interface EmployeeRegistration {
  EmployeeID: number | null;
  EmployeeCode: string | null;
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
  DifferentPermanentAddress: boolean;
  PermanentAddress: string | null;
  PermanentCity: string | null;
  PermanentStateID: number | null;
  PermanentCountryID: number | null;
  PermanentPinCode: string | null;
  EmergencyContactDetails: boolean;
  EmergencyContactName: string | null;
  EmergencyContactMobileNo: string | null;
  EmergencyContactRelationship: number | null;
  EmployeeCategory: number | null;
  EmployeeTypeID: number | null;
  DOJ: Date | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  ReportingTo: number | null;
  CanApproveEmployeeRequest: boolean;
  CanApproveBillingDiscount: boolean;
  DisablePayroll: boolean;
  SMCRegistrationNo: string | null;
  ConsultationCharge: number | null;
  IsSurgeon: boolean;
  IsAnaesthetist: boolean;
  IsSuperSpecialist: boolean;
  IsVisitingConsultant: boolean;
  IsSignatory: boolean;
  ConsultantSignatureImagePath: any | null;
  SignatoryArea: number | null;
  CanAccessERP: boolean;
  CanAccessEmployeePortal: boolean;
  RoleID: number | null;
  UserID: string | null;
  Password: string | null;
  StatusText: string | null;
  HexValue: string | null;
  CanUpdate: boolean;
}

export interface EmployeeRegistrationSelectListRequest {
  EmployeeID?: number;
  EmployeeCode?: string;
  EmployeeName?: string;
  MobileNo?: string;
  EmployeeTypeID?: number;
  DepartmentID?: number;
  DesignationID?: number;
  CanAccessERP?: boolean;
  PopulateType?: string;
}

export interface EmployeeRegistrationSelectListResponse {
  EmployeeID: number;
  EmployeeCode: string;
  EmployeeName: string;
  MobileNo: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
}

export interface EmployeeRegistrationIndexTableRequest {
  EmployeeCode: string | null;
  EmployeeName: string | null;
  MobileNo: string | null;
  EmployeeTypeID: number | null;
  DepartmentID: number | null;
  DesignationID: number | null;
  // CanAccessERP: any;
  ActiveStatusID: number | null;
  PopulateType: string | null;
}

export interface EmployeeRegistrationIndexTableResponse {
  RowID: number;
  EmployeeID: number;
  EmployeeCode: string;
  EmployeeName: string;
  MobileNo: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
  CanAccessERP: boolean | null;
  ActiveStatus: string;
}

export interface EmployeeRegistrationFileUpload {
  FileType: string | null;
  FileName: string | null;
  File: File | null;
}

