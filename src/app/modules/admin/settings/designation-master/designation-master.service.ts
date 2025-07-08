import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DesignationMaster, DesignationMaster_IndexTableFilter, DesignationMaster_IndexTableList, DesignationMaster_SelectList } from './designation-master';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';

@Injectable({
  providedIn: 'root'
})
export class DesignationMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DesignationMaster_IndexTableFilter> {
    return {
      DesignationCode: '',
      DesignationName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<DesignationMaster> {
    return {
      DesignationID: {
        label: '',
        defaultValue: null,
      },
      DesignationCode: {
        label: 'Code',
        defaultValue: 'NEW',
      },
      DesignationName: {
        label: 'Designation Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Designation Name is Required.',
          maxlength: 'Designation Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    }
  }

  PopulateList(PopulateType: string): Observable<ApiListResponse<DesignationMaster_SelectList>> {
    return this.http.post<ApiListResponse<DesignationMaster_SelectList>>(`${this.apiUrl}Admin/DesignationMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<DesignationMaster_IndexTableFilter>): Observable<ApiPagedListResponse<DesignationMaster_IndexTableList>> {      
      return this.http.post<ApiPagedListResponse<DesignationMaster_IndexTableList>>(`${this.apiUrl}Admin/DesignationMaster/PopulateGrid`, model);
    }

  GetDetails(DesignationID: number): Observable<ApiDataResponse<DesignationMaster>> {
    return this.http.post<ApiDataResponse<DesignationMaster>>(`${this.apiUrl}Admin/DesignationMaster/GetDetails?DesignationID=${DesignationID}`, {});
  }

  CreateRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Create`, model);
  }

  UpdateRecord(model: DesignationMaster): Observable<ApiResponse> {
    debugger;
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Edit`, model);
  }

  DeleteReactivate(model: DesignationMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DesignationMaster/Delete`, model);
  }
}
