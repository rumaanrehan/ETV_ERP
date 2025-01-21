import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RelationshipMaster, RelationshipMasterList } from './relationship-master';

@Injectable({
  providedIn: 'root',
})
export class RelationshipMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<RelationshipMaster> {
    return {
      RelationshipID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      RelationshipCode: {
        label: 'Relationship Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      RelationshipName: {
        label: 'Relationship Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Relationship Name is Required.',
          maxlength: 'Relationship Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<RelationshipMasterList>> {
    return this.http.post<ApiListResponse<RelationshipMasterList>>(`${this.apiUrl}Admin/RelationshipMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<RelationshipMasterList>> {
    return this.http.post<ApiPagedListResponse<RelationshipMasterList>>(`${this.apiUrl}Admin/RelationshipMaster/PopulateGrid`, tabledata);
  }

  GetDetails(RelationshipID: number): Observable<ApiDataResponse<RelationshipMaster>> {
    return this.http.post<ApiDataResponse<RelationshipMaster>>(`${this.apiUrl}Admin/RelationshipMaster/GetDetails?RelationshipID=${RelationshipID}`, {});
  }

  CreateRecord(model: RelationshipMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RelationshipMaster/Create`, model);
  }

  UpdateRecord(model: RelationshipMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RelationshipMaster/Edit`, model);
  }

  DeleteRecord(model: RelationshipMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RelationshipMaster/Delete`, model);
  }
}
