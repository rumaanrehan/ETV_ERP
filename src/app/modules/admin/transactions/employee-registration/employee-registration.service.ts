import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { CountryMaster, CountryRequest } from '../../settings/country-master/country-master';
import { CountryMasterService } from '../../settings/country-master/country-master.service';
import { Department_SelectList, DepartmentRequest } from '../../settings/department-master/department-master';
import { DepartmentMasterService } from '../../settings/department-master/department-master.service';
import { Designation_SelectList } from '../../settings/designation-master/designation-master';
import { DesignationMasterService } from '../../settings/designation-master/designation-master.service';
import { EmployeeType_SelectList, EmployeeTypeRequest } from '../../settings/employee-type-master/employee-type-master';
import { EmployeeTypeMasterService } from '../../settings/employee-type-master/employee-type-master.service';
import { State_SelectList, StateRequest } from '../../settings/state-master/state-master';
import { StateMasterService } from '../../settings/state-master/state-master.service';
import { EmployeeRegistration, EmployeeRegistration_IndexTableFilter, EmployeeRegistration_IndexTableList, EmployeeRegistration_SelectList, EmployeeRegistrationRequest } from './employee-registration';


@Injectable({
  providedIn: 'root',
})
export class EmployeeRegistrationService {
  private endpoint = 'Admin/EmployeeRegistration'

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private countryService: CountryMasterService,
    private stateService: StateMasterService,
    private employeeTypeService: EmployeeTypeMasterService,
    private departmentService: DepartmentMasterService,
    private designationService: DesignationMasterService
  ) { }

  // GetReportingList(model: EmployeeRegistrationSelectListRequest): Observable<ApiListResponse<EmployeeRegistrationSelectListResponse>> {
  //   return this.PopulateList(model);
  // }

  // GetStateList(model: StateMasterSelectListRequest): Observable<ApiListResponse<StateMasterSelectListResponse>> {
  //   return this.stateListService.PopulateList(model);
  // }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{
    stateList: ApiListResponse<State_SelectList>;
    countryList: ApiListResponse<CountryMaster>;
    employeeTypeList: ApiListResponse<EmployeeType_SelectList>;
    departmentList: ApiListResponse<Department_SelectList>;
    designationList: ApiListResponse<Designation_SelectList>;
  }> {
    return forkJoin({
      stateList: this.stateService.PopulateList({ PopulateType: 'SelectList' } as StateRequest),
      countryList: this.countryService.PopulateList({ PopulateType: 'SelectList' } as CountryRequest),
      employeeTypeList: this.employeeTypeService.PopulateList({ PopulateType: 'SelectList' } as EmployeeTypeRequest),
      departmentList: this.departmentService.PopulateList({ PopulateType: "SelectList" } as DepartmentRequest),
      designationList: this.designationService.PopulateList({ PopulateType: 'SelectList' } as EmployeeTypeRequest),
    });
  }

  PopulateList(model: EmployeeRegistrationRequest): Observable<ApiListResponse<EmployeeRegistration_SelectList>> {
    return this.apiService.post<ApiListResponse<EmployeeRegistration_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<EmployeeRegistration_IndexTableFilter>): Observable<ApiPagedListResponse<EmployeeRegistration_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<EmployeeRegistration_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(employeeID: number): Observable<ApiDataResponse<EmployeeRegistration>> {
    return this.apiService.post<ApiDataResponse<EmployeeRegistration>>(`${this.endpoint}/GetDetails?employeeID=${employeeID}`, {});
  }

  CreateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  TerminateEmployee(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Terminate`, model);
  }

  // UploadFile(model: FormData): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/FileUpload`, model);
  // }

  // ResetPassword(model: EmployeeRegistration): Observable<ApiResponse> {
  //   return this.apiService.post<ApiResponse>(`${this.endpoint}/ResetPassword`, model);
  // }

  //#region Form Configuration
  GetFormConfig_DataTableFilter(): DataTableFilterFormConfigType<EmployeeRegistration_IndexTableFilter> {
    return {
      EmployeeCode: '',
      EmployeeName: '',
      MobileNo: '',
      EmployeeTypeID: 0,
      DepartmentID: 0,
      DesignationID: 0,
      CanAccessERP: 2,
      PopulateType: 'PopulateGrid'
    }
  }

  GetFormConfig(): FormConfigType<EmployeeRegistration> {
    return {
      EmployeeID: {
        label: 'Employee ID',
        defaultValue: null,
      },
      EmployeeCode: {
        label: 'Code',
        defaultValue: 'New',
      },
      EmployeePrefix: {
        label: 'Prefix',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Prefix List.',
        },
        type: 'control'
      },
      EmployeeName: {
        label: 'Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Employee Name is Required.',
          maxlength: 'Employee Name cannot be longer than 50 characters.',
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
        label: 'Father/Spouse',
        defaultValue: null,
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
      },
      MobileNo: {
        label: 'Mobile No',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^\+[1-9]\d{1,14}$/)],
        validationMessages: {
          required: 'Mobile No is required.',
          pattern: 'Please provide a correct Mobile No with country code.'
        },
        type: 'control'
      },
      AlternateMobileNo: {
        label: 'Alternate No',
        defaultValue: null,
        validators: [Validators.pattern(/^\+[1-9]\d{1,14}$/)],
        validationMessages: {
          pattern: 'Please provide a correct Alternate Mobile No with country code.'
        },
        type: 'control'
      },
      EmailID: {
        label: 'Email ID',
        defaultValue: null,
        validators: [Validators.pattern('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$')],
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
          requiredIf: 'PIN Code is Required.',
          pattern: 'PIN Code must be a 6-digit number.'
        },
        type: 'control'
      },
      EmergencyContactDetails: {
        label: 'Emergency Contact Details',
        defaultValue: false,
      },
      EmergencyContactName: {
        label: 'Contact Name',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Emergency Contact Name is Required.',
        },
        type: 'control'
      },
      EmergencyContactMobileNo: {
        label: 'Mobile No',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true), Validators.pattern(/^\+[1-9]\d{1,14}$/)],
        validationMessages: {
          requiredIf: 'Emergency Contact Mobile No is Required.',
          pattern: 'Please provide a correct Emergency Contact Mobile No with country code.'
        },
        type: 'control'
      },
      EmergencyContactRelationship: {
        label: 'Relationship',
        defaultValue: null,
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Relationship is Required.',
        },
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
      DOT: {
        label: 'Date of Termination',
        defaultValue: null,
        type: 'control'
      },
      ReasonForTermination: {
        label: "Reason for termination",
        defaultValue: null,
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
      DepartmentID: {
        label: 'Department',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Department List.'
        },
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
      StatusID: {
        label: 'Status ID',
        defaultValue: null
      },
      ReportingTo: {
        label: 'Reporting To',
        defaultValue: null,
      },
      CanApproveEmployeeRequest: {
        label: 'Can Approve Employee Request',
        defaultValue: false,
      },
      CanApproveBillingDiscount: {
        label: 'Can Approve Billing Discount',
        defaultValue: false,
      },
      DisablePayroll: {
        label: 'Disable Payroll',
        defaultValue: false,
      },
      CanAccessERP: {
        label: '',
        defaultValue: false,
      },
      CanAccessEmployeePortal: {
        label: 'Can Access Employee Portal',
        defaultValue: false,
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
      }
    };
  }

  // GetFileUploadConfig(): FormConfigType<EmployeeRegistration_FileUpload> {
  //   return {
  //     FileType: {
  //       label: 'File Type',
  //       defaultValue: 'ConsultantSignatureImage',
  //       validators: [Validators.required],
  //       validationMessages: {
  //         required: 'FileType is Required.',
  //       },
  //       type: 'control'
  //     },
  //     FileName: {
  //       label: 'File Name',
  //       defaultValue: null,
  //       type: 'control'
  //     },
  //     File: {
  //       label: 'File',
  //       defaultValue: null,
  //       validators: [Validators.required],
  //       validationMessages: {
  //         required: 'Please select the Signature Image.',
  //       },
  //       type: 'control'
  //     }
  //   }
  // }
  //#endregion
}


