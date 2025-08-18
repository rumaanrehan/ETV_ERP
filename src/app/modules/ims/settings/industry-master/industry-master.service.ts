import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IndustryMaster, IndustryMaster_IndexTableFilter, IndustryMaster_IndexTableList } from './industry-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class IndustryMasterService {
  private endpoint = 'Admin/IndustryMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateGrid(model: DataTableParams<IndustryMaster_IndexTableFilter>): Observable<ApiPagedListResponse<IndustryMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<IndustryMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(industryID: number): Observable<ApiDataResponse<IndustryMaster>> {
    return this.apiService.post<ApiDataResponse<IndustryMaster>>(`${this.endpoint}/GetDetails?IndustryID=${industryID}`, {});
  }

  CreateRecord(model: IndustryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: IndustryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: IndustryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<IndustryMaster_IndexTableFilter> {
    return {
      IndustryCode: '',
      IndustryName: '',
      ActiveStatus: 0
    }
  }

  getFormConfig(): FormConfigType<IndustryMaster> {
    return {
      IndustryID: {
        label: '',
        defaultValue: null,
      },
      IndustryCode: {
        label: 'Industry Code',
        defaultValue: 'NEW'
      },
      IndustryName: {
        label: 'Industry Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Industry Name is required'
        }
      },
      ActiveStatus: {
        label: 'Active Status',
        defaultValue: true,
        validators: [],
        validationMessages: {},
      },
    };
  }
}
