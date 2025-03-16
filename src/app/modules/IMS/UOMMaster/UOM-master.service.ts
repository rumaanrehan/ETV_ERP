import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';
import {
  ApiResponse,
  ApiPagedListResponse,
  ApiDataResponse,
} from '../../../shared/models/api-response';
import { FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { UOMMaster } from './UOM-master';

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

  CreateItemGroup(uom_Master: UOMMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, uom_Master);
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<UOMMaster>> {
    console.log(tabledata);
    return this.http.post<ApiPagedListResponse<UOMMaster>>(
      `${this.apiUrl}/PopulateGrid`,
      tabledata
    );
  }

  GetDetails(ItemGroupID: any): Observable<ApiDataResponse<UOMMaster>> {
    return this.http.post<ApiDataResponse<UOMMaster>>(
      `${this.apiUrl}/GetDetails?itemGroupID=${ItemGroupID}`,
      {}
    );
  }

  UpdateUOM_Master(itemGroup: UOMMaster): Observable<ApiResponse> {
    console.log(itemGroup);
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, itemGroup);
  }

  getFormConfig(): FormConfigType<UOMMaster> {
    return {
      UOMID: {
        label: '',
        defaultValue: null,
      },
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
