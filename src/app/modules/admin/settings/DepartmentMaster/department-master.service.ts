import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DepartmentMaster, DepartmentMaster_IndexTableFilter, DepartmentMaster_IndexTableList, DepartmentMaster_SelectList } from './department-master';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DepartmentMaster_IndexTableFilter> {
    return {
      DepartmentCode: '',
      DepartmentName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<DepartmentMaster> {
    return {
      DepartmentID: {
        label: '',
        defaultValue: null,
      },
      DepartmentCode: {
        label: 'Code',
        defaultValue: 'NEW',
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Department Name is Required.',
          maxlength: 'Department name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
     
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<DepartmentMaster_SelectList>> {
    return this.http.post<ApiListResponse<DepartmentMaster_SelectList>>(`${this.apiUrl}Admin/DepartmentMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<DepartmentMaster_IndexTableFilter>): Observable<ApiPagedListResponse<DepartmentMaster_IndexTableList>> {      
      return this.http.post<ApiPagedListResponse<DepartmentMaster_IndexTableList>>(`${this.apiUrl}Admin/DepartmentMaster/PopulateGrid`, model);
    }

  GetDetails(DepartmentID: number): Observable<ApiDataResponse<DepartmentMaster>> {
    return this.http.post<ApiDataResponse<DepartmentMaster>>(`${this.apiUrl}Admin/DepartmentMaster/GetDetails?DepartmentID=${DepartmentID}`, {});
  }

  CreateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Create`, model);
  }

  UpdateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Edit`, model);
  }

  DeleteReactivate(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Delete`, model);
  }



}
