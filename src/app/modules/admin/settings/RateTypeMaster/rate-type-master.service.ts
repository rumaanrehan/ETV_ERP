import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { RateTypeMaster, RateTypeMasterList } from './rate-type-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Validators } from '@angular/forms';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';

@Injectable({
  providedIn: 'root'
})
export class RateTypeMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<RateTypeMaster> {
    return {
      RateTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      RateTypeCode: {
        label: 'Rate Type Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      RateTypeName: {
        label: 'Rate Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Rate Type Name is Required.',
          maxlength: 'Rate Type Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ApplicableFor: {
        label: 'Applicable For',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Applicable For List.'
        },
        type: 'control'
      },
      IsCopyRate: {
        label: '',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      CopyRateID: {
        label: 'Copy Rate',
        defaultValue: null,
        validators: [RequiredIf('IsCopyRate', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Copy Rate List.'
        },
        type: 'control'
      }
    }
  }
 
  PopulateList(PopulateType: any): Observable<ApiListResponse<RateTypeMasterList>> {
    return this.http.post<ApiListResponse<RateTypeMasterList>>(`${this.apiUrl}Admin/RateTypeMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<RateTypeMasterList>> {
    return this.http.post<ApiPagedListResponse<RateTypeMasterList>>(`${this.apiUrl}Admin/RateTypeMaster/PopulateGrid`, tabledata);
  }

  GetDetails(RateTypeID: number): Observable<ApiDataResponse<RateTypeMaster>> {
    return this.http.post<ApiDataResponse<RateTypeMaster>>(`${this.apiUrl}Admin/RateTypeMaster/GetDetails?RateTypeID=${RateTypeID}`, {});
  }

  CreateRecord(model: RateTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RateTypeMaster/Create`, model);
  }

  UpdateRecord(model: RateTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RateTypeMaster/Edit`, model);
  }

  DeleteRecord(model: RateTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RateTypeMaster/Delete`, model);
  }
}
