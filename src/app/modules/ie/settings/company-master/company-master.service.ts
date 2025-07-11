import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Company_IndexTableFilter, Company_IndexTableList, Company_SelectList, CompanyMaster, CompanyRequest, State_SelectList } from './company-master';
import { forkJoin, Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { CountryMasterService } from '../../../admin/settings/country-master/country-master.service';
import { Country_SelectList, CountryMaster, CountryRequest } from '../../../admin/settings/country-master/country-master';
import { StateRequest } from '../../../admin/settings/state-master/state-master';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {
  private endpoint = 'IE/CompanyMaster';
  
  constructor(
    private apiService: ApiService,
    private countryService: CountryMasterService,
    
  ) {}

    GetMasterDropdownLists(): Observable<{  
      CountryList: ApiListResponse<Country_SelectList>;
      
      }> {
   return forkJoin({
      CountryList: this.countryService.PopulateList({PopulateType: 'SelectList'} as CountryRequest),


    });
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

  DeleteReactivate(model: CompanyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
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
        }
      },
      CompanyTypeID: {
        label: 'Company Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Company Type is required'
        }
      },
      CountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Country is required'
        }
      },
      StateID: {
        label: 'State',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'State is required'
        }
      },
      CompanyPhoneNo: {
        label: 'Phone',
        defaultValue: null
      },
      CompanyEmailID: {
        label: 'Email',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Email is required'
        }
      },
      ImportLicenseNo: {
        label: 'Import License No',
        defaultValue: null,
        validators: [Validators.pattern(/^[0-9]{10}$/), RequiredIf("CompanyTypeID", Operator.EqualTo, 1)],
        validationMessages: {
          pattern: "Enter a valid Import License No",
          RequiredIf: "Import License No is required"
        }
      },
      GSTNo: {
        label: 'GST No',
        defaultValue: null,
        validators: [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid GST No"
        }
      },
      TANNo: {
        label: 'TAN No',
        defaultValue: null,
        validators: [Validators.pattern(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid TAN No"
        }
      },
      PANNo: {
        label: 'PAN No',
        defaultValue: null,
        validators: [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)],
        validationMessages: {
          pattern: "Enter a valid PAN No"
        }
      },
      BillingAddress: {
        label: 'Billing Address',
        defaultValue: null
      },
      ShippingAddress: {
        label: 'Shipping Address',
        defaultValue: null
      }
    };
  }
}
