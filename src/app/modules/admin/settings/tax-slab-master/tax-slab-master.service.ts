import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { TaxSlab_IndexTableFilter, TaxSlab_IndexTableList, TaxSlab_IndexTableSort, TaxSlab_SelectList, TaxSlabMaster, TaxSlabRequest } from './tax-slab-master';

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
    
  PopulateList(model: TaxSlabRequest): Observable<ApiListResponse<TaxSlab_SelectList>> {
    return this.apiService.post<ApiListResponse<TaxSlab_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<TaxSlab_IndexTableFilter>): Observable<ApiPagedListResponse<TaxSlab_IndexTableList>> {
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

  DeleteReactivate(TaxSlabID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?TaxSlabID=${TaxSlabID}&${reasonToUpdate}`, {});
  }
  
 //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<TaxSlab_IndexTableFilter> {
    return {
      TaxSlabCode: '',
      TaxSlabName: '',
      TaxRateID: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<TaxSlab_IndexTableSort> {
    return {
      TaxSlabCode: {
        label: 'Code',
        defaultValue: -1
      },
      TaxSlabName: {
        label: 'Tax Slab Name',
        defaultValue: 0
      },
      TaxRate: {
        label: 'Tax Rate',
        defaultValue: 0
      }
    };
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<TaxSlab_IndexTableList> {
    return {
      tableKey: 'Admin_TaxSlabMaster_IndexTable',
      defaultSortColumn: { sortField: 'TaxSlabCode', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'TaxSlabCode', label: 'Code', type: 'text' },
        { field: 'TaxSlabName', label: 'Tax Slab Name', type: 'text' },
        { field: 'TaxRateID', label: 'Tax Rate', type: 'dropdown', options: [] },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'TaxSlabCode', label: 'Code', enabled: true, order: -1 },
        { field: 'TaxSlabName', label: 'Tax Slab Name', enabled: true, order: 0 },
        { field: 'TaxRate', label: 'Tax Rate', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
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
