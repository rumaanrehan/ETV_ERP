import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { OutsideTestMapping, OutsideTestMappingList } from './outside-test-mapping';

@Injectable({
  providedIn: 'root',
})
export class OutsideTestMappingService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<OutsideTestMapping> {
    return {
      MappingID: {
        label: '',
        defaultValue: null,
        validationMessages: {},
      },
      OutsideLabID: {
        label: 'Lab Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Lab List.'
        },
        type: 'control'
      },
      ServiceCategoryID: {
        label: 'Category',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Category List.'
        },
        type: 'control'
      },
      ServiceID: {
        label: 'Service Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service List.'
        },
        type: 'control'
      },
      AmountToPay: {
        label: 'Amount To Pay',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Amount To Pay is Required.',
        },
        type: 'control'
      },

    };
  }
  //#endregion

  PopulateList(ServiceCategoryID:number | null, PopulateType: any): Observable<ApiListResponse<OutsideTestMappingList>> {
    return this.http.post<ApiListResponse<OutsideTestMappingList>>(`${this.apiUrl}LB/OutsideTestMapping/PopulateList?ServiceCategoryID=${ServiceCategoryID}&PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<OutsideTestMappingList>> {
    return this.http.post<ApiPagedListResponse<OutsideTestMappingList>>(`${this.apiUrl}LB/OutsideTestMapping/PopulateGrid`, tabledata);
  }

  GetDetails(MappingID: number): Observable<ApiDataResponse<OutsideTestMapping>> {
    return this.http.post<ApiDataResponse<OutsideTestMapping>>(`${this.apiUrl}LB/OutsideTestMapping/GetDetails?MappingID=${MappingID}`, {});
  }

  CreateRecord(model: OutsideTestMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutsideTestMapping/Create`, model);
  }

  UpdateRecord(model: OutsideTestMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutsideTestMapping/Edit`, model);
  }

  DeleteRecord(model: OutsideTestMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OutsideTestMapping/Delete`, model);
  }
}
