import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { Environment } from '../../../../../environments/environment';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DepartmentMaster_IndexTableFilter, DepartmentMaster, DepartmentMaster_SelectList, DepartmentMaster_IndexTableList } from './department-master';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMasterService {
  private endpoint: string = 'Admin/DepartmentMaster';

  constructor(private apiService: ApiService) {
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<DepartmentMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<DepartmentMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<DepartmentMaster_IndexTableFilter>): Observable<ApiPagedListResponse<DepartmentMaster_IndexTableList>> {      
      return this.apiService.post<ApiPagedListResponse<DepartmentMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
    }

  GetDetails(DepartmentID: number): Observable<ApiDataResponse<DepartmentMaster>> {
    return this.apiService.post<ApiDataResponse<DepartmentMaster>>(`${this.endpoint}/GetDetails?DepartmentID=${DepartmentID}`, {});
  }

  CreateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DepartmentMaster_IndexTableFilter> {
    return {
      DepartmentCode: '',
      DepartmentName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<DepartmentMaster> {
    return {
      DepartmentID: {
        label: '',
        defaultValue: null,
      },
      DepartmentCode: {
        label: 'Code',
        defaultValue: 'NEW',
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Department Name is Required.',
          maxlength: 'Department name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
     
    }
  }
}
