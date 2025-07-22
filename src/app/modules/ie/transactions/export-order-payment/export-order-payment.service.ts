import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ExportOrderPayment, ExportOrderPayment_IndexTableFilter, ExportOrderPayment_IndexTableList, ExportOrderPayment_SelectList, ExportOrderPaymentRequest } from './export-payment';
import { Observable } from 'rxjs';
import { ExportOrder, ExportOrder_SelectList } from '../export-order/export-order';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderPaymentService {
  private endpoint = 'IE/ExportOrderPayment';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(model: ExportOrderPaymentRequest): Observable<ApiListResponse<ExportOrderPayment_SelectList>> {
    return this.apiService.post<ApiListResponse<ExportOrderPayment_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<ExportOrderPayment_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrderPayment_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportOrderPayment_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  
  GetDetails(PaymentID: number): Observable<ApiDataResponse<ExportOrderPayment>> {
    return this.apiService.post<ApiDataResponse<ExportOrderPayment>>(`${this.endpoint}/GetDetails?PaymentID=${PaymentID}`, {});
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
      ExportOrderNo: '',
      PaymentDate: null,
      IsCanceled: 0
    }
  }

  getFormConfig(): FormConfigType<ExportOrderPayment> {
    return {
        ExportOrderPaymentID: {
        label: '',
        defaultValue: null,
      },
        ExportOrderPaymentNo: {
        label: 'Payment No',
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
      ExportOrderID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order ID is required'
        }
      },
      ExportOrderNo: {
        label: 'Export Order',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order No is required'
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
        validators: [Validators.required],
        validationMessages: {
          required: 'Payment Amount No is required'
        }
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate to Base Currency', 
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Exchange Rate is required'
        }
      },
      PaymentAmountBC: {
        label: 'Payment Amount (BC)', 
        defaultValue: null,
      }
    }
  }

  getExportOrderAutoCompleteDef(formConfig: FormConfigType<ExportOrderPayment>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
      return {
        type: 'formControl',
        group: form,
        control: 'ExportOrderNo',  
        label: formConfig.ExportOrderNo.label,  
        validationMessage: formConfig.ExportOrderNo.error,  
        placeholder: 'Search Export Order',
        options: [],
        optionLabel: 'ExportOrderNo',  
        columns: [
          { data: 'ExportOrderNo', label: 'Export Order No', width: '300px' },
        ],
      }
    }
}
