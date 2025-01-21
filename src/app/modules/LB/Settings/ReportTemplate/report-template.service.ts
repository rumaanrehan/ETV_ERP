import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ReportTemplateMaster, ReportTemplateMasterList } from './report-template';

@Injectable({
  providedIn: 'root',
})
export class ReportTemplateService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ReportTemplateMaster> {
    return {
      ReportTemplateID: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },
      ReportTemplateCode: {
        label: 'Report Template Code',
        defaultValue: 'NEW',
        validationMessages: {}
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
      ReportTemplateName: {
        label: 'Report Template Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Report Template Name is Required.',
        },
        type: 'control'
      },
      TemplateContent: {
        label: 'Template Content',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Service Rate is Required.'
        },
        type: 'control'
      },
      TemplateImpression: {
        label: 'Template Impression',
        defaultValue: '',
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Test Type List.'
        },
        type: 'control'
      },
      TestID: {
        label: 'Service',
        defaultValue: null,
        validationMessages: {}
      },

    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<ReportTemplateMasterList>> {
    return this.http.post<ApiListResponse<ReportTemplateMasterList>>(`${this.apiUrl}LB/ReportTemplateMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateList1(ServiceCategoryID: number | null ,PopulateType: any): Observable<ApiListResponse<ReportTemplateMasterList>> {
    return this.http.post<ApiListResponse<ReportTemplateMasterList>>(`${this.apiUrl}LB/ReportTemplateMaster/PopulateList?ServiceCategoryID=${ServiceCategoryID}&PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ReportTemplateMasterList>> {
    return this.http.post<ApiPagedListResponse<ReportTemplateMasterList>>(`${this.apiUrl}LB/ReportTemplateMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ReportTemplateID: number): Observable<ApiDataResponse<ReportTemplateMaster>> {
    return this.http.post<ApiDataResponse<ReportTemplateMaster>>(`${this.apiUrl}LB/ReportTemplateMaster/GetDetails?ReportTemplateID=${ReportTemplateID}`, {});
  }

  CreateRecord(model: ReportTemplateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ReportTemplateMaster/Create`, model);
  }

  UpdateRecord(model: ReportTemplateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ReportTemplateMaster/Edit`, model);
  }

  DeleteRecord(model: ReportTemplateMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ReportTemplateMaster/Delete`, model);
  }
}
