import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { CountryMaster } from './country-master';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiService } from '../../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class CountryMasterService {

  private endpoint: string = 'Admin/CountryMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<CountryMaster>>> {
    return this.apiService.post<ApiTResponse<TResultPagedList<CountryMaster>>>(`${this.endpoint}/PopulateList`, {});
  }

}
