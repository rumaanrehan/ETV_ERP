import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { ImportOrderPayment, ImportOrderPayment_IndexTableFilter, ImportOrderPayment_IndexTableList, ImportOrderPayment_SelectList, ImportOrderPaymentRequest } from './import-order-payment';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../../shared/models/api-response';
import { DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../../shared/validators/not-only-whitespace.validator';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ImportOrder_SelectList } from '../import-order';

@Injectable({
  providedIn: 'root'
})
export class ImportOrderPaymentService {
  private endpoint = 'IE/ImportOrderPayment';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(model: ImportOrderPaymentRequest): Observable<ApiListResponse<ImportOrderPayment_SelectList>> {
    return this.apiService.post<ApiListResponse<ImportOrderPayment_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<ImportOrderPayment_IndexTableFilter>): Observable<ApiPagedListResponse<ImportOrderPayment_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ImportOrderPayment_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  
  GetDetails(PaymentID: number): Observable<ApiDataResponse<ImportOrderPayment>> {
    return this.apiService.post<ApiDataResponse<ImportOrderPayment>>(`${this.endpoint}/GetDetails?PaymentID=${PaymentID}`, {});
  }

  CreateRecord(model: ImportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ImportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ImportOrderPayment): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ImportOrderPayment_IndexTableFilter> {
    return {
      ImportOrderPaymentNo: '',
      PaymentRefNo: '',
      ImportOrderNo: '',
      PaymentDate: null,
      IsCanceled: 0
    }
  }

  getFormConfig(): FormConfigType<ImportOrderPayment> {
    return {
        ImportOrderPaymentID: {
        label: '',
        defaultValue: null,
      },
        ImportOrderPaymentNo: {
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
      ImportOrderID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Import Order ID is required'
        }
      },
      ImportOrderNo: {
        label: 'Import Order',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Import Order No is required'
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

  getImportOrderAutoCompleteDef(formConfig: FormConfigType<ImportOrderPayment>, form: FormGroup): AutoCompleteDef<ImportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ImportOrderNo',  
      label: formConfig.ImportOrderNo.label,  
      validationMessage: formConfig.ImportOrderNo.error,  
      placeholder: 'Search Import Order',
      options: [],
      optionLabel: 'ImportOrderNo',  
      columns: [
        { data: 'ImportOrderNo', label: 'Import Order No', width: '300px' },
      ],
    }
  }
}