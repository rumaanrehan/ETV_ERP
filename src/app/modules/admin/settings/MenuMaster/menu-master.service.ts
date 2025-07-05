import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { MenuMaster, MenuMaster_IndexTableFilter, MenuMaster_IndexTableList, MenuMaster_SelectList } from './menu-master';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {
  private endpoint = 'Admin/MenuMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  //PopulateList(MenuID: number, ModuleID: number, MenuType: number, GroupMenuID: number, ParentMenuName: string, MenuName: string, ControllerName: string, PopulateType: any): Observable<ApiListResponse<MenuMasterList>> {
  //  return this.http.post<ApiListResponse<MenuMasterList>>(`${this.apiUrl}Admin/MenuMaster/PopulateList?MenuID=${MenuID}&ModuleID=${ModuleID}&MenuType=${MenuType}&GroupMenuID=${GroupMenuID}&ParentMenuName=${ParentMenuName}&MenuName=${MenuName}&ControllerName=${ControllerName}&PopulateType=${PopulateType}`, {});
  //}

  PopulateList(MenuID: number, ModuleID: number, MenuType: number, GroupMenuID: number, ParentMenuName: string, MenuName: string, ControllerName: string, PopulateType: any): Observable<ApiListResponse<MenuMaster_SelectList>> {
    ParentMenuName = ParentMenuName || ''; MenuName = MenuName || ''; ControllerName = ControllerName || ''; GroupMenuID = GroupMenuID || 0;
    return this.apiService.post<ApiListResponse<MenuMaster_SelectList>>(`${this.endpoint}/PopulateList?MenuID=${MenuID}&ModuleID=${ModuleID}&MenuType=${MenuType}&GroupMenuID=${GroupMenuID}&ParentMenuName=${ParentMenuName}&MenuName=${MenuName}&ControllerName=${ControllerName}&PopulateType=${PopulateType}`,{});
  }

  PopulateGrid(model: DataTableParams<MenuMaster_IndexTableFilter>): Observable<ApiPagedListResponse<MenuMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<MenuMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  GetDetails(menuID: number): Observable<ApiDataResponse<MenuMaster>> {
    return this.apiService.post<ApiDataResponse<MenuMaster>>(`${this.endpoint}/GetDetails?TaxSlabID=${menuID}`, {});
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
      MenuTypeName: '',
      ParentMenuName: '',
      MenuName: '',
      ControllerName: '',
      ActiveStatusID: 0
    }
  }
  
  getFormConfig(): FormConfigType<MenuMaster> {
    return {
      MenuID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ModuleID: {
        label: 'Module',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Module List.'
        },
        type: 'control'
      },
      MenuType: {
        label: 'Menu Type',
        defaultValue: 2,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Menu Type List.'
        },
        type: 'control'
      },
      GroupMenuID: {
        label: 'Group Menu',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.GreaterThanOrEqualTo, 2)],
        validationMessages: {
          requiredIf: 'Please select an option from the Group Menu List.'
        },
        type: 'control'
      },
      ParentMenuID: {
        label: 'Parent Menu',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.EqualTo, 3)],
        validationMessages: {
          requiredIf: 'Please select an option from the Parent Menu List.'
        },
        type: 'control'
      },
      MenuName: {
        label: 'Menu Name',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(50)],
        validationMessages: {
          required: 'Module Name is Required.',
          maxlength: 'Module  name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ControllerName: {
        label: 'Controller Name',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.GreaterThanOrEqualTo, 2), NotOnlyWhitespaceValidator()],
        validationMessages: {
          requiredIf: 'Controller Name is Required.',
        },
        type: 'control'
      },
      ActionName: {
        label: 'Default Action',
        defaultValue: null,
        validators: [RequiredIf('MenuType', Operator.EqualTo, 2)],
        validationMessages: {
          requiredIf: 'Default Action Name is Required.',
        },
        type: 'control'
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      IsDeveloperOnly: {
        label: 'Only For Developer',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      }
    }
  }
}