import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ManufacturerMaster, Manufacturer_IndexTableFilter, Manufacturer_IndexTableList, Manufacturer_SelectList, ManufacturerRequest } from './manufacturer-master';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerMasterService {
  private endpoint = 'IMS/ManufacturerMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: ManufacturerRequest): Observable<ApiListResponse<Manufacturer_SelectList>> {
    return this.apiService.post<ApiListResponse<Manufacturer_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Manufacturer_IndexTableFilter>): Observable<ApiPagedListResponse<Manufacturer_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Manufacturer_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(manufacturerID: number): Observable<ApiDataResponse<ManufacturerMaster>> {
    return this.apiService.post<ApiDataResponse<ManufacturerMaster>>(`${this.endpoint}/GetDetails?ManufacturerID=${manufacturerID}`, {});
  }

  CreateRecord(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Manufacturer_IndexTableFilter> {
    return {
      ManufacturerCode: '',
      ManufacturerName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<ManufacturerMaster> {
    return {
      ManufacturerID: {
        label: '',
        defaultValue: null,
      },
      ManufacturerCode: {
        label: 'Manufacturer Code',
        defaultValue: 'NEW'
      },
      ManufacturerName: {
        label: 'Manufacturer Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Manufacturer Name is required'
        }
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()],
      },
    };
  }
}
