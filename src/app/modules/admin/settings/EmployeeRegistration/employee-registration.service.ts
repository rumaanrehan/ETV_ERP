import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { EmployeeRegistration, EmployeeRegistrationIndexTableRequest, EmployeeRegistrationIndexTableResponse, EmployeeRegistrationSelectListRequest, EmployeeRegistrationSelectListResponse, EmployeeRegistrationFileUpload } from './employee-registration';
import { ApiService } from '../../../../core/services/api.service';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../../environments/environment';
import { CountryMasterService } from '../../settings/country-master/country-master.service';
import { DepartmentMasterService } from '../DepartmentMaster/department-master.service';
import { DesignationMasterService } from '../DesignationMaster/designation-master.service';
import { EmployeeTypeMasterService } from '../EmployeeTypeMaster/employee-type-master.service';
import { PrefixMasterService } from '../PrefixMaster/prefix-master.service';
import { RelationshipMasterService } from '../RelationshipMaster/relationship-master.service';
import { RoleMasterService } from '../RoleMaster/role-master.service';
import { StateMasterService } from '../StateMaster/state-master.service';
// import { DesignationMaster_SelectList } from '../DesignationMaster/designation-master';
import { CountryMaster, CountryRequest } from '../country-master/country-master';
import { StateMaster, State_SelectList } from '../StateMaster/state-master';
import { DesignationMaster_SelectList } from '../DesignationMaster/designation-master';
import { DepartmentMaster_SelectList } from '../DepartmentMaster/department-master';
import { EmployeeTypeMaster_SelectList } from '../EmployeeTypeMaster/employee-type-master';
// import { CountryMasterSelectListResponse } from '../../settings/country-master/country-master';


@Injectable({
  providedIn: 'root',
})
export class EmployeeRegistrationService {
  private endpoint = 'Admin/EmployeeRegistration';
  private apiUrl: string;

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private stateListService: StateMasterService,
    private countryService: CountryMasterService,
    private stateService: StateMasterService,
    private prefixMasterService: PrefixMasterService,
    private employeeTypeService: EmployeeTypeMasterService,
    private departmentService: DepartmentMasterService,
    private designationService: DesignationMasterService,
    private relationshipService: RelationshipMasterService,
    private roleMasterService: RoleMasterService,
    private http: HttpClient
  ) {
    this.apiUrl = Environment.apiUrl;
  }

  GetReportingList(model: EmployeeRegistrationSelectListRequest): Observable<ApiListResponse<EmployeeRegistrationSelectListResponse>> {
    return this.PopulateList(model);
  }

  // GetStateList(model: StateMasterSelectListRequest): Observable<ApiListResponse<StateMasterSelectListResponse>> {
  //   return this.stateListService.PopulateList(model);
  // }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{
    // PrefixList: ApiListResponse<PrefixMasterSelectListResponse>;
    // RelationshipList: ApiListResponse<RelationshipMasterSelectListResponse>;
    EmployeeTypeList: ApiListResponse<EmployeeTypeMaster_SelectList>;
    DepartmentList: ApiListResponse<DepartmentMaster_SelectList>;
    DesignationList: ApiListResponse<DesignationMaster_SelectList>;
    // RoleList: ApiListResponse<RoleMasterSelectListResponse>;
    CountryList: ApiListResponse<CountryMaster>;
    StateList: ApiListResponse<State_SelectList>;
    // PermanentCountryList: ApiListResponse<CountryMasterSelectListResponse>;
  }> {
    return forkJoin({
      // PrefixList: this.prefixMasterService.PopulateList("SelectList"),
      // RelationshipList: this.relationshipService.PopulateList("SelectList"),
      EmployeeTypeList: this.employeeTypeService.PopulateList("SelectList"),
      DepartmentList: this.departmentService.PopulateList({ DepartmentTypeID: 0, PopulateType: "MainDepartment" }),
      DesignationList: this.designationService.PopulateList("SelectList"),
      // RoleList: this.roleMasterService.PopulateList("SelectList"),
      CountryList: this.countryService.PopulateList({PopulateType: 'SelectList'} as CountryRequest),
      StateList: this.stateService.PopulateList("SelectList"),
    });
  }

  /*Page Service Call*/
  PopulateList(model: EmployeeRegistrationSelectListRequest): Observable<ApiListResponse<EmployeeRegistrationSelectListResponse>> {
    return this.apiService.post<ApiListResponse<EmployeeRegistrationSelectListResponse>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<EmployeeRegistrationIndexTableRequest>): Observable<ApiPagedListResponse<EmployeeRegistrationIndexTableResponse>> {
    debugger
    if (model.filters?.CanAccessERP == false) {
      model.filters.CanAccessERP = false;
    }
    else if (model.filters?.CanAccessERP == true) {
      model.filters.CanAccessERP = true;
    } else if (model.filters?.CanAccessERP == 2) {
      model.filters.CanAccessERP = null;
    }
    return this.apiService.post<ApiPagedListResponse<EmployeeRegistrationIndexTableResponse>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(EmployeeID: number): Observable<ApiDataResponse<EmployeeRegistration>> {
    return this.apiService.post<ApiDataResponse<EmployeeRegistration>>(`${this.endpoint}/GetDetails?EmployeeID=${EmployeeID}`, {});
  }

  CreateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteRecord(model: EmployeeRegistration): Observable<ApiResponse> {
    debugger;
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  // UploadFile(model: FormData): Observable<ApiResponse> {
  //   return this.apiService.post<ApiResponse>(`${this.endpoint}/FileUpload`, model);
  // }

  UploadFile(model: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeRegistration/FileUpload`, model);
  }

  ResetPassword(model: EmployeeRegistration): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/ResetPassword`, model);
  }

  //#region Form Configuration
  GetFormConfig_DataTableFilter(): DataTableFilterFormConfigType<EmployeeRegistrationIndexTableRequest> {
    return {
      EmployeeCode: '',
      EmployeeName: '',
      MobileNo: '',
      EmployeeTypeID: 0,
      DepartmentID: 0,
      DesignationID: 0,
      CanAccessERP: 2,
      ActiveStatusID: 0,
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
        label: 'Father Spouse',
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
        validators: [Validators.required, Validators.pattern(/^([0]|\+91)?[6-9][0-9]{9}$/)],
        validationMessages: {
          required: 'Mobile No is Required.',
          pattern: 'Please provide correct Mobile No.',
        },
        type: 'control'
      },
      AlternateMobileNo: {
        label: 'Alternate No',
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
      DifferentPermanentAddress: {
        label: 'Different Permanent Address',
        defaultValue: false,
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
        validators: [RequiredIf('DifferentPermanentAddress', Operator.EqualTo, true), Validators.pattern(/^[0-9]{6}$/)],
        validationMessages: {
          requiredIf: 'Permanent PIN Code is Required.',
          pattern: 'Permanent PIN Code must be a 6-digit number.'
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
        validators: [RequiredIf('EmergencyContactDetails', Operator.EqualTo, true), Validators.pattern(/^([0]|\+91)?[6-9][0-9]{9}$/)],
        validationMessages: {
          requiredIf: 'Emergency Contact Mobile No is Required.',
          pattern: 'Please provide correct mobile number.',
        },
        type: 'control'
      },
      EmergencyContactRelationship: {
        label: 'Relationship',
        defaultValue: null,
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
      DesignationID: {
        label: 'Designation',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Designation List.',
        },
        type: 'control'
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
      SMCRegistrationNo: {
        label: 'Registration No',
        defaultValue: null,
      },
      ConsultationCharge: {
        label: 'Consultation Charge',
        defaultValue: null,
      },
      IsSurgeon: {
        label: 'Is Surgeon',
        defaultValue: false,
      },
      IsAnaesthetist: {
        label: ' Is Anaesthetist',
        defaultValue: false,
      },
      IsSuperSpecialist: {
        label: 'Is Super Specialist',
        defaultValue: false,
      },
      IsVisitingConsultant: {
        label: 'Is Visiting Consultant',
        defaultValue: false,
      },
      IsSignatory: {
        label: 'Is Signatory',
        defaultValue: false,
      },
      ConsultantSignatureImagePath: {
        label: 'Consultant Signature Image Path',
        defaultValue: null,
      },
      SignatoryArea: {
        label: 'Signatory Area',
        defaultValue: null,
      },
      CanAccessERP: {
        label: '',
        defaultValue: false,
      },
      CanAccessEmployeePortal: {
        label: 'Can Access Employee Portal',
        defaultValue: false,
      },
      RoleID: {
        label: 'Role',
        defaultValue: null,
        disabled: true,
        validators: [RequiredIf('CanAccessERP', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Role List.',
        },
        type: 'control'
      },
      UserID: {
        label: 'User ID',
        defaultValue: null,
      },
      Password: {
        label: 'Password',
        defaultValue: "*********",
      },
      StatusText: {
        label: 'Status',
        defaultValue: null,
      },
      HexValue: {
        label: '',
        defaultValue: null,
      },
      CanUpdate: {
        label: 'CanUpdate',
        defaultValue: true,
      },
    };
  }

  GetFileUploadConfig(): FormConfigType<EmployeeRegistrationFileUpload> {
    return {
      FileType: {
        label: 'File Type',
        defaultValue: 'ConsultantSignatureImage',
        validators: [Validators.required],
        validationMessages: {
          required: 'FileType is Required.',
        },
        type: 'control'
      },
      FileName: {
        label: 'File Name',
        defaultValue: null,
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
  //#endregion
}


