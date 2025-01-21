import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { FinYearMaster, FinYearMasterList } from './fin-year-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { GreaterThan } from '../../../../shared/validators/greater-than.validator';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class FinYearMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<FinYearMaster> {
    return {
      FinYearID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      FinYearCode: {
        label: 'FinYearCode',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      FinYearName: {
        label: 'Fin Year Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Financial Year Name is Required.',
          maxlength: 'Financial Year name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      FinYearStartDate: {
        label: 'Start Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Financial Year Start is Required.'
        },
        type: 'control'
      },
      FinYearEndDate: {
        label: 'End Date',
        defaultValue: null,
        validators: [Validators.required, GreaterThan('FinYearStartDate')],
        validationMessages: {
          required: 'Financial Year End Date is Required.</br>',
          greaterThan: 'End Date should be greater than Start Date.'
        },
        type: 'control'
      },
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<FinYearMasterList>> {
    return this.http.post<ApiListResponse<FinYearMasterList>>(`${this.apiUrl}Admin/FinYearMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<FinYearMasterList>> {
    return this.http.post <ApiPagedListResponse<FinYearMasterList>>(`${this.apiUrl}Admin/FinYearMaster/PopulateGrid`, tabledata);
  }

  GetDetails(FinYearID: number): Observable<ApiDataResponse<FinYearMaster>> {
    return this.http.post<ApiDataResponse<FinYearMaster>>(`${this.apiUrl}Admin/FinYearMaster/GetDetails?FinYearID=${FinYearID}`, {});
  }

  CreateRecord(model: FinYearMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FinYearMaster/Create`, model);
  }

  UpdateRecord(model: FinYearMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FinYearMaster/Edit`, model);
  }

  DeleteRecord(model: FinYearMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FinYearMaster/Delete`, model);
  }

}
