import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ManufacturerMaster, Manufacturer_IndexTableFilter, Manufacturer_IndexTableList, Manufacturer_SelectList, ManufacturerRequest, Manufacturer_Details, Manufacturer_IndexTableSort } from './manufacturer-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerMasterService {
  private endpoint = 'IMS/ManufacturerMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: ManufacturerRequest): Observable<ApiListResponse<Manufacturer_SelectList>> {
    return this.apiService.post<ApiListResponse<Manufacturer_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Manufacturer_IndexTableFilter>): Observable<ApiPagedListResponse<Manufacturer_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Manufacturer_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(manufacturerID: number): Observable<ApiDataResponse<Manufacturer_Details>> {
    return this.apiService.post<ApiDataResponse<Manufacturer_Details>>(`${this.endpoint}/GetDetails?ManufacturerID=${manufacturerID}`, {});
  }

  CreateRecord(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(ManufacturerID: number ,  reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?manufacturerID=${ManufacturerID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Manufacturer_IndexTableFilter> {
    return {
      ManufacturerCode: '',
      ManufacturerName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<Manufacturer_IndexTableSort> {
    return {
      ManufacturerCode: {
        label: 'Code',
        defaultValue: -1
      },
      ManufacturerName: {
        label: 'Manufacturer Name',
        defaultValue: 0
      }
    };
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<Manufacturer_IndexTableList> {
    return {
      tableKey: 'IMS_ManufacturerMaster_IndexTable',
      defaultSortColumn: { sortField: 'ManufacturerCode', sortOrder: 1 },
      filterForm,
      sortingForm,
      filterFields: [
        { field: 'ManufacturerCode', label: 'Code', type: 'text' },
        { field: 'ManufacturerName', label: 'Manufacturer Name', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'ManufacturerCode', label: 'Code', enabled: true, order: -1 },
        { field: 'ManufacturerName', label: 'Manufacturer Name', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  getFormConfig(): FormConfigType<ManufacturerMaster> {
    return {
      ManufacturerID: {
        label: '',
        defaultValue: null,
      },
      ManufacturerCode: {
        label: 'Manufacturer Code',
        defaultValue: 'NEW'
      },
      ManufacturerName: {
        label: 'Manufacturer Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Manufacturer Name is required'
        }
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()],
      },
    };
  }
}
