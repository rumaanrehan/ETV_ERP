import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { DepartmentMaster, DepartmentMaster_IndexTableFilter, DepartmentMaster_IndexTableList, DepartmentMaster_SelectList } from './department-master';

@Injectable({
  providedIn: 'root',
})
export class DepartmentMasterService {
  private endpoint = 'Admin/DepartmentMaster';

  constructor(
    private apiService: ApiService
  ) { }
  
  GetMasterDropdownLists(): Observable<{ 
    parentDepartmentList: ApiListResponse<DepartmentMaster_SelectList>;
    }> {
    return forkJoin({
      parentDepartmentList: this.PopulateList("SelectList"),
    });
  }

  PopulateList(populateType: string): Observable<ApiListResponse<DepartmentMaster_SelectList>> {
      return this.apiService.post<ApiListResponse<DepartmentMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${populateType}`, {} );
  }

  PopulateGrid(model: DataTableParams<DepartmentMaster_IndexTableFilter>): Observable<ApiPagedListResponse<DepartmentMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<DepartmentMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(departmentID: number): Observable<ApiDataResponse<DepartmentMaster>> {
    return this.apiService.post<ApiDataResponse<DepartmentMaster>>(`${this.endpoint}/GetDetails?DepartmentID=${departmentID}`, {});
  }

  CreateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: DepartmentMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DepartmentMaster_IndexTableFilter> {
    return {
      DepartmentCode: '',
      DepartmentName: '',
      ParentDepartmentName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<DepartmentMaster> {
    return {
      DepartmentID: {
        label: '',
        defaultValue: null,
      },
      DepartmentCode: {
        label: 'Department Code',
        defaultValue: 'NEW'
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Department Name is required'
        }
      },
      ShortCode: {
        label: ' Short Code',
        defaultValue: null,
        validators: [Validators.maxLength(6)],
        validationMessages: {
          required: 'Short Code is required',
          maxlength: 'Maximum 6 character allowed.'
        },
        type: 'control'
      },
      IsSubDepartment: {
        label: 'Is Sub Department??',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      ParentDepartmentID: {
        label: 'Parent Department',
        defaultValue: null,
        validators: [RequiredIf('IsSubDepartment', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Parent Department Type List.',
        },
        type: 'control'
      },
    };
  }
}
