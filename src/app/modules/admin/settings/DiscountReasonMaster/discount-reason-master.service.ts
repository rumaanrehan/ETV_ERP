import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { DiscountReasonMaster, DiscountReasonMasterList } from './discount-reason-master';

@Injectable({
  providedIn: 'root',
})
export class DiscountReasonMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<DiscountReasonMaster> {
    return {
      DiscountReasonID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DiscountReasonCode: {
        label: 'Discount Reason Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DiscountReasonName: {
        label: 'Discount Reason Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Discount Reason Name is Required.',
          maxlength: 'Discount Reason Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      IsAllowedAdditionalDescription: {
        label: 'Is Allowed Additional Description',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsAdditionalDescriptionRequired: {
        label: ' Is Additional Description Required',
        defaultValue: false,
        validators: [],
        validationMessages: {},
      },
      IsDiscountApprovalRequired: {
        label: 'Is Discount Approval Required',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      DiscountPercent: {
        label: 'Discount Percent',
        defaultValue: null,
        validators: [
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
          Validators.max(100),
        ],
        validationMessages: {
          max: 'Discount Percent must not exceed 100.',
          pattern: 'Discount Percent must be a valid number with up to two decimal places.',
        },
        type: 'control'
      },
      IsAllowedForOPRegistration: {
        label: 'Is Allowed For OP Registration',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsAllowedForBilling: {
        label: 'Is Allowed For Billing',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsAllowedForPharmacy: {
        label: 'Is Allowed For Pharmacy',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion


  PopulateList(PopulateType: any): Observable<ApiListResponse<DiscountReasonMasterList>> {
    return this.http.post<ApiListResponse<DiscountReasonMasterList>>(`${this.apiUrl}Admin/DiscountReasonMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<DiscountReasonMasterList>> {
    return this.http.post<ApiPagedListResponse<DiscountReasonMasterList>>(`${this.apiUrl}Admin/DiscountReasonMaster/PopulateGrid`, tabledata);
  }

  GetDetails(DiscountReasonID: number): Observable<ApiDataResponse<DiscountReasonMaster>> {
    return this.http.post<ApiDataResponse<DiscountReasonMaster>>(`${this.apiUrl}Admin/DiscountReasonMaster/GetDetails?DiscountReasonID=${DiscountReasonID}`, {});
  }

  CreateRecord(model: DiscountReasonMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DiscountReasonMaster/Create`, model);
  }

  UpdateRecord(model: DiscountReasonMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DiscountReasonMaster/Edit`, model);
  }

  DeleteRecord(model: DiscountReasonMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DiscountReasonMaster/Delete`, model);
  }
}
