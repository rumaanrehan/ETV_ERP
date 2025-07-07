import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { EmployeeTypeMaster, EmployeeTypeMaster_IndexTableFilter, EmployeeTypeMaster_IndexTableList, EmployeeTypeMaster_SelectList } from './employee-type-master';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<EmployeeTypeMaster_IndexTableFilter> {
    return {
      EmployeeTypeCode: '',
      EmployeeTypeName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<EmployeeTypeMaster> {
    return {
      EmployeeTypeID: {
        label: '',
        defaultValue: null,
      },
      EmployeeTypeCode: {
        label: 'Code',
        defaultValue: 'NEW',
      },
      EmployeeTypeName: {
        label: 'Employee Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Employee Type Name is Required.',
          maxlength: 'Employee Type name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      IsAllowedOvertime:{
        label: 'Is Allowed Overtime',
        defaultValue: null,
      }
    }
  }

  PopulateList(PopulateType: string): Observable<ApiListResponse<EmployeeTypeMaster_SelectList>> {
    return this.http.post<ApiListResponse<EmployeeTypeMaster_SelectList>>(`${this.apiUrl}Admin/EmployeeTypeMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<EmployeeTypeMaster_IndexTableFilter>): Observable<ApiPagedListResponse<EmployeeTypeMaster_IndexTableList>> {      
      return this.http.post<ApiPagedListResponse<EmployeeTypeMaster_IndexTableList>>(`${this.apiUrl}Admin/EmployeeTypeMaster/PopulateGrid`, model);
    }

  GetDetails(EmployeeTypeID: number): Observable<ApiDataResponse<EmployeeTypeMaster>> {
    return this.http.post<ApiDataResponse<EmployeeTypeMaster>>(`${this.apiUrl}Admin/EmployeeTypeMaster/GetDetails?EmployeeTypeID=${EmployeeTypeID}`, {});
  }

  CreateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Create`, model);
  }

  UpdateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    debugger;
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Edit`, model);
  }

  DeleteReactivate(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/EmployeeTypeMaster/Delete`, model);
  }



}
