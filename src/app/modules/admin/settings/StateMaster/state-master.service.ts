import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
// import { StateMaster, StateMaster_IndexTableFilter, StateMaster_IndexTableList, StateMaster_SelectList } from './employee-type-master';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { StateMaster, StateMaster_IndexTableFilter, StateMaster_IndexTableList, StateMaster_SelectList } from './state-master';
// import { StateMaster_IndexTableFilter } from './state-master';

@Injectable({
  providedIn: 'root'
})
export class StateMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<StateMaster_IndexTableFilter> {
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

  PopulateList(PopulateType: string): Observable<ApiListResponse<StateMaster_SelectList>> {
    return this.http.post<ApiListResponse<StateMaster_SelectList>>(`${this.apiUrl}Admin/StateMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<StateMaster_IndexTableFilter>): Observable<ApiPagedListResponse<StateMaster_IndexTableList>> {      
      return this.http.post<ApiPagedListResponse<StateMaster_IndexTableList>>(`${this.apiUrl}Admin/StateMaster/PopulateGrid`, model);
    }

  GetDetails(StateID: number): Observable<ApiDataResponse<StateMaster>> {
    return this.http.post<ApiDataResponse<StateMaster>>(`${this.apiUrl}Admin/StateMaster/GetDetails?StateID=${StateID}`, {});
  }

  CreateRecord(model: StateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Create`, model);
  }

  UpdateRecord(model: StateMaster): Observable<ApiResponse> {
    debugger;
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Edit`, model);
  }

  DeleteReactivate(model: StateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Delete`, model);
  }



}
