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
import { EmployeeType_IndexTableFilter, EmployeeType_IndexTableList, EmployeeType_SelectList, EmployeeTypeMaster, EmployeeTypeRequest } from './employee-type-master';

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

  GetDetails(employeeTypeID: number): Observable<ApiDataResponse<EmployeeTypeMaster>> {
    return this.apiService.post<ApiDataResponse<EmployeeTypeMaster>>(`${this.endpoint}/GetDetails?employeeTypeID=${employeeTypeID}`, {});
  }

  CreateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: EmployeeTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<EmployeeType_IndexTableFilter> {
    return {
      EmployeeTypeCode: '',
      EmployeeTypeName: '',
      IsAllowedOverTime: '',
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
        label: 'Employee Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Employee Name is required'
        }
      },
       IsAllowedOverTime: {
        label: 'Is Allowed Over Time',
        defaultValue: 'NEW'
      },
    }
  }
}
