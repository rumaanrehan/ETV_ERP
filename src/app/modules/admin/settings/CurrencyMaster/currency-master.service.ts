import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { CountryMasterService } from '../country-master/country-master.service';
import { Country_SelectList, CountryRequest } from '../country-master/country-master';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { CurrencyRequest, Currency_SelectList, Currency_IndexTableFilter, Currency_IndexTableList, CurrencyMaster } from './currency-master';

@Injectable({
  providedIn: 'root'
})
export class CurrencyMasterService {
  private endpoint = 'Admin/CurrencyMaster';

  constructor(
    private apiService: ApiService,
    private countryMasterService: CountryMasterService,
  ) {}

  GetMasterDropdownLists(): Observable<{ 
    countryList: ApiListResponse<Country_SelectList>;
    }> {
    return forkJoin({
      countryList: this.countryMasterService.PopulateList({PopulateType: 'SelectList'} as CountryRequest),
    });
  }

  PopulateList(model: CurrencyRequest): Observable<ApiListResponse<Currency_SelectList>> {
    return this.apiService.post<ApiListResponse<Currency_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Currency_IndexTableFilter>): Observable<ApiPagedListResponse<Currency_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Currency_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  

  GetDetails(CurrencyID: number): Observable<ApiDataResponse<CurrencyMaster>> {
    return this.apiService.post<ApiDataResponse<CurrencyMaster>>(`${this.endpoint}/GetDetails?CurrencyID=${CurrencyID}`, {});
  }

  CreateRecord(model: CurrencyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: CurrencyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: CurrencyMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Currency_IndexTableFilter> {
    return {
      CurrencyCode: '',
      CurrencyName: '',
      CountryName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<CurrencyMaster> {
    return {
      CurrencyID: {
        label: '',
        defaultValue: null,
      },
      CurrencyCode: {
        label: 'Currency Code',
        defaultValue: 'NEW'
      },
      CurrencyName: {
        label: 'Currency Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Currency Name is required'
        }
      },
       CurrencySymbol: {
        label: 'Currency Symbol',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Currency Name is required'
        }
      },

      CountryID:{
        label: 'Country',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Country is required'
        }
      },
     
      CurrencyISOCode:{
        label: 'Currency ISO Code',
        defaultValue: null,
      }
    }
  }
}
