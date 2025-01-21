import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { CityMaster, CityMasterList } from './city-master';

@Injectable({
  providedIn: 'root',
})
export class CityMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<CityMaster> {
    return {
      CityID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      CityCode: {
        label: 'City Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      CityName: {
        label: 'City Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'City Name is Required.',
          maxlength: 'City Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<CityMasterList>> {
    return this.http.post<ApiListResponse<CityMasterList>>(`${this.apiUrl}Admin/CityMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<CityMasterList>> {
    return this.http.post<ApiPagedListResponse<CityMasterList>>(`${this.apiUrl}Admin/CityMaster/PopulateGrid`, tabledata);
  }

  GetDetails(CityID: number): Observable<ApiDataResponse<CityMaster>> {
    return this.http.post<ApiDataResponse<CityMaster>>(`${this.apiUrl}Admin/CityMaster/GetDetails?CityID=${CityID}`, {});
  }

  CreateRecord(model: CityMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CityMaster/Create`, model);
  }

  UpdateRecord(model: CityMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CityMaster/Edit`, model);
  }

  DeleteRecord(model: CityMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/CityMaster/Delete`, model);
  }
}
