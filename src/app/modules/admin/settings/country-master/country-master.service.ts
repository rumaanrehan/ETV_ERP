import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiPagedListResponse, ApiResponse, ApiResponsePagedList, ApiTResponse, TResultList, TResultPagedList } from '../../../../shared/models/api-response';
import { Country_IndexTableFilter, Country_IndexTableList, CountryMaster, CountryRequest } from './country-master';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType } from '../../../../shared/models/form.model';

@Injectable({
  providedIn: 'root',
})
export class CountryMasterService {

  private endpoint: string = 'Admin/CountryMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: CountryRequest): Observable<ApiListResponse<Country_IndexTableList>> {
    return this.apiService.post<ApiListResponse<Country_IndexTableList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Country_IndexTableFilter>): Observable<ApiPagedListResponse<Country_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Country_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  DeleteReactivate(model: CountryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Country_IndexTableFilter> {
    return {
      CountryCode: '',
      CountryName: '',
      CountryISOCode: '',
      ActiveStatusID: 0
    }
  }
}
