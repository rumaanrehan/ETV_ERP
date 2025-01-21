import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ReferredByRegistration, ReferredByRegistrationList } from './referred-by-registration';

@Injectable({
  providedIn: 'root',
})
export class ReferredByRegistrationService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ReferredByRegistration> {
    return {
      ReferredByID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReferredByCode: {
        label: 'Referred By Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReferredByPrefix: {
        label: 'Prefix',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReferredByName: {
        label: 'Referred By',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Referred By Name is Required.',
          maxlength: 'Referred By Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      MobileNo: {
        label: 'Mobile No',
        defaultValue: null,
        validators: [ NotOnlyWhitespaceValidator(), Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          pattern: 'Mobile No. is not correct.'
        },
        type: 'control'
      },
      EmailID: {
        label: 'Email ID',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator(), Validators.email],
        validationMessages: {
          email : 'Please enter correct email address.'
        },
        type: 'control'
      },
      ReferredByAddress: {
        label: 'Address',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReferredByCity: {
        label: 'City',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ReferredByLocation: {
        label: 'Location',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
    };
  }

  //#endregion


  PopulateList(PopulateType: any): Observable<ApiListResponse<ReferredByRegistrationList>> {
    return this.http.post<ApiListResponse<ReferredByRegistrationList>>(`${this.apiUrl}Admin/ReferredByRegistration/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ReferredByRegistrationList>> {
    return this.http.post<ApiPagedListResponse<ReferredByRegistrationList>>(`${this.apiUrl}Admin/ReferredByRegistration/PopulateGrid`, tabledata);
  }

  GetDetails(ReferredByID: number): Observable<ApiDataResponse<ReferredByRegistration>> {
    return this.http.post<ApiDataResponse<ReferredByRegistration>>(`${this.apiUrl}Admin/ReferredByRegistration/GetDetails?ReferredByID=${ReferredByID}`, {});
  }

  CreateRecord(model: ReferredByRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ReferredByRegistration/Create`, model);
  }

  UpdateRecord(model: ReferredByRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ReferredByRegistration/Edit`, model);
  }

  DeleteRecord(model: ReferredByRegistration): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ReferredByRegistration/Cancel`, model);
  }

}
