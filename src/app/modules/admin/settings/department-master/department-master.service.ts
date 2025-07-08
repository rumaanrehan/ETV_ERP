import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Department_IndexTableFilter, Department_IndexTableList, Department_SelectList, DepartmentMaster, DepartmentRequest } from './department-master';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';


@Injectable({
  providedIn: 'root'
})
export class DepartmentMasterService {
  private endpoint = 'Admin/DepartmentMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: DepartmentRequest): Observable<ApiListResponse<Department_SelectList>> {
    return this.apiService.post<ApiListResponse<Department_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Department_IndexTableFilter>): Observable<ApiPagedListResponse<Department_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Department_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
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

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Department_IndexTableFilter> {
    return {
      DepartmentCode: '',
      DepartmentName: '',
      ShortCode: '',
      DepartmentTypeID: 0,
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
        label: 'Department Code',
        defaultValue: 'NEW'
      },
      DepartmentTypeID: {
        label: 'Department Type',
        defaultValue: null,
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Department Name is required'
        }
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: 'NEW'
      },
     
    }
  }
}
