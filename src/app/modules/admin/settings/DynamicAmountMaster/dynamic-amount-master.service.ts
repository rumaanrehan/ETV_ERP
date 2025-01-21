import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DynamicAmountMaster, DynamicAmountMasterList } from '../DynamicAmountMaster/dynamic-amount-master';


@Injectable({
  providedIn: 'root',
})
export class DynamicAmountMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<DynamicAmountMaster> {
    return {
      DynamicAmountID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DynamicAmountCode: {
        label: 'Dynamic Amount Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DynamicAmountName: {
        label: 'Dynamic Amount Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Dynamic Amount Name is Required.',
          maxlength: 'Dynamic Amount Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      DynamicAmountTypeID: {
        label: 'Dynamic Amount Type',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please Select an option from the Dynamic Amount Type List.'
        },
        type: 'control'
      }
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<DynamicAmountMasterList>> {
    return this.http.post<ApiListResponse<DynamicAmountMasterList>>(`${this.apiUrl}Admin/DynamicAmountMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<DynamicAmountMasterList>> {
    return this.http.post<ApiPagedListResponse<DynamicAmountMasterList>>(`${this.apiUrl}Admin/DynamicAmountMaster/PopulateGrid`, tabledata);
  }

  GetDetails(DynamicAmountID: number): Observable<ApiDataResponse<DynamicAmountMaster>> {
    return this.http.post<ApiDataResponse<DynamicAmountMaster>>(`${this.apiUrl}Admin/DynamicAmountMaster/GetDetails?DynamicAmountID=${DynamicAmountID}`, {});
  }

  CreateRecord(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DynamicAmountMaster/Create`, model);
  }

  UpdateRecord(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DynamicAmountMaster/Edit`, model);
  }

  DeleteRecord(model: DynamicAmountMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DynamicAmountMaster/Delete`, model);
  }
}
