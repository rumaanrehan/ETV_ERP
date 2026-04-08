import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ModuleMaster, ModuleMaster_IndexTableFilter, ModuleMaster_IndexTableList, ModuleMaster_IndexTableSort, ModuleMaster_SelectList, ModuleRequest } from './module-master';

@Injectable({
  providedIn: 'root',
})
export class ModuleMasterService {
  private endpoint = 'Admin/ModuleMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(model: ModuleRequest): Observable<ApiListResponse<ModuleMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ModuleMaster_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<ModuleMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ModuleMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ModuleMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(ModuleID: number): Observable<ApiDataResponse<ModuleMaster>> {
    return this.apiService.post<ApiDataResponse<ModuleMaster>>(`${this.endpoint}/GetDetails?ModuleID=${ModuleID}`, {});
  }

  CreateRecord(model: ModuleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ModuleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ModuleMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ModuleMaster_IndexTableFilter> {
    return {
      ModuleCode: '',
      ModuleName: '',
      DisplayOrder: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<ModuleMaster_IndexTableSort> {
    return {
      ModuleCode: {
        label: 'Module Code',
        defaultValue: -1
      },
      ModuleName: {
        label: 'Module Name',
        defaultValue: 0
      }
    }
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<ModuleMaster_IndexTableList> {
    return {
      tableKey: 'Admin_ModuleMaster_IndexTable',
      defaultSortColumn: { sortField: 'ModuleCode', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'ModuleCode', label: 'Code', type: 'text' },
        { field: 'ModuleName', label: 'Module Name', type: 'text' },
        { field: 'DisplayOrder', label: 'Display Order', type: 'number' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'ModuleCode', label: 'Code', enabled: true, order: -1 },
        { field: 'ModuleName', label: 'Module Name', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  getFormConfig(): FormConfigType<ModuleMaster> {
    return {
      ModuleID: {
        label: '',
        defaultValue: null
      },
      ModuleCode: {
        label: 'Module Code',
        defaultValue: ""
      },
      ModuleName: {
        label: 'Module Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Module Name is Required'
        }
      },
      ImagePath: {
        label: 'Image Path',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(100)],
        validationMessages: {
          required: 'Image Path is Required.',
          maxlength: 'Image Path be longer than 100 characters.',
        }
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion
}
