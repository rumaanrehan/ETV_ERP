import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { PaymentMode, PaymentModeList, PaymentModeMappingList } from './payment-mode';

@Injectable({
  providedIn: 'root',
})
export class PaymentModeService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<PaymentMode> {
    return {
      PaymentModeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PaymentModeCode: {
        label: 'Payment Mode Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PaymentModeName: {
        label: 'Payment Mode Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Payment Mode Name is Required.',
          maxlength: 'Payment Mode Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ReferenceNo_IsAllowed: {
        label: 'IsAllowed',
        defaultValue: false,
        type: 'control'
      },
      ReferenceNo_IsRequired: {
        label: 'IsRequired',
        defaultValue: false,
        type: 'control'
      },
      ReferenceNo_Label: {
        label: 'Label',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Reference No Label is Required.',
          maxlength: 'Reference No Label cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      ReferenceDate_IsAllowed: {
        label: 'IsAllowed',
        defaultValue: false,
        type: 'control'
      },
      ReferenceDate_IsRequired: {
        label: 'IsRequired',
        defaultValue: false,
        type: 'control'
      },
      ReferenceDate_Label: {
        label: 'Label',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Reference Date Label is Required.',
          maxlength: 'Reference Date Label cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      Bank_IsAllowed: {
        label: 'IsAllowed',
        defaultValue: false,
        type: 'control'
      },
      Bank_IsRequired: {
        label: 'IsRequired',
        defaultValue: false,
        type: 'control'
      },
      Bank_Label: {
        label: 'Label',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Bank Label is Required.',
          maxlength: 'Bank Label cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      PaymentModeMapping: {
        type: 'array',
        items: {
          PaymentModeName: { 
            label: 'Billing Area',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: 'Billing Area is Required.'
            },
            type: 'control'
          },
          AllowedForPaymentMode: { 
            label: 'Is Allowed For Payment Mode',
            defaultValue: true,
            type: 'control'
          }
        }
      }
    };
  }
  
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<PaymentModeList>> {
    return this.http.post<ApiListResponse<PaymentModeList>>(`${this.apiUrl}Admin/PaymentMode/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<PaymentModeList>> {
    return this.http.post<ApiPagedListResponse<PaymentModeList>>(`${this.apiUrl}Admin/PaymentMode/PopulateGrid`, tabledata);
  }

  GetPaymentModeMappingAsync(PaymentModeID: number | null): Observable<ApiListResponse<PaymentModeMappingList>> {
    return this.http.post<ApiListResponse<PaymentModeMappingList>>(`${this.apiUrl}Admin/PaymentMode/GetPaymentModeMappingAsync${PaymentModeID != null ? `?PaymentModeID=${PaymentModeID}` : ''}`, {});
  }

  GetDetails(PaymentModeID: number): Observable<ApiDataResponse<PaymentMode>> {
    return this.http.post<ApiDataResponse<PaymentMode>>(`${this.apiUrl}Admin/PaymentMode/GetDetails?PaymentModeID=${PaymentModeID}`, {});
  }

  CreateRecord(model: PaymentMode): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PaymentMode/Create`, model);
  }

  UpdateRecord(model: PaymentMode): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PaymentMode/Edit`, model);
  }

  DeleteRecord(model: PaymentMode): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PaymentMode/Delete`, model);
  }
}
