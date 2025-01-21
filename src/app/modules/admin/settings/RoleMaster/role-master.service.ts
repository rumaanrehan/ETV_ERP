import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RoleMaster, RoleMasterList } from './role-master';

@Injectable({
  providedIn: 'root',
})
export class RoleMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<RoleMaster> {
    return {
      RoleID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      RoleCode: {
        label: 'Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      RoleName: {
        label: 'Role Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Role Name is Required.',
          maxlength: 'Role Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion


  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<RoleMasterList>> {
    return this.http.post<ApiPagedListResponse<RoleMasterList>>(`${this.apiUrl}Admin/RoleMaster/PopulateGrid`, tabledata);
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<RoleMasterList>> {
   
    return this.http.post<ApiListResponse<RoleMasterList>>(`${this.apiUrl}Admin/RoleMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  GetDetails(RoleID: number): Observable<ApiTResponse<RoleMaster>> {
    return this.http.post<ApiTResponse<RoleMaster>>(`${this.apiUrl}Admin/RoleMaster/GetDetails?RoleID=${RoleID}`, {});
  }

  CreateRecord(model: RoleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoleMaster/Create`, model);
  }

  UpdateRecord(model: RoleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoleMaster/Edit`, model);
  }

  DeleteRecord(model: RoleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoleMaster/Delete`, model);
  }
}
