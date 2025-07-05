import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DynamicAmountMaster, DynamicAmountMaster_IndexTableFilter, DynamicAmountMaster_IndexTableList, DynamicAmountMaster_SelectList } from '../DynamicAmountMaster/dynamic-amount-master';


@Injectable({
  providedIn: 'root',
})
export class DynamicAmountMasterService {
  private endpoint = 'Admin/DynamicAmountMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
  ) {}

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  PopulateList(populateType: string): Observable<ApiListResponse<DynamicAmountMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<DynamicAmountMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }

  PopulateGrid(model: DataTableParams<DynamicAmountMaster_IndexTableFilter>): Observable<ApiPagedListResponse<DynamicAmountMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<DynamicAmountMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(dynamicAmountID: number): Observable<ApiDataResponse<DynamicAmountMaster>> {
    return this.apiService.post<ApiDataResponse<DynamicAmountMaster>>(`${this.endpoint}/GetDetails?DynamicAmountID=${dynamicAmountID}`, {});
  }

  CreateRecord(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DynamicAmountMaster_IndexTableFilter> {
    return {
      DynamicAmountCode: '',
      DynamicAmountName: '',
      DynamicAmountTypeName: '',
      ActiveStatusID: 0
    }
  }
  
  getFormConfig(): FormConfigType<DynamicAmountMaster> {
    return {
      DynamicAmountID: {
        label: '',
        defaultValue: null,
      },
      DynamicAmountCode: {
        label: 'Dynamic Amount Code',
        defaultValue: 'NEW'
      },
      DynamicAmountName: {
        label: 'Dynamic Amount Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Dynamic Amount Name is Required'
        }
      },
      DynamicAmountTypeID: {
        label: 'Dynamic Amount Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Dynamic Amount is required'
        }
      }
    };
  }
  //#endregion
}