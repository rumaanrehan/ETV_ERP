import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { LoanTypeMaster, LoanTypeMasterList } from './loan-type-master';

@Injectable({
  providedIn: 'root',
})
export class LoanTypeMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<LoanTypeMaster> {
    return {
      LoanTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      LoanTypeCode: {
        label: 'Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      LoanTypeName: {
        label: 'Loan Type',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Loan Type Name is Required.',
          maxlength: 'Loan Type Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      
      InterestRate: {
        label: 'Interest Rate',
        defaultValue: null,
        validators: [
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
          Validators.max(100),
        ],
        validationMessages: {
          max: 'Interest Rate should be between 0 to 100.',
          pattern: 'Interest Rate must be a valid number with up to two decimal places.',
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(LoanTypeID: number | null, PopulateType: any): Observable<ApiListResponse<LoanTypeMasterList>> {
    return this.http.post<ApiListResponse<LoanTypeMasterList>>(
      `${this.apiUrl}HR/LoanTypeMaster/PopulateList?${LoanTypeID ? `LoanTypeID=${LoanTypeID}&` : ''}PopulateType=${PopulateType}`,
      {}
    );  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<LoanTypeMasterList>> {
    return this.http.post<ApiPagedListResponse<LoanTypeMasterList>>(`${this.apiUrl}HR/LoanTypeMaster/PopulateGrid`, tabledata);
  }

  GetDetails(LoanTypeID: number): Observable<ApiDataResponse<LoanTypeMaster>> {
    return this.http.post<ApiDataResponse<LoanTypeMaster>>(`${this.apiUrl}HR/LoanTypeMaster/GetDetails?LoanTypeID=${LoanTypeID}`, {});
  }

  CreateRecord(model: LoanTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/LoanTypeMaster/Create`, model);
  }

  UpdateRecord(model: LoanTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/LoanTypeMaster/Edit`, model);
  }

  DeleteRecord(model: LoanTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/LoanTypeMaster/Delete`, model);
  }
}
