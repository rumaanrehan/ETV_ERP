import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { TestMethodMapping, TestMethodMappingList } from './test-method-mapping';

@Injectable({
  providedIn: 'root',
})
export class TestMethodMappingService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<TestMethodMapping> {
    return {
      TestID: {
        label: 'Test',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Test List.'
        },
        type: 'control'
      },
      TestMethodID: {
        label: 'Unit',
        defaultValue: null,
        type: 'control'
      },
      TestMapping: {
        label: '',
        defaultValue: null
      },
      TotalMappedMethod: {
        label: 'Total Mapped Method',
        defaultValue: null
      },
    };
  }
  //#endregion

  PopulateList(TestID: number, PopulateType: string): Observable<ApiListResponse<TestMethodMappingList>> {
    return this.http.post<ApiListResponse<TestMethodMappingList>>(`${this.apiUrl}LB/TestMethodMaster/PopulateList?TestID=${TestID}&PopulateType=${PopulateType}`, {});
  }

  UpdateRecord(model: TestMethodMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestMethodMaster/TestMethodMapping_Edit`, model);
  }
}
