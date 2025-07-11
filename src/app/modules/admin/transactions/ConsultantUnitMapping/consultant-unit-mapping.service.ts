import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ConsultantUnitMapping, ConsultantUnitMappingList } from './consultant-unit-mapping';

@Injectable({
  providedIn: 'root',
})
export class ConsultantUnitMappingService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ConsultantUnitMapping> {
    return {
      DepartmentID: {
        label: 'Department',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ConsultantID: {
        label: '',
        defaultValue: null
      },
      ConsultantUnitID: {
        label: 'Unit',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Unit List.'
        },
        type: 'control'
      },
      ConsultantMapping: {
        label: '',
        defaultValue: null
      },
    };
  }
  //#endregion

  PopulateList(DepartmentID: number, ConsultantUnitID: number | null, PopulateType: string, ConsultantType: string | null): Observable<ApiListResponse<ConsultantUnitMappingList>> {
    const model = { DepartmentID, ConsultantUnitID, PopulateType, ConsultantType }
    return this.http.post <ApiListResponse<ConsultantUnitMappingList>>(`${this.apiUrl}Admin/ConsultantUnitMapping/PopulateConsultant`, model);
  }

  UpdateRecord(model: ConsultantUnitMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ConsultantUnitMapping/ConsultantUnitMapping_Edit`, model);
  }
}
