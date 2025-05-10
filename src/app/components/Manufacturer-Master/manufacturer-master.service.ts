import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { DataTableParams } from '../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiPagedListResponse, ApiResponse } from '../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import { ManufacturerMaster, ManufacturerMaster_IndexTableFilter, ManufacturerMaster_IndexTableList } from './manufacturer-master';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerMasterService {
  private apiUrl = Environment.apiUrl;
  tabledata = {
    first: 0,
    rows: 100,
    sortField: 'ManufacturerName',
    sortOrder: 1,
    PopulateType: 'PopulateGrid',
    LoginID: 1,
  };

  constructor(private http: HttpClient) { }

  GetDetails(ID: number): Observable<ApiDataResponse<ManufacturerMaster>> {
    return this.http.post<ApiDataResponse<ManufacturerMaster>>(`${this.apiUrl}Admin/ManufacturerMaster/GetDetails?ManufacturerID=${ID}`, {});
  }

  Create(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ManufacturerMaster/Create`, model);
  }

  PopulateGrid(model: DataTableParams<ManufacturerMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ManufacturerMaster_IndexTableList>> {
    return this.http.post<ApiPagedListResponse<ManufacturerMaster_IndexTableList>>(`${this.apiUrl}Admin/ManufacturerMaster/PopulateGrid`, model);
  }

  Update(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ManufacturerMaster/Update`, model);
  }

  DeleteReactivate(model: ManufacturerMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ManufacturerMaster/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ManufacturerMaster_IndexTableFilter> {
    return {
      ManufacturerCode: '',
      ManufacturerName: '',
      ActiveStatus: 0
    }
  }

  getFormConfig(): FormConfigType<ManufacturerMaster> {
    return {
      ManufacturerID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      ManufacturerCode: {
        label: 'Manufacturer Code',
        validators: [],
        defaultValue: 'NEW',
        disabled: true
      },
      ManufacturerName: {
        label: 'Manufacturer Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Manufacturer Name is required.',
          whitespace: 'Manufacturer Name cannot be empty or only whitespace.',
        },
      },
      ActiveStatus: {
        label: 'Active Status',
        defaultValue: true,
        validators: [],
        validationMessages: {},
      },
    };
  }
}
