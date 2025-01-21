import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { AntibioticMaster, AntibioticMasterList } from './antibiotic-master';

@Injectable({
  providedIn: 'root',
})
export class AntibioticMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<AntibioticMaster> {
    return {
      AntibioticID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      AntibioticCode: {
        label: 'Antibiotic Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      AntibioticName: {
        label: 'Antibiotic Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Antibiotic Name is Required.',
          maxlength: 'Antibiotic Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<AntibioticMasterList>> {
    return this.http.post<ApiListResponse<AntibioticMasterList>>(`${this.apiUrl}LB/AntibioticMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<AntibioticMasterList>> {
    return this.http.post<ApiPagedListResponse<AntibioticMasterList>>(`${this.apiUrl}LB/AntibioticMaster/PopulateGrid`, tabledata);
  }

  GetDetails(AntibioticID: number): Observable<ApiDataResponse<AntibioticMaster>> {
    return this.http.post<ApiDataResponse<AntibioticMaster>>(`${this.apiUrl}LB/AntibioticMaster/GetDetails?AntibioticID=${AntibioticID}`, {});
  }

  CreateRecord(model: AntibioticMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/AntibioticMaster/Create`, model);
  }

  UpdateRecord(model: AntibioticMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/AntibioticMaster/Edit`, model);
  }

  DeleteRecord(model: AntibioticMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/AntibioticMaster/Delete`, model);
  }
}

