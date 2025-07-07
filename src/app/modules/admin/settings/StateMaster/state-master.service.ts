import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StateMaster, State_IndexTableFilter, State_IndexTableList, State_SelectList } from './state-master';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../core/services/api.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
@Injectable({
  providedIn: 'root'
})
export class StateMasterService {
  private endpoint: string = 'Admin/StateMaster';
  
  constructor(private apiService: ApiService) {
  }  

  PopulateList(PopulateType: string): Observable<ApiListResponse<State_SelectList>> {
    return this.apiService.post<ApiListResponse<State_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${PopulateType}`, {});
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
    debugger;
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: StateMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<State_IndexTableFilter> {
    return {
      StateCode: '',
      StateName: '',
      CountryID: 0,
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<StateMaster> {
    return {
      StateID: {
        label: '',
        defaultValue: null,
      },
      StateCode: {
        label: 'Code',
        defaultValue: 'NEW',
      },
      StateName: {
        label: 'State Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'State Name is Required.',
          maxlength: 'State name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      CountryID: {
        label: 'Country Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select Country.'
        },
        type: 'control'
      },
    }
  }
}
