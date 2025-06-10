import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { StateMaster, StateMaster_IndexTableFilter, StateMaster_IndexTableList, StateMaster_SelectList } from './state-master';

@Injectable({
  providedIn: 'root',
})
export class StateMasterService {
  private endpoint = 'Admin/StateMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(populateType: string): Observable<ApiListResponse<StateMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<StateMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }
  
  PopulateGrid(model: DataTableParams<StateMaster_IndexTableFilter>): Observable<ApiPagedListResponse<StateMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<StateMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
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
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<StateMaster_IndexTableFilter> {
    return {
      StateCode: '',
      StateName: '',
      CountryName: '',
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
      CountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StateName: {
        label: 'State Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'State Name is Required'
        }
      },
      StateGSTCode: {
        label: 'State GST Code',
        defaultValue: null,
        validators: [Validators.maxLength(2)],
        validationMessages: {
          required: 'State GST is Required',
          maxlength: 'State GST Code should be maximum two characters.'
        }
      },
      StateISOCode: {
        label: 'State ISO Code',
        defaultValue: null,
        validators: [Validators.maxLength(2)],
        validationMessages: {
          required: 'State ISO is Required',
          maxlength: 'State ISO Code should be maximum two characters.'
        }
      },
      IsDefault: {
        label: 'Is Default',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion
}