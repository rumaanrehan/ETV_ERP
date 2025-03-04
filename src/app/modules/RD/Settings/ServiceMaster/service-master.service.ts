import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import {
  ApiDataResponse,
  ApiListResponse,
  ApiPagedListResponse,
  ApiResponse,
} from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ServiceMaster, ServiceMasterList } from './service-master';

@Injectable({
  providedIn: 'root',
})
export class ServiceMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  CreateRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}RD/ServiceMaster/Create`,
      model
    );
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ServiceMaster> {
    return {
      ServiceID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      ServiceCode: {
        label: 'Service Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      ServiceCategoryID: {
        label: 'Service Category',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Category List.',
        },
        type: 'control',
      },
      ServiceName: {
        label: 'Service Name',
        defaultValue: null,
        validators: [
          Validators.required,
          NotOnlyWhitespaceValidator(),
          Validators.maxLength(50),
        ],
        validationMessages: {
          required: 'Service Name is Required.',
          maxlength: 'Service Name cannot be longer than 50 characters.',
        },
        type: 'control',
      },
      ServiceRate: {
        label: 'Service Rate',
        defaultValue: null,
        validators: [
          Validators.required,
          NotOnlyWhitespaceValidator(),
          Validators.maxLength(50),
        ],
        validationMessages: {
          required: 'Service Rate is Required.',
        },
        type: 'control',
      },
    };
  }
  //#endregion

  PopulateList(
    ServiceCategoryID: number | null,
    PopulateType: any
  ): Observable<ApiListResponse<ServiceMasterList>> {
    return this.http.post<ApiListResponse<ServiceMasterList>>(
      `${this.apiUrl}RD/ServiceMaster/PopulateList?ServiceCategoryID=${ServiceCategoryID}&PopulateType=${PopulateType}`,
      {}
    );
  }

  PopulateGrid(
    tabledata: any
  ): Observable<ApiPagedListResponse<ServiceMasterList>> {
    return this.http.post<ApiPagedListResponse<ServiceMasterList>>(
      `${this.apiUrl}RD/ServiceMaster/PopulateGrid`,
      tabledata
    );
  }

  GetDetails(ServiceID: number): Observable<ApiDataResponse<ServiceMaster>> {
    return this.http.post<ApiDataResponse<ServiceMaster>>(
      `${this.apiUrl}RD/ServiceMaster/GetDetails?ServiceID=${ServiceID}`,
      {}
    );
  }

  UpdateRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}RD/ServiceMaster/Edit`,
      model
    );
  }

  DeleteRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}RD/ServiceMaster/Delete`,
      model
    );
  }
}
