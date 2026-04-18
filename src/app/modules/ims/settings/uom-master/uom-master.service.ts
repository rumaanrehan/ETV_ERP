import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UOMMaster, UOMRequest, UOM_Details, UOM_IndexTableFilter, UOM_IndexTableList, UOM_IndexTableSort, UOM_SelectList } from './uom-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class UOMMasterService {
  private endpoint = 'IMS/UOMMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: UOMRequest): Observable<ApiListResponse<UOM_SelectList>> {
    return this.apiService.post<ApiListResponse<UOM_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }
  
  PopulateGrid(model: DataTableParams<UOM_IndexTableFilter>): Observable<ApiPagedListResponse<UOM_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<UOM_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(UOMID: number): Observable<ApiDataResponse<UOM_Details>> {
    return this.apiService.post<ApiDataResponse<UOM_Details>>(`${this.endpoint}/GetDetails?UOMID=${UOMID}`, {});
  }

  CreateRecord(model: UOMMaster): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: UOMMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(UOMID: number , reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?UOMID=${UOMID}&reasonToUpdate={reasonToUpdate} `, {});
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<UOM_IndexTableFilter> {
    return {
      UOMCode: '',
      UOMName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<UOM_IndexTableSort> {
    return {
      UOMCode: {
        label: 'Code',
        defaultValue: -1
      },
      UOMName: {
        label: 'UOM Name',
        defaultValue: 0
      }
    };
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<UOM_IndexTableList> {
    return {
      tableKey: 'IMS_UOM_IndexTable',
      defaultSortColumn: { sortField: 'UOMCode', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'UOMCode', label: 'Code', type: 'text' },
        { field: 'UOMName', label: 'UOM Name', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'UOMCode', label: 'Code', enabled: true, order: -1 },
        { field: 'UOMName', label: 'UOM Name', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  getFormConfig(): FormConfigType<UOMMaster> {
    return {
      UOMID: {
        label: '',
        defaultValue: null,
      },
      UOMCode: {
        label: 'UOM Code',
        defaultValue: 'NEW'
      },
      UOMName: {
        label: 'UOM Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'UOM Name is required'
        }
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()]
      },
    };
  }
}
