import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Country_SelectList, CountryRequest } from '../../modules/admin/settings/country-master/country-master';
import { CountryMasterService } from '../../modules/admin/settings/country-master/country-master.service';
import { State_SelectList, StateRequest } from '../../modules/admin/settings/state-master/state-master';
import { StateMasterService } from '../../modules/admin/settings/state-master/state-master.service';
import { ApiDataResponse, ApiListResponse, ApiResponse } from '../../shared/models/api-response';
import { FormConfigType } from '../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import { Menu } from '../models/menu';
import { OrganizationSettings, User, UserAccessLogRequest, UserAuthenticateRequest, UserAuthenticateResponse, UserAuthToken, UserProfile, UserRefreshTokenRequest, UserRolePermissionsList } from '../models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'User';

  constructor(
    private apiService: ApiService,
    private stateService: StateMasterService,
    private countryService: CountryMasterService,
    private http: HttpClient
  ) { }
  
  GetCountryList(): Observable<{countryList: ApiListResponse<Country_SelectList>;}> {
    return forkJoin({ countryList: this.countryService.PopulateList({ PopulateType: 'SelectList' } as CountryRequest),});
  }
  
  GetStateList(countryID: number): Observable<{stateList: ApiListResponse<State_SelectList>;}> {
    return forkJoin({ stateList: this.stateService.PopulateList({ PopulateType: 'SelectList', CountryID: countryID } as StateRequest),});
  }

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

  UpdatePassword(model: UserProfile): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/UpdatePassword`, model);
  }

  GetProfile(): Observable<ApiDataResponse<User>> {
    return this.apiService.post<ApiDataResponse<User>>(`${this.endpoint}/GetProfile`, {}, true);
  }

  GetOrganizationDetails(): Observable<ApiDataResponse<OrganizationSettings>> {
    console.log(this.endpoint);
    return this.apiService.post<ApiDataResponse<OrganizationSettings>>(`${this.endpoint}/GetOrganizationDetails`, {}, true);
  }

  UpdateOrganizationDetails(model: OrganizationSettings): Observable<ApiResponse> {    
    return this.apiService.post<ApiResponse>(`${this.endpoint}/UpdateOrganizationDetails`, model);
  }
  
  UploadOrganizationLogo(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`http://localhost:44316/api/${this.endpoint}/UploadOrganizationLogo`, formData);
  }
  
  RemoveOrganizationLogo(): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/RemoveOrganizationLogo`, {});
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

  GetUserProfileFormConfig(): FormConfigType<UserProfile> {
    return {
      UserFullName: {
        label: 'User Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Username is Required.',
          maxlength: 'Username cannot be longer than 50 characters.'
        },
      },
      OldPassword: {
        label: 'Old Password',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.minLength(8),],
        validationMessages: {
          required: 'Please enter Old Password',
          minlength: 'Old password must be at least 8 characters.'
        },
        type:'control'
      },
      
      NewPassword: {
        label: 'New Password',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.minLength(8)],
        validationMessages: {
          required: 'Please enter New Password',
          minlength: 'New password must be at least 8 characters.'
        },
        type:'control'
      },

      ConfirmPassword: {
        label: 'Confirm Password',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.minLength(8)],
        validationMessages: {
          required: 'Please re-enter the new password.',
          minlength: 'New password must be at least 8 characters.'
        },
        type:'control'
      }
    };
  }

  GetOrganizationSettingsFormConfig(): FormConfigType<OrganizationSettings> {
    return {
      OrganizationID: {
        label: 'Organization ID',
        defaultValue: null
      },
      OrganizationName: {
        label: 'Organization Name',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(100)],
        validationMessages: {
          required: 'Organization Name is required',
          maxlength: 'Organization Name must not exceed 100 characters'
        }
      },
      OrganizationLogoUrl: {
        label: 'Organization Logo URL',
        defaultValue: null
      },
      OrganizationWebsite: {
        label: 'Website',
        defaultValue: null,
        validators: [Validators.maxLength(2083)],
        validationMessages: {
          maxlength: 'Website must not exceed 2083 characters'
        }
      },
      CINNumber: {
        label: 'CIN Number',
        defaultValue: null,
        validators: [Validators.required , Validators.pattern(/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/)],
        validationMessages: {
          maxlength: 'Enter valid CIN Number'
        }
      },
      PANNumber: {
        label: 'PAN Number',
        defaultValue: null,
        validators: [Validators.required , Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
        validationMessages: {
          required: 'GST Number is required',
          pattern: 'Enter valid PAN Number'
        }
      },
      IECNumber: {
        label: 'IEC Number',
        defaultValue: null,
        validators: [Validators.required , Validators.pattern(/^[0-9]{10}$/)],
        validationMessages: {
          required: 'GST Number is required',
          pattern: 'Enter valid IEC Number'
        }
      },
      GSTNumber: {
        label: 'GST Number',
        defaultValue: null,
        validators: [Validators.required , Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)],
        validationMessages: {
          required: 'GST Number is required',
          pattern: 'Enter valid GST Number'
        }
      },
      CRNumber: {
        label: 'CR Number',
        defaultValue: null,
        validators: [Validators.required , Validators.maxLength(20), Validators.pattern(/^[A-Z0-9\-]{8,20}$/)],
        validationMessages: {
          required: 'GST Number is required',
          pattern: 'Enter valid CR Number',
        }
      },
      Industry: {
        label: 'Industry',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(100)],
        validationMessages: {
          required: 'Industry is required',
          maxlength: 'Industry must not exceed 100 characters'
        }
      },
      Address: {
        label: 'Address',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(500)],
        validationMessages: {
          required: 'Address is required',
          maxlength: 'Address must not exceed 500 characters'
        }
      },
      CountryID: {
        label: 'Country',
        defaultValue: null,
      },
      StateID: {
        label: 'State',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'State is required',
        }
      },
      PostalCode: {
        label: 'Postal Code',
        defaultValue: null,
        validators: [Validators.required , Validators.pattern(/^[0-9]{6}$/)],
        validationMessages: {
          required: 'Postal Code is required',
          pattern: 'Enter valid Postal Code'
        }
      },
      EmailID: {
        label: 'Email',
        defaultValue: null,
        validators: [Validators.required, Validators.email],
        validationMessages: {
          required: 'Email is required',
          email: 'Invalid email format'
        }
      },
      PhoneNumber: {
        label: 'Phone Number',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)],
        validationMessages: {
          required: 'Phone number is required',
          pattern: 'Phone number must be between 8 and 15 digits'
        }
      }
    };
  }
  //#endregion
}
