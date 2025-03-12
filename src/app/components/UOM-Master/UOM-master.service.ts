import { UOM_Master } from './UOM-master';
import {
  ApiDataResponse,
  ApiPagedListResponse,
  ApiResponse,
  ApiTResponse,
  TResultPagedList,
} from '../../shared/models/api-response';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormConfigType } from '../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root',
})
export class UOMMasterService {
  private apiUrl = 'https://localhost:44316/api/ERP/UOMMaster';

  constructor(private http: HttpClient) {
    // this.apiUrl = Environment.apiUrl;
  }

  DeleteItem(id: number): Observable<ApiResponse> {
    const body = { UOMID: id };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Delete`, body);
  }

  CreateItemGroup(uom_Master: UOM_Master): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, uom_Master);
  }

  PopulateGrid(
    tabledata: any
  ): Observable<ApiPagedListResponse<UOM_Master>> {
    console.log(tabledata);
    return this.http.post<ApiPagedListResponse<UOM_Master>>(
      `${this.apiUrl}/PopulateGrid`,
      tabledata
    );
  }

  GetDetails(ItemGroupID: any): Observable<ApiDataResponse<UOM_Master>> {
    return this.http.post<ApiDataResponse<UOM_Master>>(
      `${this.apiUrl}/GetDetails?itemGroupID=${ItemGroupID}`,
      {}
    );
  }

   UpdateUOM_Master(itemGroup: UOM_Master): Observable<ApiResponse> {
    console.log(itemGroup)
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, itemGroup);
  }

    getFormConfig(): FormConfigType<UOM_Master> {
      return {
      //   CategoryTypeID: {
      //     label: 'Category Type',
      //     defaultValue: null,
      //     validators: [],
      //     validationMessages: {},
      //   },
        UOMCode: {
          label: 'NEW UOM Code',
          defaultValue: null,
          validators: [Validators.required],
          validationMessages: {
            required: 'ItemGroup Code is required.',
          },
        },
        UOMName: {
          label: 'UOM Name',
          defaultValue: '',
          validators: [Validators.required, NotOnlyWhitespaceValidator()],
          validationMessages: {
            required: 'UOM Name is required.',
          },
        },
      };
    }

}
