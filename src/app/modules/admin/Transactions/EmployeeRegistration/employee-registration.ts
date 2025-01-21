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
  DifferentPermanentAddress: boolean | null;
  PermanentAddress: string | null;
  PermanentCity: string | null;
  PermanentStateID: number | null;
  PermanentCountryID: number | null;
  PermanentPinCode: string | null;
  EmergencyContactDetails: boolean | null;
  EmergencyContactName: string | null;
  EmergencyContactMobileNo: string | null;
  EmergencyContactRelationship: number | null;
  EmployeeCategory: number | null;
  EmployeeTypeID: number | null;
  EmployeeTypeName: string | null;
  DOJ: Date | null;
  DepartmentID: number | null;
  DepartmentName: string | null;
  DesignationID: number | null;
  DesignationName: string | null;
  ReportingTo: number | null;
  CanApproveEmployeeRequest: boolean | null;
  CanApproveBillingDiscount: boolean | null;
  DisablePayroll: boolean | null;

  // For Consultant
  SMCRegistrationNo: string | null;
  ConsultationCharge: number | null;
  IsSurgeon: boolean | null;
  IsAnaesthetist: boolean | null;
  IsSuperSpecialist: boolean | null;
  IsVisitingConsultant: boolean | null;
  IsSignatory: boolean | null;
  ConsultantSignatureImagePath: any | null;
  SignatoryArea: number | null ;

  // For ERP Access
  CanAccessERP: boolean | null;
  CanAccessEmployeePortal: boolean | null;
  RoleID: number | null;
  UserID: string | null;
 
}

export interface EmployeeRegistrationList {
  RowID: number;
  EmployeeID: number;
  EmployeeCode: string ;
  EmployeeName: string;
  MobileNo: string;
  EmployeeTypeName: string;
  DepartmentName: string;
  DesignationName: string;
  CanAccessERP: boolean | null;
  ActiveStatus: boolean;
}

export interface FileUpload {
  FileType: string | null;
  FileName: string | null;
  File: File | null;
}
