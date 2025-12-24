import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { RoleMaster_RolePermission } from './role-permission';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private endpoint = 'Admin/RoleMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  GetDetailsRolePermission(roleID: number, moduleID: number): Observable<ApiDataResponse<RoleMaster_RolePermission>> {
    return this.apiService.post<ApiDataResponse<RoleMaster_RolePermission>>(`${this.endpoint}/GetDetailsRolePermission?RoleID=${roleID}&ModuleID=${moduleID}`, {});
  }

  UpdateRecord(model: RoleMaster_RolePermission): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/UpdateRolePermission`, model);
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
}
