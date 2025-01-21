import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { ServiceCategoryMaster, ServiceCategoryMasterList } from './service-category-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<ServiceCategoryMaster> {
    return {
      ServiceCategoryID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ServiceCategoryCode: {
        label: 'Service Category Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ServiceCategoryType: {
        label: 'Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Group Type.'
        },
        type: 'control'
      },
      ServiceGroupID: {
        label: 'Service Group',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Group Type.'
        },
        type: 'control'
      },
      ServiceCategoryName: {
        label: 'Service Category Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Service Category Name  is Required.',
          maxlength: 'Service Category name  cannot exceed 50 characters.'
        },
        type: 'control'
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          maxlength: 'Maximum 5 character is allowed.'
        },
        type: 'control'
      },
    }
  }


  PopulateList(ServiceCategoryType: any | null, PopulateType: string | null): Observable<ApiListResponse<ServiceCategoryMasterList>> {
    return this.http.post<ApiListResponse<ServiceCategoryMasterList>>(`${this.apiUrl}Admin/ServiceCategoryMaster/PopulateList?${ServiceCategoryType ? `ServiceCategoryType=${ServiceCategoryType}&` : ''}PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ServiceCategoryMasterList>> {
    return this.http.post<ApiPagedListResponse<ServiceCategoryMasterList>>(`${this.apiUrl}Admin/ServiceCategoryMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ServiceCategoryID: number): Observable<ApiDataResponse<ServiceCategoryMaster>> {
    return this.http.post<ApiDataResponse<ServiceCategoryMaster>>(`${this.apiUrl}Admin/ServiceCategoryMaster/GetDetails?ServiceCategoryID=${ServiceCategoryID}`, {});
  }

  CreateRecord(model: ServiceCategoryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceCategoryMaster/Create`, model);
  }

  UpdateRecord(model: ServiceCategoryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceCategoryMaster/Edit`, model);
  }

  DeleteRecord(model: ServiceCategoryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceCategoryMaster/Delete`, model);
  }


}
