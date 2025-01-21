import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { TestMethod, TestMethodList } from './test-method';

@Injectable({
  providedIn: 'root',
})
export class TestMethodService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<TestMethod> {
    return {
      TestMethodID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TestMethodCode: {
        label: 'Test Method Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TestMethodName: {
        label: 'Test Method',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Test Method is Required.',
          maxlength: 'Test Method cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<TestMethodList>> {
    return this.http.post<ApiListResponse<TestMethodList>>(`${this.apiUrl}LB/TestMethodMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<TestMethodList>> {
    return this.http.post<ApiPagedListResponse<TestMethodList>>(`${this.apiUrl}LB/TestMethodMaster/PopulateGrid`, tabledata);
  }

  GetDetails(TestMethodID: number): Observable<ApiDataResponse<TestMethod>> {
    return this.http.post<ApiDataResponse<TestMethod>>(`${this.apiUrl}LB/TestMethodMaster/GetDetails?TestMethodID=${TestMethodID}`, {});
  }

  CreateRecord(model: TestMethod): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestMethodMaster/Create`, model);
  }

  UpdateRecord(model: TestMethod): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestMethodMaster/Edit`, model);
  }

  DeleteRecord(model: TestMethod): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestMethodMaster/Delete`, model);
  }
}
