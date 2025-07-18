import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder_SelectList, ExportOrderRequest } from '../../../ie/transactions/export-order/export-order';
import { ExportOrderService } from '../../../ie/transactions/export-order/export-order.service';
import { LetterOfCredit, LetterOfCredit_IndexTableFilter, LetterOfCredit_IndexTableList } from './letter-of-credit';

@Injectable({
  providedIn: 'root'
})
export class LetterOfCreditService {
  private endpoint = 'Admin/LetterOfCredit';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService
  ) {}
  
  GetExportOrderList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.exportOrderService.PopulateList(model);
  }
  
  PopulateGrid(model: DataTableParams<LetterOfCredit_IndexTableFilter>): Observable<ApiPagedListResponse<LetterOfCredit_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<LetterOfCredit_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(LCID: number): Observable<ApiDataResponse<LetterOfCredit>> {
    return this.apiService.post<ApiDataResponse<LetterOfCredit>>(`${this.endpoint}/GetDetails?LCID=${LCID}`, {});
  }

  CreateRecord(model: LetterOfCredit): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: LetterOfCredit): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteRecord(model: LetterOfCredit): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<LetterOfCredit_IndexTableFilter> {
    return {
      LCNo: '',
      ExportOrderNo: '',
      LCRefNo: '',
      BankName: ''
    }
  }

  getFormConfig(): FormConfigType<LetterOfCredit> {
    return {
      LCID: {
        label: '',
        defaultValue: null,
      },
      LCNo: {
        label: 'LC No',
        defaultValue: 'NEW'
      },
      ExportOrderID:{
        label: 'Export Order',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order is required'
        }
      },
      ExportOrderNo:{
        label: 'Export Order',
        defaultValue: null,
      },
      LCRefNo: {
        label: 'LC Ref No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'LC Ref No is required'
        }
      },
      IssuerBank: {
        label: 'Issuer Bank',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Issuer bank is required'
        }
      },
      IssueDate: {
        label: 'Issue Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Issue Date is required'
        }
      },
      LCAmountFC: {
        label: 'LC Amount FC',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'LC Amount is required'
        }
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate at Issue',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Exchange Rate is required'
        }
      },
      LCAmountBC: {
        label: 'LC Amount BC',
        defaultValue: null,
      },
      ExpiryDate: {
        label: 'Expiry Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Expiry Date is required'
        }
      }
    }
  }
    
  getExportOrderAutoCompleteDef(formConfig: FormConfigType<LetterOfCredit>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
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
        { data: 'ExportOrderNo', label: 'Export Order No', width: '300px' }  
      ]
    }
  }
}
