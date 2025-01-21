export interface TestBooking {
  BookingID: number | null;
  BookingNo: string | null;
  BookingDateTimeMode: number | null;
  BookingDate: Date | null; //sahi karna hai dt remove karna hai.
  BookingTime: string | null;
  
  PID: number | null;
  RegistrationID: number | null;
  RegistrationNo: string | null;
  PatientType: string | null;
  PatientName: string | null;  
  AgeSex: string | null;
  // ConsultantCategory: number | null; //remove karna hai
  ConsultantID: number | null;
  ConsultantName: string | null;
  RegistrationDateTime: string | null;
  // DisDateTime: string | null; //remove karna hai.
  PlanName: string | null;
  PatientLocation: string | null;

  /* Service Details */
  SearchBy: number | null;
  // ServiceList: AddDetailList[];


  
  
  // BookingDetailID: number | null;
  // ServiceInvoiceNo: string | null;
  
  // // BookingDateTimeMode: number | null;
  // IsBookingAllowedForOP: boolean;
  
  
  
  // RegistrationDays: number | null;
  // IsVerifiedPatient: boolean;
  // IsMainInvoiceGenerated: boolean;
  
  
  // AddDetail: AddDetailList[]; /*AddDetail Array List*/
  
  // ServiceDetailID: number | null;
  // ServiceID: number | null;
  // ServiceName: string | null;
  // ServiceAmount: number | null;
  // IsServiceRateEditable: boolean | null;
  // ServiceCode: string | null;
  // ServiceCategoryName: string | null;
  // InPackage: boolean | null;
  // PackageID: number | null;
  // PackageName: string | null;
  // ServiceRatePerUnit: number | null;
  // ServiceDiscountAmount: number | null;
  // SearchBy: number | null;
  // TotalAmount: number | null;
  // IsAutoPrint: boolean;
  // DaysAllowedToOPForBilling: number;
  // DaysAllowedToIPForBilling: number;
  // IsAllowedBillingForIPMainBill: boolean;
  // GeneratedBy: string | null;
  // ActionType: string | null;
  // ReasonToUpdate: string | null;
  // CancellationReason: string | null;

  // txtNoOfItems: number | null;
}

export interface TestBooking_PatientDetails {
  PID: number | null;
  RegistrationNo: string | null;
  RegistrationID: number | null;
  PatientType: string | null;
  RegistrationDays: number | null;
  IsVerifiedPatient: boolean;
  IsMainInvoiceGenerated: boolean;
  PatientName: string | null;
  AgeSex: string | null;
  ConsultantCategory: string | null;
  ConsultantName: string | null;
  ConsultantID: number | null;
  RegistrationDateTime: string | null;
  DisDateTime: string | null;
  PlanName: string | null;
  PatientLocation: string | null;
}

export interface TestBooking_ConsultantList {
  ConsultantID: number | null;
  ConsultantCode: string | null;
  ConsultantName: string | null;
  DepartmentName: string | null;
}

export interface TestBooking_PatientDetail {
  PID: number | null;
  RegistrationNo: string | null;
  RegistrationID: number | null;
  PatientType: string | null;
  RegistrationDays: number | null;
  IsVerifiedPatient: boolean;
  IsMainInvoiceGenerated: boolean;
  PatientName: string | null;
  AgeSex: string | null;
  ConsultantCategory: string | null;
  ConsultantName: string | null;
  ConsultantID: number | null;
  RegistrationDateTime: string | null;
  DisDateTime: string | null;
  PlanName: string | null;
  PatientLocation: string | null;
}

export interface TestBookingList {
  RowID: number | null;
  BookingID: number | null;
  BookingNo: string | null;
  dtBookingDate: Date | null;
  RegistrationNo: string | null;
  PatientName: string | null;
  ServiceInvoiceNo: string | null;
  GeneratedBy: string | null;
  ActiveStatus: boolean | null;
}

export interface TestBooking_BookingDetails {
  BookingDetailID: number | null;
  ServiceDetailID: number | null;
  ServiceID: number | null;
  ServiceCode: string | null;
  ServiceName: string | null;
  ServiceCategoryName: string | null;
  InPackage: boolean | null;
  PackageID: number | null;
  PackageName: string | null;
  IsServiceRateEditable: boolean;
  ServiceRateID: number | null;
  ServiceRatePerUnit: number | null;
  ServiceDiscountAmount: number | null;
  ServiceAmount: number | null;
  StatusText: string | null;
}

export interface AddDetailList {
  BookingDetailID: number | null;
  ServiceDetailID: number | null;
  ServiceID: number | null;
  ServiceName: string | null;
  ServiceCode: string | null;
  ServiceCategoryName: string | null;
  PackageName: string | null;
  ServiceRatePerUnit: number | null;
  ServiceDiscountAmount: number | null;
  ServiceAmount: number | null;
  InPackage: boolean | null;
  PackageID: number | null;
  IsServiceRateEditable: boolean;
  ServiceRateID: number | null;
  StatusText: string | null;
}

export interface ServiceDetail {
  ServiceName: string;
  ServiceCategoryName: string;
  InPackage: string;
  ServiceAmount: number;
}

export interface TestBooking_IndexTableFilter {
  BookingNo: string | null;
  RegistrationNo: string | null;
  PatientName: string | null;
  ActiveStatusID: number | null;
}
