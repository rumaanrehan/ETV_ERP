import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { SpecimenMaster, SpecimenMasterList } from './specimen-master';

@Injectable({
  providedIn: 'root',
})
export class SpecimenMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<SpecimenMaster> {
    return {
      SpecimenID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      SpecimenCode: {
        label: 'Specimen Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      SpecimenName: {
        label: 'Specimen Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Specimen Name is Required.',
          maxlength: 'Specimen Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<SpecimenMasterList>> {
    return this.http.post<ApiListResponse<SpecimenMasterList>>(`${this.apiUrl}LB/SpecimenMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<SpecimenMasterList>> {
    return this.http.post<ApiPagedListResponse<SpecimenMasterList>>(`${this.apiUrl}LB/SpecimenMaster/PopulateGrid`, tabledata);
  }

  GetDetails(SpecimenID: number): Observable<ApiDataResponse<SpecimenMaster>> {
    return this.http.post<ApiDataResponse<SpecimenMaster>>(`${this.apiUrl}LB/SpecimenMaster/GetDetails?SpecimenID=${SpecimenID}`, {});
  }

  CreateRecord(model: SpecimenMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/SpecimenMaster/Create`, model);
  }

  UpdateRecord(model: SpecimenMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/SpecimenMaster/Edit`, model);
  }

  DeleteRecord(model: SpecimenMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/SpecimenMaster/Delete`, model);
  }
}
