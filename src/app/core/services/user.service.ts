import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiResponse } from '../../shared/models/api-response';
import { FormConfigType } from '../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import { Menu } from '../models/menu';
import { User, UserAccessLogRequest, UserAuthenticateRequest, UserAuthenticateResponse, UserRefreshTokenRequest, UserRolePermissionsList, UserAuthToken } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'User';

  constructor(
    private apiService: ApiService
  ) { }

  Authenticate(request: UserAuthenticateRequest): Observable<ApiDataResponse<UserAuthenticateResponse>> {
    console.log(this.endpoint);
    return this.apiService.post<any>(`${this.endpoint}/Authenticate`, request);
  }

  RefreshToken(request: UserRefreshTokenRequest): Observable<ApiDataResponse<UserAuthToken>> {
    return this.apiService.post<any>(`${this.endpoint}/RefreshToken`, request, true);
  }

  Logout(): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Logout`, {});
  }

  GetProfile(): Observable<ApiDataResponse<User>> {
    return this.apiService.post<ApiDataResponse<User>>(`${this.endpoint}/GetProfile`, {}, true);
  }

  GetMenu(AreaName: string): Observable<ApiListResponse<Menu>> {
    return this.apiService.post<ApiListResponse<Menu>>(`${this.endpoint}/GetMenu?AreaName=${AreaName}`, {}, true);
  }

  GetRolePermissions(): Observable<ApiListResponse<UserRolePermissionsList>> {
    return this.apiService.post<ApiListResponse<UserRolePermissionsList>>(`${this.endpoint}/GetRolePermissions`, {}, true);
  }

  LogAccess(request: UserAccessLogRequest): Observable<boolean> {
    return this.apiService.post<boolean>(`${this.endpoint}/LogAccess`, request);
  }

  //#region Form Configuration
  GetLoginFormConfig(): FormConfigType<UserAuthenticateRequest> {
    return {
      Username: {
        label: 'Username',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Username is Required.',
          maxlength: 'Username cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      Password: {
        label: 'Password',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Username is Required.',
          maxlength: 'Username cannot be longer than 50 characters.'
        },
        type: 'control'
      }
    };
  }
  //#endregion
}
