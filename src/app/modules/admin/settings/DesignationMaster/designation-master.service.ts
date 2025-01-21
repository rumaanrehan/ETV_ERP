import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { DesignationMaster, DesignationMasterList } from './designation-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root',
})
export class DesignationMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<DesignationMaster> {
    return {
      DesignationID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DesignationCode: {
        label: 'Designation Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DesignationName: {
        label: 'Designation Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Designation Name is required.',
          maxlength: 'Designation name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<DesignationMasterList>> {
    return this.http.post<ApiListResponse<DesignationMasterList>>(`${this.apiUrl}Admin/DesignationMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<DesignationMasterList>> {
    return this.http.post <ApiPagedListResponse<DesignationMasterList>>(`${this.apiUrl}Admin/DesignationMaster/PopulateGrid`, tabledata);
  }

  GetDetails(DesignationID: number): Observable<ApiDataResponse<DesignationMaster>> {
    return this.http.post<ApiDataResponse<DesignationMaster>>(`${this.apiUrl}Admin/DesignationMaster/GetDetails?DesignationID=${DesignationID}`, {});
  }

  CreateRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Create`, model);
  }

  UpdateRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Edit`, model);
  }

  DeleteRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Delete`, model);
  }
}
