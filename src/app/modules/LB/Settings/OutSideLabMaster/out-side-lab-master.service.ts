import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { OutSideLabMaster, OutSideLabMasterList } from './out-side-lab-master';

@Injectable({
  providedIn: 'root',
})
export class OutSideLabMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<OutSideLabMaster> {
    return {
      OutsideLabID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      OutsideLabCode: {
        label: 'Lab Code',
        defaultValue: 'NEW',
        validationMessages: {}
      },
      OutsideLabName: {
        label: 'Lab Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Lab Name is Required.',
          maxlength: 'Lab Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<OutSideLabMasterList>> {
    return this.http.post<ApiListResponse<OutSideLabMasterList>>(`${this.apiUrl}LB/OutSideLabMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<OutSideLabMasterList>> {
    return this.http.post<ApiPagedListResponse<OutSideLabMasterList>>(`${this.apiUrl}LB/OutSideLabMaster/PopulateGrid`, tabledata);
  }

  GetDetails(OutsideLabID: number): Observable<ApiDataResponse<OutSideLabMaster>> {
    return this.http.post<ApiDataResponse<OutSideLabMaster>>(`${this.apiUrl}LB/OutSideLabMaster/GetDetails?OutsideLabID=${OutsideLabID}`, {});
  }

  CreateRecord(model: OutSideLabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutSideLabMaster/Create`, model);
  }

  UpdateRecord(model: OutSideLabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutSideLabMaster/Edit`, model);
  }

  DeleteRecord(model: OutSideLabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutSideLabMaster/Delete`, model);
  }
}
