import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PaymentTermMaster, PaymentTerm_IndexTableFilter, PaymentTerm_IndexTableList, PaymentTerm_SelectList, PaymentTermRequest } from './payment-term-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermMasterService {
  private endpoint = 'IMS/PaymentTermMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(model: PaymentTermRequest): Observable<ApiListResponse<PaymentTerm_SelectList>> {
    return this.apiService.post<ApiListResponse<PaymentTerm_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<PaymentTerm_IndexTableFilter>): Observable<ApiPagedListResponse<PaymentTerm_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<PaymentTerm_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(paymentTermID: number): Observable<ApiDataResponse<PaymentTermMaster>> {
    return this.apiService.post<ApiDataResponse<PaymentTermMaster>>(`${this.endpoint}/GetDetails?PaymentTermID=${paymentTermID}`, {});
  }

  CreateRecord(model: PaymentTermMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PaymentTermMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: PaymentTermMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<PaymentTerm_IndexTableFilter> {
    return {
      PaymentTermCode: '',
      PaymentTermName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<PaymentTermMaster> {
    return {
      PaymentTermID: {
        label: '',
        defaultValue: null,
      },
      PaymentTermCode: {
        label: 'Payment Term Code',
        defaultValue: 'NEW'
      },
      PaymentTermName: {
        label: 'Payment Term Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Payment Term Name is required'
        }
      },
      Description: {
        label: 'Description',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()],
      },
    };
  }
}