import { CategoryMaster, CategoryType } from './CategoryMaster';
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
export class IMS_CategoryMasterService {
  private apiUrl = 'https://localhost:44316/api/ERP/IMS_CategoryMaster';

  constructor(private http: HttpClient) {
    // this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<CategoryMaster> {
    return {
      CategoryTypeID: {
        label: 'Category Type',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      CategoryCode: {
        label: 'Category Code',
        defaultValue: '',
        validators: [Validators.required],
        validationMessages: {
          required: 'Category Code is required.',
        },
      },
      CategoryName: {
        label: 'Category Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Category Name is required.',
        },
      },
      // CategoryType: {
      //   label: 'Category Type',
      //   defaultValue: '',
      //   validators: [],
      //   validationMessages: {},
      // },
      ActiveStatus: {
        label: 'ActiveStatus',
        defaultValue: true,
        validators: [],
        validationMessages: {},
      },

    };
  }

  CategoryTypePopulateList(
    PopulateType: any
  ): Observable<ApiTResponse<TResultPagedList<CategoryType>>> {
    return this.http.post<ApiTResponse<TResultPagedList<CategoryType>>>(
      `${this.apiUrl}/TypePopulateList`,
      {}
    );
  }
  
  PopulateList(
    PopulateType: any
  ): Observable<ApiTResponse<TResultPagedList<CategoryMaster>>> {
    return this.http.post<ApiTResponse<TResultPagedList<CategoryMaster>>>(
      `${this.apiUrl}/PopulateList`,
      {}
    );
  }

  GetDetails(categoryId: any): Observable<ApiDataResponse<CategoryMaster>> {
    return this.http.post<ApiDataResponse<CategoryMaster>>(
      `${this.apiUrl}/GetDetails?CategoryID=${categoryId}`,
      {}
    );
  }

  CreateCategory(categoryMaster: CategoryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, categoryMaster);
  }

  PopulateGrid(
    tabledata: any
  ): Observable<ApiPagedListResponse<CategoryMaster>> {
    console.log(tabledata)
    return this.http.post<ApiPagedListResponse<CategoryMaster>>(
      `${this.apiUrl}/PopulateGrid`,
      tabledata
    );
  }

  UpdateCategory(category: CategoryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, category);
  }

  DeleteCategory(id: any): Observable<ApiResponse> {
    const body = { CategoryID: id };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Delete`, body);
  }
}
