import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../models/api-response';
import { StaticList } from '../../models/select-list';

@Injectable({
  providedIn: 'root'
})
export class ZDataviewService {

  constructor(
    private apiService: ApiService
  ) { }

  GetStatusList(forTable: string): Observable<ApiListResponse<StaticList>> {
    return this.apiService.post<ApiListResponse<StaticList>>(`SelectList/GetStatusList?forTable=${forTable}`, {});
  }
}
