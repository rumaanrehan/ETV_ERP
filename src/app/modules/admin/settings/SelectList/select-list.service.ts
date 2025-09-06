import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiPagedListResponse } from '../../../../shared/models/api-response';
import { SelectList, SelectListRequest } from './select-list';

@Injectable({
  providedIn: 'root',
})
export class SelectListService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  PopulateList(model: SelectListRequest): Observable<ApiPagedListResponse<SelectList>> {
    // const model = { AreaName, ControllerName, FieldName, PopulateType: 'SelectList' };
    return this.http.post<ApiPagedListResponse<SelectList>>(`${this.apiUrl}Common/SelectListEntry/GetSelectList`, model);
  }
}
