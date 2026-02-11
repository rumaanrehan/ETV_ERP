import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { ApiListResponse } from '../models/api-response';
import { DataTableFilterList, DataTableFilterListRequest, StaticList, StaticListRequest } from '../models/select-list';

@Injectable({
  providedIn: 'root'
})
export class SelectListService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.http.post<ApiListResponse<StaticList>>(`${this.apiUrl}SelectList/GetStaticList`, model);
  }

  GetStatusList(forTable: string): Observable<ApiListResponse<StaticList>> {
    return this.http.post<ApiListResponse<StaticList>>(`${this.apiUrl}SelectList/GetStatusList?forTable=${forTable}`, {});
  }

  GetDataTableList(model: DataTableFilterListRequest): Observable<ApiListResponse<DataTableFilterList>> {
    return this.http.post<ApiListResponse<DataTableFilterList>>(`${this.apiUrl}SelectList/GetDataTableList`, model);
  }
}