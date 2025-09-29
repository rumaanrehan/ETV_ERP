import { Injectable } from '@angular/core';
import { FormConfigType } from '../../models/form.model';
import { SortingForm } from './z-data-view';
import { ApiListResponse, ApiResponse } from '../../models/api-response';
import { StaticList } from '../../models/select-list';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ZDataViewService {

  constructor(
    private apiService: ApiService,
  ) { }



  GetStatusList(forTable: string): Observable<ApiListResponse<StaticList>> {
    return this.apiService.post<ApiListResponse<StaticList>>(`SelectList/GetStatusList?forTable=${forTable}`, {});
  }

  getFormConfig_DataViewSorting(): FormConfigType<SortingForm> {
    return {
      sortField: {
        label: 'Sort Field',
        defaultValue: ''
      },
      sortOrder: {
        label: 'Sort Order',
        defaultValue: ''
      },
    }
  }
}
