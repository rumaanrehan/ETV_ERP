import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ModuleMaster, ModuleMaster_IndexTableFilter, ModuleMaster_IndexTableList, ModuleMaster_SelectList } from './module-master';

@Injectable({
  providedIn: 'root',
})
export class ModuleMasterService {
  private endpoint = 'Admin/ModuleMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(populateType: string): Observable<ApiListResponse<ModuleMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ModuleMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
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

  getFormConfig(): FormConfigType<ModuleMaster> {
    return {
      ModuleID: {
        label: '',
        defaultValue: null
      },
      ModuleCode: {
        label: 'Code',
        defaultValue: "NEW"
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
