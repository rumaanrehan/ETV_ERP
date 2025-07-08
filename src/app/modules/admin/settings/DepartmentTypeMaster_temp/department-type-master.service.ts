import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DepartmentTypeMaster, DepartmentTypeMasterList } from './department-type-master';

@Injectable({
  providedIn: 'root',
})
export class DepartmentTypeMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<DepartmentTypeMaster> {
    return {
      DepartmentTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentTypeCode: {
        label: 'Department Type Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentTypeName: {
        label: 'Department Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Department Type Name is Required.',
          maxlength: 'Department Type Name cannot be longer than 50 characters.'
        },
        type: 'control'
      }
    };
  }

  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<DepartmentTypeMasterList>> {
    return this.http.post<ApiListResponse<DepartmentTypeMasterList>>(`${this.apiUrl}Admin/DepartmentTypeMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<DepartmentTypeMasterList>> {
    return this.http.post<ApiPagedListResponse<DepartmentTypeMasterList>>(`${this.apiUrl}Admin/DepartmentTypeMaster/PopulateGrid`, tabledata);
  }

  GetDetails(DepartmentTypeID: number): Observable<ApiDataResponse<DepartmentTypeMaster>> {
    return this.http.post<ApiDataResponse<DepartmentTypeMaster>>(`${this.apiUrl}Admin/DepartmentTypeMaster/GetDetails?DepartmentTypeID=${DepartmentTypeID}`, {});
  }

  CreateRecord(model: DepartmentTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentTypeMaster/Create`, model);
  }

  UpdateRecord(model: DepartmentTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentTypeMaster/Edit`, model);
  }

  DeleteRecord(model: DepartmentTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentTypeMaster/Delete`, model);
  }
}
