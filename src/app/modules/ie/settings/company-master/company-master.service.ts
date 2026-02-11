import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Company_IndexTableFilter, Company_IndexTableList, Company_SelectList, CompanyMaster, CompanyRequest } from './company-master';
import { forkJoin, Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { EmailValidator, Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { CountryMasterService } from '../../../admin/settings/country-master/country-master.service';
import { Country_SelectList, CountryRequest } from '../../../admin/settings/country-master/country-master';
import { StateRequest } from '../../../admin/settings/state-master/state-master';
import { StaticListRequest, StaticList } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { StateMasterService } from '../../../admin/settings/state-master/state-master.service';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {
  private endpoint = 'IE/CompanyMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private countryService: CountryMasterService,
    private stateService: StateMasterService,
  ) { }

  GetMasterDropdownLists(): Observable<{
    CountryList: ApiListResponse<Country_SelectList>;
  }> {
    return forkJoin({
      CountryList: this.countryService.PopulateList({ PopulateType: 'SelectList' } as CountryRequest),
    });
  }

  LoadStates(model: StateRequest) {
    return this.stateService.PopulateList(model);
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  PopulateList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.apiService.post<ApiListResponse<Company_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<Company_IndexTableFilter>): Observable<ApiPagedListResponse<Company_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Company_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(CompanyID: number): Observable<ApiDataResponse<CompanyMaster>> {
    return this.apiService.post<ApiDataResponse<CompanyMaster>>(`${this.endpoint}/GetDetails?CompanyID=${CompanyID}`, {});
  }

  CreateRecord(model: CompanyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: CompanyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(CompanyID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?CompanyID=${CompanyID}&${reasonToUpdate}`, {});
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Company_IndexTableFilter> {
    return {
      CompanyCode: '',
      CompanyName: '',
      CompanyTypeID: null,
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<CompanyMaster> {
    return {
      CompanyID: {
        label: '',
        defaultValue: null,
      },
      CompanyCode: {
        label: 'Company Code',
        defaultValue: 'NEW'
      },
      CompanyName: {
        label: 'Company Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Company Name is required'
        },
        type: 'control'
      },
      CompanyTypeID: {
        label: 'Company Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Company Type is required'
        },
        type: 'control'
      },
      CountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Country is required'
        },
        type: 'control'
      },
      StateID: {
        label: 'State',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'State is required'
        },
        type: 'control'
      },
      CompanyContactName: {
        label: 'Contact Name',
        defaultValue: null
      },
      CompanyPhoneNo: {
        label: 'Phone',
        defaultValue: null,
        validators: [Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)],
        validationMessages: {
          pattern: 'Enter a valid phone number'
        },
        type: 'control'
      },
      CompanyEmailID: {
        label: 'Email',
        defaultValue: null,
        validators: [Validators.email],
        validationMessages: {
          email: 'Enter a valid email address'
        },
        type: 'control'
      },
      ImportLicenseNo: {
        label: 'Import License No',
        defaultValue: null
      },
      GSTNo: {
        label: 'GST No',
        defaultValue: null,
        validators: [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid GST No"
        },
        type: 'control'
      },
      TANNo: {
        label: 'TAN No',
        defaultValue: null,
        validators: [Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid TAN No"
        },
        type: 'control'
      },
      PANNo: {
        label: 'PAN No',
        defaultValue: null,
        validators: [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid PAN No"
        },
        type: 'control'
      },
      BillingAddress: {
        label: 'Billing Address',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(500), NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: "Billing Address is required",
          maxlength: "Billing Address cannot exceed 500 characters"
        },
        type: 'control'
      },
      IsShippingAddressSameAsBillingAddress: {
        label: 'Is Shipping Address Same As Billing Address',
        defaultValue: true
      },
      ShippingAddress: {
        label: 'Shipping Address',
        defaultValue: null,
        validators: [RequiredIf('IsShippingAddressSameAsBillingAddress', Operator.EqualTo, false), Validators.maxLength(500), NotOnlyWhitespaceValidator()],
        validationMessages: {
          requiredIf: "Shipping Address is required when it is not same as Billing Address",
          maxlength: "Shipping Address cannot exceed 500 characters"
        },
        type: 'control'
      }
    };
  }
}
