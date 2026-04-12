import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RoleMaster, RoleMaster_IndexTableFilter, RoleMaster_IndexTableList, RoleMaster_IndexTableSort, RoleMaster_SelectList } from './role-master';

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

  DeleteReactivate(RoleID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?roleID=${RoleID}&reasonToUpdate=${reasonToUpdate}`, {});
  }
  
 //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<RoleMaster_IndexTableFilter> {
    return {
      RoleCode: '',
      RoleName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<RoleMaster_IndexTableSort> {
    return {
      RoleCode: {
        label: 'Code',
        defaultValue: -1
      },
      RoleName: {
        label: 'Role Name',
        defaultValue: 0
      }
    };
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<RoleMaster_IndexTableList> {
    return {
      tableKey: 'Admin_RoleMaster_IndexTable',
      defaultSortColumn: { sortField: 'RoleCode', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'RoleCode', label: 'Code', type: 'text' },
        { field: 'RoleName', label: 'Role Name', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'RoleCode', label: 'Code', enabled: true, order: -1 },
        { field: 'RoleName', label: 'Role Name', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
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
