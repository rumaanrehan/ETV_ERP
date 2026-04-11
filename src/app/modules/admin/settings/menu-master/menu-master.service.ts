import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { MenuMaster, MenuMaster_IndexTableFilter, MenuMaster_IndexTableList, MenuMaster_IndexTableSort, MenuMaster_SelectList, MenuMasterRequest } from './menu-master';

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

  getFormConfig_DataTableSort(): FormConfigType<MenuMaster_IndexTableSort> {
    return {
      MenuType: {
        label: 'Menu Type',
        defaultValue: -1
      },
      MenuName: {
        label: 'Menu Name',
        defaultValue: 0
      },
      ModuleName: {
        label: 'Module',
        defaultValue: 0
      }
    };
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<MenuMaster_IndexTableList> {
    return {
      tableKey: 'Admin_MenuMaster_IndexTable',
      defaultSortColumn: { sortField: 'MenuType', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'ModuleName', label: 'Module', type: 'text' },
        { field: 'MenuTypeName', label: 'Menu Type', type: 'text' },
        { field: 'MenuName', label: 'Menu Name', type: 'text' },
        { field: 'ParentMenuName', label: 'Parent', type: 'text' },
        { field: 'ControllerName', label: 'Controller', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'MenuType', label: 'Menu Type', enabled: true, order: -1 },
        { field: 'MenuName', label: 'Menu Name', enabled: true, order: 0 },
        { field: 'ModuleName', label: 'Module', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
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
