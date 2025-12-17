import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { CountryMasterService } from '../country-master/country-master.service';
import { Country_SelectList, CountryRequest } from '../country-master/country-master';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { EmployeeType_Details, EmployeeType_IndexTableFilter, EmployeeType_IndexTableList, EmployeeType_SelectList, EmployeeTypeMaster, EmployeeTypeRequest } from './employee-type-master';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeMasterService {
  private endpoint = 'Admin/EmployeeTypeMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: EmployeeTypeRequest): Observable<ApiListResponse<EmployeeType_SelectList>> {
    return this.apiService.post<ApiListResponse<EmployeeType_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<EmployeeType_IndexTableFilter>): Observable<ApiPagedListResponse<EmployeeType_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<EmployeeType_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(employeeTypeID: number): Observable<ApiDataResponse<EmployeeType_Details>> {
    return this.apiService.post<ApiDataResponse<EmployeeType_Details>>(`${this.endpoint}/GetDetails?employeeTypeID=${employeeTypeID}`, {});
  }

  CreateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(EmployeeTypeID: number,  reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?EmployeeTypeID=${EmployeeTypeID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<EmployeeType_IndexTableFilter> {
    return {
      EmployeeTypeCode: '',
      EmployeeTypeName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<EmployeeTypeMaster> {
    return {
      EmployeeTypeID: {
        label: '',
        defaultValue: null,
      },
      EmployeeTypeCode: {
        label: 'Employee Code',
        defaultValue: 'NEW'
      },
      EmployeeTypeName: {
        label: 'Employee Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Employee Name is required'
        }
      },
       IsAllowedOverTime: {
        label: 'Is Allowed Over Time',
        defaultValue: false
      },
    }
  }
}
