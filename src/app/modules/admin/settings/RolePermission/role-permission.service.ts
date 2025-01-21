import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { RoleMaster_RolePermission } from './role-permission';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<RoleMaster_RolePermission> {
    return {
      RoleID: {
        label: 'Role Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Role List.'
        },
        type: 'control'
      },
      ModuleID: {
        label: 'Module Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Module List.'
        },
        type: 'control'
      },
      RoleMapping: {
        type: 'array',
        items: {
          MenuID: {
            label: 'Menu Name',
            defaultValue: null,
            validators: [],
            validationMessages: {
            },
            type: 'control'
          },
          GroupMenuName: {
            label: 'Group Name',
            defaultValue: null,
            validators: [],
            validationMessages: {
            },
            type: 'control'
          },
          MenuName: {
            label: 'Menu Name',
            defaultValue: null,
            validators: [],
            validationMessages: {
            },
            type: 'control'
          },
          AccessControlName: {
            label: 'Access Name',
            defaultValue: null,
            validators: [],
            validationMessages: {
            },
            type: 'control'
          },
          CanRead: {
            label: 'Can Read',
            defaultValue: false,
            type: 'control'
          },
          CanCreate: {
            label: 'Can Create',
            defaultValue: false,
            type: 'control'
          },
          CanUpdate: {
            label: 'Can Update',
            defaultValue: false,
            type: 'control'
          },
          CanDelete: {
            label: 'Can Delete',
            defaultValue: false,
            type: 'control'
          }
        }
      }
    };
  }

  //#endregion

  //GetDetailsRolePermission(RoleID: number | null, ModuleID: number | null): Observable<ApiListResponse<RoleMaster_RolePermission>> {
  //  return this.http.post<ApiListResponse<RoleMaster_RolePermission>>(`${this.apiUrl}Admin/RoleMaster/GetDetailsRolePermission${RoleID != null ? `?RoleID=${RoleID}` : ''}${RoleID != null && ModuleID != null ? `&ModuleID=${ModuleID}` : (ModuleID != null ? `?ModuleID=${ModuleID}` : '')}`, {});
  //}

  GetDetailsRolePermission(RoleID: number, ModuleID: number): Observable<ApiListResponse<RoleMaster_RolePermission>> {
    return this.http.post<ApiListResponse<RoleMaster_RolePermission>>(`${this.apiUrl}Admin/RoleMaster/GetDetailsRolePermission?RoleID=${RoleID}&ModuleID=${ModuleID}`, {});
  }

  UpdateRecord(model: RoleMaster_RolePermission): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoleMaster/RolePermission_Edit`, model);
  }
}
