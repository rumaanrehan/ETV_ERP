import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ConsultantUnitMaster, ConsultantUnitMasterList } from './consultant-unit-master';

@Injectable({
  providedIn: 'root',
})
export class ConsultantUnitMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ConsultantUnitMaster> {
    return {
      ConsultantUnitID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ConsultantUnitCode: {
        label: 'Consultant Unit Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentID: {
        label: 'Department',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Department List.',
        },
        type: 'control'
      },
      ConsultantUnitName: {
        label: 'Consultant Unit Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Consultant Unit Name is Required.',
          maxlength: 'Consultant Unit Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      dtEffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.',
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(DepartmentID: number, PopulateType: any): Observable<ApiTResponse<TResultPagedList<ConsultantUnitMasterList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<ConsultantUnitMasterList>>>(`${this.apiUrl}Admin/ConsultantUnitMaster/PopulateList?DepartmentID=${DepartmentID}&PopulateType=${PopulateType}`, {});
  }
  // PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<ConsultantUnitMasterList>>> {
  //   return this.http.post<ApiTResponse<TResultPagedList<ConsultantUnitMasterList>>>(`${this.apiUrl}Admin/ConsultantUnitMaster/PopulateList?PopulateType=${PopulateType}`, {});
  // }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ConsultantUnitMasterList>> {
    return this.http.post<ApiPagedListResponse<ConsultantUnitMasterList>>(`${this.apiUrl}Admin/ConsultantUnitMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ConsultantUnitID: number): Observable<ApiDataResponse<ConsultantUnitMaster>> {
    return this.http.post<ApiDataResponse<ConsultantUnitMaster>>(`${this.apiUrl}Admin/ConsultantUnitMaster/GetDetails?ConsultantUnitID=${ConsultantUnitID}`, {});
  }

  CreateRecord(model: ConsultantUnitMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ConsultantUnitMaster/Create`, model);
  }

  UpdateRecord(model: ConsultantUnitMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ConsultantUnitMaster/Edit`, model);
  }

  DeleteRecord(model: ConsultantUnitMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ConsultantUnitMaster/Delete`, model);
  }
}
