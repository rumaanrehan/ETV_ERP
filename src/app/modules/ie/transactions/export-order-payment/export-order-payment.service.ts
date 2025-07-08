import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ExportOrderPayment, ExportOrderPayment_IndexTableFilter, ExportOrderPayment_IndexTableList, ExportOrderPaymentRequest } from './export-payment';
import { Observable } from 'rxjs';
import { ExportOrder_SelectList } from '../export-order/export-order';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderPaymentService {
  private endpoint = 'IE/ExportOrderPayment';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(model: ExportOrderPaymentRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.apiService.post<ApiListResponse<ExportOrder_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<ExportOrderPayment_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrderPayment_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportOrderPayment_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(exportOrderPaymentID: number): Observable<ApiDataResponse<ExportOrderPayment>> {
    return this.apiService.post<ApiDataResponse<ExportOrderPayment>>(`${this.endpoint}/GetDetails?ExportOrderPaymentID=${exportOrderPaymentID}`, {});
  }

  CreateRecord(model: ExportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ExportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ExportOrderPayment_IndexTableFilter> {
    return {
      ExportOrderPaymentNo: '',
      PaymentRefNo: '',
      // PaymentDate: 0,
      IsCanceled: false
    }
  }

  getFormConfig(): FormConfigType<ExportOrderPayment> {
    return {
      ExportOrderPaymentID: {
        label: '',
        defaultValue: null,
      },
      ExportOrderPaymentNo: {
        label: 'Export Order Payment No',
        defaultValue: 'NEW'
      },
      PaymentRefNo: {
        label: 'Payment Reference No',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Payment Reference No is required'
        }
      },
      PaymentDate: {
        label: 'Payment Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Payment Date is required'
        }
      },
      PaymentAmountFC: {
        label: 'Payment Amount (FC)',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Payment Amount No is required'
        }
      },
    }
  }
}
