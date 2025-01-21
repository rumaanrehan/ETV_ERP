import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { LableMaster } from '../../../RD/Settings/ReportTemplate/report-template';
import { ServiceMaster, ServiceMasterList } from './service-master';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';

@Injectable({
  providedIn: 'root',
})
export class ServiceMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ServiceMaster> {
    return {
      ServiceID: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },
      ServiceCode: {
        label: 'Service Code',
        defaultValue: 'NEW',
        validationMessages: {}
      },
      ServiceCategoryID: {
        label: 'Category',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Service Category List.'
        },
        type: 'control'
      },
      ServiceName: {
        label: 'Service Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Service Name is Required.',
          maxlength: 'Service Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ServiceRate: {
        label: 'Service Rate',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Service Rate is Required.'
        },
        type: 'control'
      },
      TestType: {
        label: 'Test Type',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Test Type List.'
        },
        type: 'control'
      },
      SIUnit: {
        label: 'SI Unit',
        defaultValue: null,
        validationMessages: {}
      },
      ShowMethodOnReport: {
        label: 'Show Method On Report',
        defaultValue: false,
        validationMessages: {}
      },
      ResultType: {
        label: 'Result Type',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Result Type List.'
        },
        type: 'control'
      },
      IsRangeBounds: {
        label: 'Is Range Bounds',
        defaultValue: false,
        validationMessages: {}
      },
      ResultRange_MinValue: {
        label: 'Normal Min Range',
        defaultValue: null,
        //validators: [RequiredIf('IsRangeBounds', Operator.NotEqualTo, true)],
        validationMessages: {
          requiredIf: 'Normal Min Range is Required.',
        },
        type: 'control'
      },
      ResultRange_MaxValue: {
        label: 'Normal Max Range',
        defaultValue: null,
        //validators: [RequiredIf('IsRangeBounds', Operator.NotEqualTo, true)],
        validationMessages: {
          requiredIf: 'Normal Max Range is Required.',
        },
        type: 'control'
      },
      ResultRange_ReferenceValue: {
        label: 'Reference Values',
        defaultValue: null,
        validators: [RequiredIf('ResultType', Operator.EqualTo, 3)],
        validationMessages: {
          requiredIf: 'Reference Values is Required.',
        },
        type: 'control'
      },
      LabelArray: {
        type: 'array',
        items: {
          Label: {
            label: 'Label',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: 'Value is Required.'
            },
            type: 'control'
          },
        },
      },

    };
  }
  //#endregion

  PopulateList(ServiceID:Number | null, ServiceCategoryID:number|null,PopulateType: any): Observable<ApiListResponse<ServiceMasterList>> {
    return this.http.post<ApiListResponse<ServiceMasterList>>(`${this.apiUrl}LB/ServiceMaster/PopulateList?${ServiceID ? `ServiceID=${ServiceID}&` : ''}${ServiceCategoryID ? `ServiceCategoryID=${ServiceCategoryID}&` : ''}PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ServiceMasterList>> {
    return this.http.post<ApiPagedListResponse<ServiceMasterList>>(`${this.apiUrl}LB/ServiceMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ServiceID: number): Observable<ApiDataResponse<ServiceMaster>> {
    return this.http.post<ApiDataResponse<ServiceMaster>>(`${this.apiUrl}LB/ServiceMaster/GetDetails?ServiceID=${ServiceID}`, {});
  }

  GetLabelArray(ServiceID: number | null): Observable<ApiListResponse<LableMaster>> {
    return this.http.post<ApiListResponse<LableMaster>>(`${this.apiUrl}LB/ServiceMaster/GetLabelMapping?ServiceID=${ServiceID}`, {});
  }

  CreateRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ServiceMaster/Create`, model);
  }

  UpdateRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ServiceMaster/Edit`, model);
  }

  DeleteRecord(model: ServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ServiceMaster/Delete`, model);
  }
}
