import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { CountryMasterService } from '../country-master/country-master.service';
import { State_IndexTableFilter, State_IndexTableList, State_SelectList, StateMaster, StateRequest } from './state-master';
import { Country_SelectList, CountryRequest } from '../country-master/country-master';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';

@Injectable({
  providedIn: 'root'
})
export class StateMasterService {
  private endpoint = 'Admin/StateMaster';

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

  PopulateList(model: StateRequest): Observable<ApiListResponse<State_SelectList>> {
    return this.apiService.post<ApiListResponse<State_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<State_IndexTableFilter>): Observable<ApiPagedListResponse<State_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<State_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(StateID: number): Observable<ApiDataResponse<StateMaster>> {
    return this.apiService.post<ApiDataResponse<StateMaster>>(`${this.endpoint}/GetDetails?StateID=${StateID}`, {});
  }

  CreateRecord(model: StateMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: StateMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: StateMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<State_IndexTableFilter> {
    return {
      StateCode: '',
      StateName: '',
      CountryID: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<StateMaster> {
    return {
      StateID: {
        label: '',
        defaultValue: null,
      },
      StateCode: {
        label: 'State Code',
        defaultValue: 'NEW'
      },
      StateName: {
        label: 'State Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'State Name is required'
        }
      },
      CountryID:{
        label: 'Country',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please Select Country List'
        }
      },
      StateGSTCode:{
        label: 'State GST Code',
        defaultValue: null,
      },
      StateISOCode:{
        label: 'State ISO Code',
        defaultValue: null,
      }
    }
  }
}
