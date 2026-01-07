import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { MenuMaster, MenuMaster_IndexTableFilter, MenuMaster_IndexTableList, MenuMaster_SelectList, MenuMasterRequest } from './menu-master';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {
  private endpoint = 'Admin/MenuMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(model: MenuMasterRequest): Observable<ApiListResponse<MenuMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<MenuMaster_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<MenuMaster_IndexTableFilter>): Observable<ApiPagedListResponse<MenuMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<MenuMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(menuID: number): Observable<ApiDataResponse<MenuMaster>> {
    return this.apiService.post<ApiDataResponse<MenuMaster>>(`${this.endpoint}/GetDetails?menuID=${menuID}`, {});
  }

  CreateRecord(model: MenuMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: MenuMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: MenuMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<MenuMaster_IndexTableFilter> {
    return {
      ModuleName: '',
      MenuType: 0,
      MenuTypeName: '',
      MenuName: '',
      ParentMenuName: '',
      ControllerName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<MenuMaster> {
    return {
      MenuID: {
        label: '',
        defaultValue: null
      },
      ModuleID: {
        label: 'Module',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Module is required'
        }
      },
      MenuType: {
        label: 'Menu Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Menu type is required'
        }
      },
      ParentMenuID: {
        label: 'Parent Menu',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.EqualTo, 3)],
        validationMessages: {
          requiredIf: 'Parent menu is required'
        }
      },
      MenuName: {
        label: 'Menu Name',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.NotEqualTo, 3), Validators.maxLength(100), NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Menu Name is required.',
          maxlength: 'Menu name cannot be longer than 50 characters.'
        }
      },
      ControllerName: {
        label: 'Controller Name',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.EqualTo, 2), Validators.maxLength(100), NotOnlyWhitespaceValidator()],
        validationMessages: {
          requiredIf: 'Controller name is required.',
          maxlength: 'Controller name cannot be longer than 100 characters.'
        }
      },
      ActionName: {
        label: 'Default Action',
        defaultValue: null,
        validators: [Validators.maxLength(100)],
        validationMessages: {
          maxlength: 'Default Action cannot be longer than 100 characters.'
        }
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null
      },
      IsDeveloperOnly: {
        label: 'Only For Developer',
        defaultValue: false
      }
    }
  }
}