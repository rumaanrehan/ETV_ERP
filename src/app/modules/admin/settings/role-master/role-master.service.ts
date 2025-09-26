import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RoleMaster, RoleMaster_IndexTableFilter, RoleMaster_IndexTableList, RoleMaster_SelectList } from './role-master';

@Injectable({
  providedIn: 'root',
})
export class RoleMasterService {
  private endpoint = 'Admin/RoleMaster';

  constructor(
    private apiService: ApiService,
  ) {}
 
  PopulateList(populateType: any): Observable<ApiListResponse<RoleMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<RoleMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }

  PopulateGrid(model: DataTableParams<RoleMaster_IndexTableFilter>): Observable<ApiPagedListResponse<RoleMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<RoleMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(roleID: number): Observable<ApiDataResponse<RoleMaster>> {
    return this.apiService.post<ApiDataResponse<RoleMaster>>(`${this.endpoint}/GetDetails?RoleID=${roleID}`, {});
  }

  CreateRecord(model: RoleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: RoleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: RoleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
 //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<RoleMaster_IndexTableFilter> {
    return {
      RoleCode: '',
      RoleName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<RoleMaster> {
    return {
      RoleID: {
        label: '',
        defaultValue: null,
      },
      RoleCode: {
        label: 'Tax Slab Code',
        defaultValue: 'NEW'
      },
      RoleName: {
        label: 'Role Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Role Name is required'
        }
      },
    }
  }
  //#endregion
}
