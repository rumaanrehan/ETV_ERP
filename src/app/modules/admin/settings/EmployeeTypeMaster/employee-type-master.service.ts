import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { EmployeeTypeMaster, EmployeeTypeMasterList } from './employee-type-master';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTypeMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<EmployeeTypeMaster> {
    return {
      EmployeeTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      EmployeeTypeCode: {
        label: 'Employee Type Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      EmployeeTypeName: {
        label: 'Employee Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Employee Type Name is Required.',
          maxlength: 'Employee Type Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      IsAllowedOverTimePay: {
        label: 'Is Allowed Over Time Pay',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<EmployeeTypeMasterList>> {
    return this.http.post<ApiListResponse<EmployeeTypeMasterList>>(`${this.apiUrl}Admin/EmployeeTypeMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<EmployeeTypeMasterList>> {
    return this.http.post<ApiPagedListResponse<EmployeeTypeMasterList>>(`${this.apiUrl}Admin/EmployeeTypeMaster/PopulateGrid`, tabledata);
  }

  GetDetails(EmployeeTypeID: number): Observable<ApiDataResponse<EmployeeTypeMaster>> {
    return this.http.post<ApiDataResponse<EmployeeTypeMaster>>(`${this.apiUrl}Admin/EmployeeTypeMaster/GetDetails?EmployeeTypeID=${EmployeeTypeID}`, {});
  }

  CreateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Create`, model);
  }

  UpdateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Edit`, model);
  }

  DeleteRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Delete`, model);
  }
}
