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
import { TaxSlab_IndexTableFilter, TaxSlab_IndexTableList, TaxSlab_SelectList, TaxSlabMaster } from './tax-slab-master';

@Injectable({
  providedIn: 'root'
})
export class TaxSlabMasterService {
  private endpoint = 'Admin/TaxSlabMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
  ) {}

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }
    
  PopulateList(PopulateType: any): Observable<ApiListResponse<TaxSlab_SelectList>> {
    return this.apiService.post<ApiListResponse<TaxSlab_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<TaxSlab_IndexTableFilter>): Observable<ApiPagedListResponse<TaxSlab_IndexTableList>> {
    console.log("Fetching List From TaxSlabMasterService");
    return this.apiService.post<ApiPagedListResponse<TaxSlab_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(taxSlabID: number): Observable<ApiDataResponse<TaxSlabMaster>> {
    return this.apiService.post<ApiDataResponse<TaxSlabMaster>>(`${this.endpoint}/GetDetails?TaxSlabID=${taxSlabID}`, {});
  }

  CreateRecord(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
 //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<TaxSlab_IndexTableFilter> {
    return {
      TaxSlabCode: '',
      TaxSlabName: '',
      TaxRate: 0,
      TaxType: 0,
      ActiveStatusID: 0
    }
  }
  
  getFormConfig(): FormConfigType<TaxSlabMaster> {
    return {
      TaxSlabID: {
        label: '',
        defaultValue: null,
      },
      TaxSlabCode: {
        label: 'Tax Slab Code',
        defaultValue: 'NEW'
      },
      TaxTypeID: {
        label: 'Tax Type',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TaxSlabName: {
        label: 'Tax Slab Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Tax Slab Name is required'
        }
      },
      TaxRate: {
        label: 'Tax Rate',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Tax Rate is Required.'
        }
      }
    }
  }
}