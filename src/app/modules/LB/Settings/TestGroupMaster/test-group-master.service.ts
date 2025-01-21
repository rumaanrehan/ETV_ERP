import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { TestGroupMaster, TestGroupMasterList } from './test-group-master';

@Injectable({
  providedIn: 'root',
})
export class TestGroupMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<TestGroupMaster> {
    return {
      TestGroupID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TestGroupCode: {
        label: 'Test Group Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TestGroupName: {
        label: 'Test Group Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Test Group Name is Required.',
          maxlength: 'Test Group Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<TestGroupMasterList>> {
    return this.http.post<ApiListResponse<TestGroupMasterList>>(`${this.apiUrl}LB/TestGroupMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<TestGroupMasterList>> {
    return this.http.post<ApiPagedListResponse<TestGroupMasterList>>(`${this.apiUrl}LB/TestGroupMaster/PopulateGrid`, tabledata);
  }

  GetDetails(TestGroupID: number): Observable<ApiDataResponse<TestGroupMaster>> {
    return this.http.post<ApiDataResponse<TestGroupMaster>>(`${this.apiUrl}LB/TestGroupMaster/GetDetails?TestGroupID=${TestGroupID}`, {});
  }

  CreateRecord(model: TestGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestGroupMaster/Create`, model);
  }

  UpdateRecord(model: TestGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestGroupMaster/Edit`, model);
  }

  DeleteRecord(model: TestGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestGroupMaster/Delete`, model);
  }
}
