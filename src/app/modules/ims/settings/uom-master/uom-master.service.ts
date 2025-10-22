import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UOMMaster, UOMRequest, UOM_Details, UOM_IndexTableFilter, UOM_IndexTableList, UOM_SelectList } from './uom-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class UOMMasterService {
  private endpoint = 'IMS/UOMMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: UOMRequest): Observable<ApiListResponse<UOM_SelectList>> {
    return this.apiService.post<ApiListResponse<UOM_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }
  
  PopulateGrid(model: DataTableParams<UOM_IndexTableFilter>): Observable<ApiPagedListResponse<UOM_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<UOM_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(UOMID: number): Observable<ApiDataResponse<UOM_Details>> {
    return this.apiService.post<ApiDataResponse<UOM_Details>>(`${this.endpoint}/GetDetails?UOMID=${UOMID}`, {});
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
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<UOM_IndexTableFilter> {
    return {
      UOMCode: '',
      UOMName: '',
      ActiveStatusID: 0
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
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()]
      },
    };
  }
}