import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { CountryMaster, CountryMasterList } from './country-master';

@Injectable({
  providedIn: 'root',
})
export class CountryMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  PopulateGrid(tabledata: any): Observable<ApiTResponse<TResultPagedList<CountryMasterList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<CountryMasterList>>>(`${this.apiUrl}Admin/CountryMaster/PopulateGrid`, tabledata);
  }

  PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<CountryMasterList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<CountryMasterList>>>(`${this.apiUrl}Admin/CountryMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  GetDetails(CountryID: number): Observable<ApiTResponse<CountryMaster>> {
    return this.http.post<ApiTResponse<CountryMaster>>(`${this.apiUrl}Admin/CountryMaster/GetDetails`, CountryID);
  }

  CreateRecord(model: CountryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CountryMaster/Create`, model);
  }

  UpdateRecord(model: CountryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CountryMaster/Edit`, model);
  }

  DeleteRecord(model: CountryMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CountryMaster/Delete`, model);
  }
}
