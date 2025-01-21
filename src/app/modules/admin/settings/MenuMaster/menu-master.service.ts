import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { MenuMaster, MenuMasterList } from './menu-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
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

  //PopulateList(MenuID: number, ModuleID: number, MenuType: number, GroupMenuID: number, ParentMenuName: string, MenuName: string, ControllerName: string, PopulateType: any): Observable<ApiListResponse<MenuMasterList>> {
  //  return this.http.post<ApiListResponse<MenuMasterList>>(`${this.apiUrl}Admin/MenuMaster/PopulateList?MenuID=${MenuID}&ModuleID=${ModuleID}&MenuType=${MenuType}&GroupMenuID=${GroupMenuID}&ParentMenuName=${ParentMenuName}&MenuName=${MenuName}&ControllerName=${ControllerName}&PopulateType=${PopulateType}`, {});
  //}

  PopulateList(MenuID: number, ModuleID: number, MenuType: number, GroupMenuID: number, ParentMenuName: string, MenuName: string, ControllerName: string, PopulateType: any): Observable<ApiListResponse<MenuMasterList>> {
    ParentMenuName = ParentMenuName || ''; 
    MenuName = MenuName || ''; 
    ControllerName = ControllerName || ''; 
    GroupMenuID = GroupMenuID || 0;
    return this.http.post<ApiListResponse<MenuMasterList>>(
      `${this.apiUrl}Admin/MenuMaster/PopulateList?MenuID=${MenuID}&ModuleID=${ModuleID}&MenuType=${MenuType}&GroupMenuID=${GroupMenuID}&ParentMenuName=${ParentMenuName}&MenuName=${MenuName}&ControllerName=${ControllerName}&PopulateType=${PopulateType}`,
      {}
    );
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<MenuMasterList>> {
    return this.http.post<ApiPagedListResponse<MenuMasterList>>(`${this.apiUrl}Admin/MenuMaster/PopulateGrid`, tabledata);
  }

  GetDetails(MenuID: number): Observable<ApiDataResponse<MenuMaster>> {
    return this.http.post<ApiDataResponse<MenuMaster>>(`${this.apiUrl}Admin/MenuMaster/GetDetails?MenuID=${MenuID}`, {});
  }

  CreateRecord(model: MenuMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/MenuMaster/Create`, model);
  }

  UpdateRecord(model: MenuMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/MenuMaster/Edit`, model);
  }

  DeleteRecord(model: MenuMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/MenuMaster/Delete`, model);
  }

}
