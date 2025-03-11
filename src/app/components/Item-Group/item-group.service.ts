import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemGroup, ItemGroup_IndexTableFilter, ItemGroup_IndexTableList, ItemGroup_SelectList } from './item-group';
import { Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../shared/models/form.model';
import { DataTableParams } from '../../shared/components/z-datatable/z-datatable';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, } from '../../shared/models/api-response';
import { Environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ItemGroupService {
  private apiUrl = Environment.apiUrl;
  tabledata = {
    first: 0,
    rows: 100,
    sortField: 'ItemGroupName',
    sortOrder: 1,
    PopulateType: 'PopulateGrid',
    LoginID: 1,
  };

  constructor(private http: HttpClient) { }

  GetDetails(ID: number): Observable<ApiDataResponse<ItemGroup>> {
    return this.http.post<ApiDataResponse<ItemGroup>>(`${this.apiUrl}Admin/ItemGroup/GetDetails?ItemGroupID=${ID}`, {});
  }

  Create(model: ItemGroup): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ItemGroup/Create`, model);
  }

  PopulateGrid(model: DataTableParams<ItemGroup_IndexTableFilter>): Observable<ApiPagedListResponse<ItemGroup_IndexTableList>> {
    return this.http.post<ApiPagedListResponse<ItemGroup_IndexTableList>>(`${this.apiUrl}Admin/ItemGroup/PopulateGrid`, model);
  }

  Update(model: ItemGroup): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ItemGroup/Update`, model);
  }

  DeleteReactivate(model: ItemGroup): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ItemGroup/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemGroup_IndexTableFilter> {
    return {
      ItemGroupCode: '',
      ItemGroupName: '',
      ActiveStatus: 0
    }
  }

  getFormConfig(): FormConfigType<ItemGroup> {
    return {
      ItemGroupID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      ItemGroupCode: {
        label: 'Item-Group Code',
        validators: [],
        defaultValue: 'NEW',
        disabled: true
      },
      ItemGroupName: {
        label: 'Item-Group Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Item-Group Name is required.',
          whitespace: 'Item-Group Name cannot be empty or only whitespace.',
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
