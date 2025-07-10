import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { CountryMasterService } from '../country-master/country-master.service';
// import { State_IndexTableFilter, State_IndexTableList, State_SelectList, StateMaster, StateRequest } from './state-master';
import { Country_SelectList, CountryRequest } from '../country-master/country-master';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ApiService } from '../../../../core/services/api.service';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { DesignationRequest, Designation_SelectList, Designation_IndexTableFilter, Designation_IndexTableList, DesignationMaster } from './designation-master';

@Injectable({
  providedIn: 'root'
})
export class DesignationMasterService {
  private endpoint = 'Admin/DesignationMaster';

  constructor(
    private apiService: ApiService,
  ) {}

 

  PopulateList(model: DesignationRequest): Observable<ApiListResponse<Designation_SelectList>> {
    return this.apiService.post<ApiListResponse<Designation_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Designation_IndexTableFilter>): Observable<ApiPagedListResponse<Designation_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Designation_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(DesignationID: number): Observable<ApiDataResponse<DesignationMaster>> {
    return this.apiService.post<ApiDataResponse<DesignationMaster>>(`${this.endpoint}/GetDetails?DesignationID=${DesignationID}`, {});
  }

  CreateRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: DesignationMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: DesignationMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Designation_IndexTableFilter> {
    return {
      DesignationCode: '',
      DesignationName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<DesignationMaster> {
    return {
      DesignationID: {
        label: '',
        defaultValue: null,
      },
      DesignationCode: {
        label: 'Designation Code',
        defaultValue: 'NEW'
      },
      DesignationName: {
        label: 'Designation Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Designation Name is required'
        }
      },
     
      
    }
  }
}
