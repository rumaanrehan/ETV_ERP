import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { CountryMaster } from './country-master';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class CountryMasterService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<CountryMaster>>> {
    return this.http.post<ApiTResponse<TResultPagedList<CountryMaster>>>(`${this.apiUrl}Admin/CountryMaster/PopulateList`, {});
  }

}
