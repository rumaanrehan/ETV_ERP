import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { Country_SelectList, CountryRequest } from '../../settings/country-master/country-master';
import { CountryMasterService } from '../../settings/country-master/country-master.service';
import { Department_SelectList, DepartmentRequest } from '../../settings/department-master/department-master';
import { DepartmentMasterService } from '../../settings/department-master/department-master.service';
import { Designation_SelectList, DesignationRequest } from '../../settings/designation-master/designation-master';
import { DesignationMasterService } from '../../settings/designation-master/designation-master.service';
import { EmployeeType_SelectList, EmployeeTypeRequest } from '../../settings/employee-type-master/employee-type-master';
import { EmployeeTypeMasterService } from '../../settings/employee-type-master/employee-type-master.service';
import { State_SelectList, StateRequest } from '../../settings/state-master/state-master';
import { StateMasterService } from '../../settings/state-master/state-master.service';
import { EmployeeRegistration, EmployeeRegistrationIndexTableRequest, EmployeeRegistrationIndexTableResponse, EmployeeRegistrationSelectListRequest, EmployeeRegistrationSelectListResponse } from './employee-registration';


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
    private employeeTypeService: EmployeeTypeMasterService,
    private departmentService: DepartmentMasterService,
    private designationService: DesignationMasterService,
  ) {
    this.apiUrl = Environment.apiUrl;
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{
    EmployeeTypeList: ApiListResponse<EmployeeType_SelectList>;
    DepartmentList: ApiListResponse<Department_SelectList>;
    DesignationList: ApiListResponse<Designation_SelectList>;
    CountryList: ApiListResponse<Country_SelectList>;
    StateList: ApiListResponse<State_SelectList>;
  }> {
    return forkJoin({
      EmployeeTypeList: this.employeeTypeService.PopulateList({PopulateType: 'SelectList'} as EmployeeTypeRequest),      
      DepartmentList: this.departmentService.PopulateList({PopulateType: 'SelectList'} as DepartmentRequest),
      DesignationList: this.designationService.PopulateList({PopulateType: 'SelectList'} as DesignationRequest),
      CountryList: this.countryService.PopulateList({PopulateType: 'SelectList'} as CountryRequest),
      StateList: this.stateListService.PopulateList({PopulateType: 'SelectList'} as StateRequest),
    });
  }

  /*Page Service Call*/
  PopulateList(model: EmployeeRegistrationSelectListRequest): Observable<ApiListResponse<EmployeeRegistrationSelectListResponse>> {
    return this.apiService.post<ApiListResponse<EmployeeRegistrationSelectListResponse>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<EmployeeRegistrationIndexTableRequest>): Observable<ApiPagedListResponse<EmployeeRegistrationIndexTableResponse>> {
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
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
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
      // CanAccessERP: 2,
      ActiveStatusID: 1,
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
        // disabled: true,
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
  //#endregion
}


