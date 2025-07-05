import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { NumberFormat, NumberFormatList } from './number-format';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }
  //GetDetails(model:NumberFormat): Observable<ApiListResponse<NumberFormatList>> {
  //  return this.http.post<ApiListResponse<NumberFormatList>>(`${this.apiUrl}Admin/NumberFormat/GetDetails`, model);
  //}

  //CreateRecord(model: NumberFormat): Observable<ApiResponse> {
  //  return this.http.post<ApiResponse>(`${this.apiUrl}Admin/NumberFormat/Create`, model);
  //}

  GetDetails(FormatFor: string, ModuleCode: string, BillingSection?: string, CounterID?: number): Observable<ApiListResponse<NumberFormatList>> {
    const model = {
      FormatFor,
      ModuleCode,
      BillingSection: { 1: 'OR', 2: 'OP', 3: 'IP', 4: 'LB', 5: 'RD' }[BillingSection || ''],
      CounterID,
    };
    return this.http.post<ApiListResponse<NumberFormatList>>(`${this.apiUrl}Admin/NumberFormat/GetDetails`, model);
  }

  CreateRecord(model: NumberFormat): Observable<ApiResponse> {
    const mappedModel = {
      ...model,
      RestartType: { 1: 'N', 2: 'D', 3: 'M', 4: 'Y', 5: 'F' }[model.RestartType],
      BillingSection: model.BillingSection != null ? { 1: 'OR', 2: 'OP', 3: 'IP', 4: 'LB', 5: 'RD' }[model.BillingSection]: null,
    };
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/NumberFormat/Create`, mappedModel);
  }

  getFormConfig(): FormConfigType<NumberFormat> {
    return {
      NumberFormatID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      SampleNumberFormat: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ModuleCode: {
        label: 'Module',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Module List.'},
        type: 'control'
      },
      FormatFor: {
        label: 'Format For',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Format For List.'},
        type: 'control'
      },
      BillingSection: {
        label: 'Billing Section',
        defaultValue: null,
        //validators: [RequiredIf('FormatFor', Operator.EqualTo, ServiceInvoiceNo || CreditNoteNo)],
        validationMessages: {
          required: 'Please select an option from the Billing Section List.'},
        type: 'control'
      },
      CounterID: {
        label: 'Counter',
        defaultValue: null,
        // validators: [RequiredIf('FormatFor', Operator., ['RefundVoucherNo', 'ReceiptVoucherNo'])],
        // validationMessages: {
        //   requiredIf: 'Please select an option from the Counter List.'},
        // type: 'control'
      },
      StartNumber: {
        label: 'Start Number',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Start Number is Required.'},
        type: 'control'
      },
      WidthOfNumberPart: {
        label: 'Width Of Number Part',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Width of Number Part is Required.'},
        type: 'control'
      },
      PrefillZero: {
        label: 'Prefill Zero',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PrefixFront: {
        label: 'Prefix Front',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PrefixRear: {
        label: 'Prefix Rear',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      Suffix: {
        label: 'Suffix',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      EffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.'},
        type: 'control'
      },
      RestartType: {
        label: 'Restart',
        defaultValue: '1',
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Restart List.'},
        type: 'control'
      },
    }
  }
}
