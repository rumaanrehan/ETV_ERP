import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { OrganismMaster, OrganismMasterList } from './organism-master';

@Injectable({
  providedIn: 'root',
})
export class OrganismMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<OrganismMaster> {
    return {
      OrganismID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      OrganismCode: {
        label: 'Organism Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      OrganismName: {
        label: 'Organism Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Organism Name is Required.',
          maxlength: 'Organism Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<OrganismMasterList>> {
    return this.http.post<ApiListResponse<OrganismMasterList>>(`${this.apiUrl}LB/OrganismMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<OrganismMasterList>> {
    return this.http.post<ApiPagedListResponse<OrganismMasterList>>(`${this.apiUrl}LB/OrganismMaster/PopulateGrid`, tabledata);
  }

  GetDetails(OrganismID: number): Observable<ApiDataResponse<OrganismMaster>> {
    return this.http.post<ApiDataResponse<OrganismMaster>>(`${this.apiUrl}LB/OrganismMaster/GetDetails?OrganismID=${OrganismID}`, {});
  }

  CreateRecord(model: OrganismMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OrganismMaster/Create`, model);
  }

  UpdateRecord(model: OrganismMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OrganismMaster/Edit`, model);
  }

  DeleteRecord(model: OrganismMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OrganismMaster/Delete`, model);
  }
}
