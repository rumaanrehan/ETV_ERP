import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { TestGroupMapping, TestGroupMappingList } from './test-group-mapping';

@Injectable({
  providedIn: 'root',
})
export class TestGroupMappingService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<TestGroupMapping> {
    return {
      TestGroupID: {
        label: 'Test Group',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please Select option from Test Group.'
        },
        type: 'control'
      },
      TestMapping: {
        label: '',
        defaultValue: null,
      },
    };
  }
  //#endregion

  PopulateList(TestGroupID: number | null, PopulateType: string): Observable<ApiListResponse<TestGroupMappingList>> {
    return this.http.post<ApiListResponse<TestGroupMappingList>>(`${this.apiUrl}LB/TestGroupMaster/PopulateList?${TestGroupID ? `TestGroupID=${TestGroupID}&` : ''}PopulateType=${PopulateType}`,{});
  }

  UpdateRecord(model: TestGroupMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestGroupMaster/TestGroupMapping_Edit`, model);
  }
}
