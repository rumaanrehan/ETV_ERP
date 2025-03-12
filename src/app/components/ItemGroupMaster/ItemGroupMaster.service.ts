import { ItemGroupMaster } from './ItemGroupMaster';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import { FormConfigType } from '../../shared/models/form.model';
import {
  ApiDataResponse,
  ApiPagedListResponse,
  ApiResponse,
  ApiTResponse,
  TResultPagedList,
} from '../../shared/models/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemGroupMasterService {
  private apiUrl = 'https://localhost:44316/api/ERP/ItemGroupMaster';

  constructor(private http: HttpClient) {
    // this.apiUrl = Environment.apiUrl;
  }

  DeleteItmeGroup(id: any): Observable<ApiResponse> {
    const body = { ItemGroupID: id };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Delete`, body);
  }

  CreateItemGroup(itemGroupMaster: ItemGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, itemGroupMaster);
  }

  PopulateGrid(
    tabledata: any
  ): Observable<ApiPagedListResponse<ItemGroupMaster>> {
    console.log(tabledata);
    return this.http.post<ApiPagedListResponse<ItemGroupMaster>>(
      `${this.apiUrl}/PopulateGrid`,
      tabledata
    );
  }

  GetDetails(ItemGroupID: any): Observable<ApiDataResponse<ItemGroupMaster>> {
    return this.http.post<ApiDataResponse<ItemGroupMaster>>(
      `${this.apiUrl}/GetDetails?itemGroupID=${ItemGroupID}`,
      {}
    );
  }

   UpdateCategory(itemGroup: ItemGroupMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, itemGroup);
  }

    getFormConfig(): FormConfigType<ItemGroupMaster> {
      return {
      //   CategoryTypeID: {
      //     label: 'Category Type',
      //     defaultValue: null,
      //     validators: [],
      //     validationMessages: {},
      //   },
        ItemGroupCode: {
          label: 'NEW Item Group Code',
          defaultValue: null,
          validators: [Validators.required],
          validationMessages: {
            required: 'ItemGroup Code is required.',
          },
        },
        ItemGroupName: {
          label: 'Item Group Name',
          defaultValue: '',
          validators: [Validators.required, NotOnlyWhitespaceValidator()],
          validationMessages: {
            required: 'Item Name is required.',
          },
        },
      };
    }

}
