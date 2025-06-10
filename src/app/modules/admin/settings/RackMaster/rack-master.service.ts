import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RackMaster, RackMaster_IndexTableFilter, RackMaster_IndexTableList, RackMaster_SelectList } from './rack-master';

@Injectable({
  providedIn: 'root'
})
export class RackMasterService {
  private endpoint = 'Admin/RackMaster';

  constructor(
    private apiService: ApiService,
  ) {}
  
  PopulateList(populateType: string): Observable<ApiListResponse<RackMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<RackMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }
  
  PopulateGrid(model: DataTableParams<RackMaster_IndexTableFilter>): Observable<ApiPagedListResponse<RackMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<RackMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(RackID: number): Observable<ApiDataResponse<RackMaster>> {
    return this.apiService.post<ApiDataResponse<RackMaster>>(`${this.endpoint}/GetDetails?RackID=${RackID}`, {});
  }

  CreateRecord(model: RackMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: RackMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: RackMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<RackMaster_IndexTableFilter> {
    return {
      RackCode: '',
      RackName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<RackMaster> {
    return {
      RackCode: {
        label: 'Rack Code',
        defaultValue: 'NEW'
      },
      StoreID: {
        label: 'Store',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      RackName: {
        label: 'Rack Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Rack Name is Required'
        }
      }
    };
  }
  //#endregion
}
