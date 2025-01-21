import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { PrefixMaster, PrefixMasterList } from './prefix-master';

@Injectable({
  providedIn: 'root',
})
export class PrefixMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<PrefixMaster> {
    return {
      PrefixID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      PrefixCode: {
        label: 'Prefix Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      PrefixName: {
        label: 'Prefix Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Prefix Name is Required.',
          maxlength: 'Prefix Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      PrefixGender: {
        label: 'Prefix Gender',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      IsAllowedForPatient: {
        label: 'Is Allowed For Patient',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsAllowedForStaff: {
        label: 'Is Allowed For Staff',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<PrefixMasterList>> {
    return this.http.post<ApiListResponse<PrefixMasterList>>(`${this.apiUrl}Admin/PrefixMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<PrefixMasterList>> {
    return this.http.post<ApiPagedListResponse<PrefixMasterList>>(`${this.apiUrl}Admin/PrefixMaster/PopulateGrid`, tabledata);
  }

  GetDetails(PrefixID: number): Observable<ApiDataResponse<PrefixMaster>> {
    return this.http.post<ApiDataResponse<PrefixMaster>>(`${this.apiUrl}Admin/PrefixMaster/GetDetails?PrefixID=${PrefixID}`, {});
  }

  CreateRecord(model: PrefixMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PrefixMaster/Create`, model);
  }

  UpdateRecord(model: PrefixMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PrefixMaster/Edit`, model);
  }

  DeleteRecord(model: PrefixMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PrefixMaster/Delete`, model);
  }
}
