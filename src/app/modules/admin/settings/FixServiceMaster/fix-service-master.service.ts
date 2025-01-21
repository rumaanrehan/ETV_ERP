import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { FixServiceMaster, FixServiceMasterList } from './fix-service-master';

@Injectable({
  providedIn: 'root'
})
export class FixServiceMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  PopulateGrid(tabledata: any): Observable<ApiTResponse<TResultPagedList<FixServiceMasterList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<FixServiceMasterList>>>(`${this.apiUrl}Admin/FixServiceMaster/PopulateGrid`, tabledata);
  }

  PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<FixServiceMasterList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<FixServiceMasterList>>>(`${this.apiUrl}Admin/FixServiceMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  GetDetails(FixServiceID: number): Observable<ApiTResponse<FixServiceMaster>> {
    return this.http.post<ApiTResponse<FixServiceMaster>>(`${this.apiUrl}Admin/FixServiceMaster/GetDetails?FixServiceID=${FixServiceID}`, {});
  }

  CreateRecord(model: FixServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FixServiceMaster/Create`, model);
  }

  UpdateRecord(model: FixServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FixServiceMaster/Edit`, model);
  }

  DeleteRecord(model: FixServiceMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/FixServiceMaster/Delete`, model);
  }


}
