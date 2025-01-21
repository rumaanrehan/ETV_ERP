import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { TaxSlabMaster, TaxSlabMasterList } from './tax-slab-master';

@Injectable({
  providedIn: 'root'
})
export class TaxSlabMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<TaxSlabMaster> {
    return {
      TaxSlabID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      TaxSlabCode: {
        label: 'Tax Slab Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      TaxType: {
        label: 'Tax Type',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Tax Type is Required.'
        },
        type: 'control'
      },
      TaxSlabName: {
        label: 'Tax Slab Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Tax Slab Name is Required.',
          maxlength: 'TaxSlab name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      TaxRate: {
        label: 'Tax Rate',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Tax Rate is Required.'
        },
        type: 'control'
      }
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<TaxSlabMasterList>> {
    return this.http.post<ApiListResponse<TaxSlabMasterList>>(`${this.apiUrl}Admin/TaxSlabMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<TaxSlabMasterList>> {
    return this.http.post<ApiPagedListResponse<TaxSlabMasterList>>(`${this.apiUrl}Admin/TaxSlabMaster/PopulateGrid`, tabledata);
  }

  GetDetails(TaxSlabID: number): Observable<ApiDataResponse<TaxSlabMaster>> {
    return this.http.post<ApiDataResponse<TaxSlabMaster>>(`${this.apiUrl}Admin/TaxSlabMaster/GetDetails?TaxSlabID=${TaxSlabID}`, {});
  }

  CreateRecord(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/TaxSlabMaster/Create`, model);
  }

  UpdateRecord(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/TaxSlabMaster/Edit`, model);
  }

  DeleteRecord(model: TaxSlabMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/TaxSlabMaster/Delete`, model);
  }


}
