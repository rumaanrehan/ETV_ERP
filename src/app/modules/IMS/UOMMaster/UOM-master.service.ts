import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { UOMMaster, UOMMaster_IndexTableFilter, UOMMaster_IndexTableList, UOMMaster_SelectList } from './UOM-master';

@Injectable({
  providedIn: 'root'
})
export class UOMMasterService {
  private endpoint = 'IMS/UOMMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(populateType: any): Observable<ApiListResponse<UOMMaster_SelectList>> {
    console.log("Fetching List From UOMMasterService");
    return this.apiService.post<ApiListResponse<UOMMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${populateType}`, {} );
  }
  
  PopulateGrid(model: DataTableParams<UOMMaster_IndexTableFilter>): Observable<ApiPagedListResponse<UOMMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<UOMMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(UOMID: number): Observable<ApiDataResponse<UOMMaster>> {
    return this.apiService.post<ApiDataResponse<UOMMaster>>(`${this.endpoint}/GetDetails?UOMID=${UOMID}`, {});
  }

  CreateRecord(model: UOMMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: UOMMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: UOMMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<UOMMaster_IndexTableFilter> {
    return {
      UOMCode: '',
      UOMName: '',
      ActiveStatus: 0
    }
  }

  getFormConfig(): FormConfigType<UOMMaster> {
    return {
      UOMID: {
        label: '',
        defaultValue: null,
      },
      UOMCode: {
        label: 'UOM Code',
        defaultValue: 'NEW'
      },
      UOMName: {
        label: 'UOM Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'UOM Name is required'
        }
      },
    };
  }
}
