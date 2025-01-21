import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ServiceGroupMaster, ServiceGroupMasterList } from './service-group-master';

@Injectable({
  providedIn: 'root'
})
export class ServiceGroupMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ServiceGroupMaster> {
    return {
      ServiceGroupID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ServiceGroupCode: {
        label: 'Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ServiceGroupName: {
        label: 'Service Group Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Service Group Name is Required.',
          maxlength: 'Service Group  Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [Validators.maxLength(5)],
        validationMessages: {
          maxlength: 'Maximum 5 characters are allowed.'
        },
        type: 'control'
      },
      ServiceGroupType: {
        label: 'Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Group Type List.',
        },
        type: 'control'
      },     
    };
  }
  //#endregion

  PopulateList(ServiceCategoryType: string, PopulateType: any): Observable<ApiListResponse<ServiceGroupMasterList>> {
    const ServiceGroupType = ServiceCategoryType
    return this.http.post<ApiListResponse<ServiceGroupMasterList>>(`${this.apiUrl}Admin/ServiceGroupMaster/PopulateList?ServiceGroupType=${ServiceGroupType}&PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ServiceGroupMasterList>> {
    return this.http.post<ApiPagedListResponse<ServiceGroupMasterList>>(`${this.apiUrl}Admin/ServiceGroupMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ServiceGroupID: number): Observable<ApiDataResponse<ServiceGroupMaster>> {
    return this.http.post<ApiDataResponse<ServiceGroupMaster>>(`${this.apiUrl}Admin/ServiceGroupMaster/GetDetails?ServiceGroupID=${ServiceGroupID}`, {});
  }

  CreateRecord(model: ServiceGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceGroupMaster/Create`, model);
  }

  UpdateRecord(model: ServiceGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceGroupMaster/Edit`, model);
  }

  DeleteRecord(model: ServiceGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ServiceGroupMaster/Delete`, model);
  }

}
