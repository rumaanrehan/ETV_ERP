import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { NumberFormat, NumberFormatList } from './number-format';

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  GetDetails(model: NumberFormat): Observable<ApiListResponse<NumberFormatList>> {
    console.log(model);
    return this.http.post<ApiListResponse<NumberFormatList>>(`${this.apiUrl}Admin/NumberFormat/GetDetails`, model);
  }

  CreateRecord(model: NumberFormat): Observable<ApiResponse> {
    console.log(model);
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/NumberFormat/Create`, model);
  }

  getFormConfig(): FormConfigType<NumberFormat> {
    return {
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
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Restart List.'},
        type: 'control'
      },
      PopulateType: {
        label: "PopulateType",
        defaultValue: ""
      }
    }
  }
}
