import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { StateMaster, StateMasterList } from './state-master';

@Injectable({
  providedIn: 'root',
})
export class StateMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<StateMaster> {
    return {
      StateID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StateCode: {
        label: 'State Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StateName: {
        label: 'State Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'State Name is Required.',
          maxlength: 'State Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      StateGSTCode: {
        label: 'State GST Code',
        defaultValue: null,
        validators: [Validators.maxLength(2)],
        validationMessages: {
          maxlength: 'State GST Code should be maximum two characters.'
        },
        type : 'control'
      },
      StateISOCode: {
        label: 'State ISO Code',
        defaultValue: null,
        validators: [Validators.maxLength(2)],
        validationMessages: {
          maxlength: 'State ISO Code should be maximum two characters.'
        },
        type: 'control'
      },
      CountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      IsDefault: {
        label: 'Is Default',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion

  PopulateList(CountryID?: number, PopulateType?: any): Observable<ApiListResponse<StateMasterList>> {
    return this.http.post<ApiListResponse<StateMasterList>>(`${this.apiUrl}Admin/StateMaster/PopulateList?CountryID=${CountryID}&PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<StateMasterList>> {
    console.log(tabledata);
    return this.http.post<ApiPagedListResponse<StateMasterList>>(`${this.apiUrl}Admin/StateMaster/PopulateGrid`, tabledata);
  }

  GetDetails(StateID: number): Observable<ApiDataResponse<StateMaster>> {
    return this.http.post<ApiDataResponse<StateMaster>>(`${this.apiUrl}Admin/StateMaster/GetDetails?StateID=${StateID}`, {});
  }

  CreateRecord(model: StateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Create`, model);
  }

  UpdateRecord(model: StateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Edit`, model);
  }

  DeleteRecord(model: StateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/StateMaster/Delete`, model);
  }
  
}
