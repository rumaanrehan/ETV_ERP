import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { EmployeeRegistration, EmployeeRegistrationList, FileUpload } from './employee-registration';


@Injectable({
  providedIn: 'root',
})
export class EmployeeRegistrationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<EmployeeRegistration> {
    return {
      EmployeeID: {
        label: 'Employee ID',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      EmployeeCode: {
        label: 'Code',
        defaultValue: 'New',
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      EmployeePrefix: {
        label: 'Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Prefix List.',
        },
        type: 'control'
      },
      EmployeeName: {
        label: 'Employee Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(),Validators.maxLength(50)],
        validationMessages: {
          required: 'Employee Name is Required.',
          maxlength: 'Employee name cannot be longer than 50 characters.',
        },
        type: 'control'
      },
      Gender: {
        label: 'Gender',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Gender List.',
        },
        type: 'control'
      },
      DOB: {
        label: 'Date of Birth',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Date of Birth is Required.',
        },
        type: 'control'
      },
      FatherSpouse: {
        label: 'Father/Spouse Name',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()],
        validationMessages: {},
        type: 'control'
      },
      MaritalStatus: {
        label: 'Marital Status',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Marital Status List.',
        },
        type: 'control'
      },
      BloodGroup: {
        label: 'Blood Group',
        defaultValue: null,
        validators: [],
        validationMessages: {
        },
        type: 'control'
      },
      MobileNo: {
        label: 'Mobile No',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          required: 'Mobile No is Required.',
          pattern: 'Please provide correct Mobile No.',
        },
        type: 'control'
      },
      AlternateMobileNo: {
        label: 'Alternate Mobile No',
        defaultValue: null,
        validators: [Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          pattern: 'Please provide correct Alternate Mobile No.',
        },
        type: 'control'
      },
      EmailID: {
        label: 'Email ID',
        defaultValue: null,
        validators: [Validators.email],
        validationMessages: {
          pattern: 'Please provide a correct E-Mail address.',
        },
        type: 'control'
      },
      EmployeeAadhaarNo: {
        label: 'Aadhaar No',
        defaultValue: null,
        validators: [Validators.pattern(/^\d{12}$/)],
        validationMessages: {
          pattern: 'Please enter a valid 12-digit Aadhaar number.'
        },
        type: 'control'
      },
      EmployeePANNo: {
        label: 'PAN No',
        defaultValue: null,
        validators: [Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$')],
        validationMessages: {
          pattern: 'Please enter a valid PAN number.'
        },
        type: 'control'
      },
      EmployeeAddress: {
        label: 'Address',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Address is Required.',
        },
        type: 'control'
      },
      EmployeeCity: {
        label: 'City',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'City is Required.',
        },
        type: 'control'
      },
      EmployeeStateID: {
        label: 'State',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the State List.',
        },
        type: 'control'
      },
      EmployeeCountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Country List.',
        },
        type: 'control'
      },
      EmployeePinCode: {
        label: 'Pin Code',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
        validationMessages: {
          required: 'Pin Code is required.',
          pattern: 'Please enter a valid 6-digit pin code.'
        },
        type: 'control'
      },
      DifferentPermanentAddress: {
        label: 'Different Permanent Address',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PermanentAddress: {
        label: 'Address',
        defaultValue: null,
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Permanent Address is Required.',
        },
        type: 'control'
      },
      PermanentCity: {
        label: 'City',
        defaultValue: null,
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Permanent City is Required.',
        },
        type: 'control'
      },
      PermanentStateID: {
        label: 'State',
        defaultValue: null,
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the State List.',
        },
        type: 'control'
      },
      PermanentCountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Country List.',
        },
        type: 'control'
      },
      PermanentPinCode: {
        label: 'Pin Code',
        defaultValue: null,
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true) ,Validators.pattern(/^[0-9]{6}$/)],
        validationMessages: {
          requiredIf: 'Permanent PIN Code is Required.',
          pattern: 'Please enter a valid 6-digit pin code.'
        },
        type: 'control'
      },
      EmergencyContactDetails: {
        label: 'Emergency Contact Details',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      EmergencyContactName: {
        label: 'Emergency Contact Name',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Emergency Contact Name is Required.',
        },
        type: 'control'
      },
      EmergencyContactMobileNo: {
        label: 'Emergency Contact Mobile No',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true), Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          requiredIf: 'Emergency Contact Mobile No is Required.',
          pattern: 'Please provide correct mobile number.',
        },
        type: 'control'
      },
      EmergencyContactRelationship: {
        label: 'Emergency Contact Relationship',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Emergency Contact Relationship is required.'
        },
        type: 'control'
      },
      EmployeeCategory: {
        label: 'Category',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Employee Category List.',
        },
        type: 'control'
      },
      EmployeeTypeID: {
        label: 'Employee Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Employee Type List.',
        },
        type: 'control'
      },
      EmployeeTypeName: {
        label: 'Employee Type Name',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DOJ: {
        label: 'Date of Joining',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Date of Joining is Required.',
        },
        type: 'control'
      },
      DepartmentID: {
        label: 'Department',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Department List.'
        },
        type: 'control'
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DesignationID: {
        label: 'Designation',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Designation List.',
        },
        type: 'control'
      },
      DesignationName: {
        label: 'Designation Name',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReportingTo: {
        label: 'Reporting To',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      CanApproveEmployeeRequest: {
        label: 'Can Approve Employee Request',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      CanApproveBillingDiscount: {
        label: 'Can Approve Billing Discount',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DisablePayroll: {
        label: 'Disable Payroll',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },

      // For Consultant
      SMCRegistrationNo: {
        label: 'SMC Registration No',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ConsultationCharge: {
        label: 'Consultation Charge',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsSurgeon: {
        label: 'Is Surgeon',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsAnaesthetist: {
        label: 'Is Anaesthetist',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsSuperSpecialist: {
        label: 'Is Super Specialist',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsVisitingConsultant: {
        label: 'Is Visiting Consultant',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsSignatory: {
        label: 'Is Signatory',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ConsultantSignatureImagePath: {
        label: 'Consultant Signature Image Path',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      SignatoryArea: {
        label: 'Signatory Area',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },

      // For ERP Access
      CanAccessERP: {
        label: 'Can Access ERP',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      CanAccessEmployeePortal: {
        label: 'Can Access Employee Portal',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },

      RoleID: {
        label: 'Role',
        defaultValue: null,
        validators: [RequiredIf('CanAccessERP', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Role List.',
        },
        type: 'control'
      },
      UserID: {
        label: 'User ID',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
    };
  }

  getFileConfig(): FormConfigType<FileUpload> {
    return {
      FileType: {
        label: 'FileType',
        defaultValue: 'ConsultantSignatureImage',
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      FileName: {
        label: 'FileName',
        defaultValue:null ,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      File: {
        label: 'File',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select the Signature Image.',
        },
        type: 'control'
      }
    }
  }


  PopulateList(model: any): Observable<ApiListResponse<EmployeeRegistrationList>> {
    return this.http.post<ApiListResponse<EmployeeRegistrationList>>(`${this.apiUrl}Admin/EmployeeRegistration/PopulateList?model=${model}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<EmployeeRegistrationList>> {
    return this.http.post<ApiPagedListResponse<EmployeeRegistrationList>>(`${this.apiUrl}Admin/EmployeeRegistration/PopulateGrid`, tabledata);
  }
  GetDetails(EmployeeID: number): Observable<ApiDataResponse<EmployeeRegistration>> {
    return this.http.post<ApiDataResponse<EmployeeRegistration>>(`${this.apiUrl}Admin/EmployeeRegistration/GetDetails?EmployeeID=${EmployeeID}`, {});
  }

  CreateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/Create`, model);
  }

  UpdateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/Edit`, model);
  }

  DeleteRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/Cancel`, model);
  }

  uploadFile(model: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/FileUpload`, model);
  }

  ResetPassword(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/ResetPassword`, model);
  }
}


