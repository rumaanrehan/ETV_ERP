import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrderService } from '../ExportOrder/export-order.service';
import { LetterOfCredit, LetterOfCredit_IndexTableFilter, LetterOfCredit_IndexTableList } from './letter-of-credit';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ExportOrder, ExportOrderListRequest } from '../ExportOrder/export-order';

@Injectable({
  providedIn: 'root'
})
export class LetterOfCreditService {
  private endpoint = 'Admin/LetterOfCredit';

  constructor(
    private apiService: ApiService,
        private exportOrderService: ExportOrderService
  ) {}
  
  GetExportOrderList(model: ExportOrderListRequest): Observable<ApiListResponse<ExportOrder>> {
    return this.exportOrderService.GetExportOrderList(model);
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
      ExportOrders:{
        label: 'Export Order',
        defaultValue: null,
        // validators: [Validators.required],
        // validationMessages: {
        //   required: 'Export Order is required'
        // }
      },
      LCDate: {
        label: 'LC Date',
        defaultValue: null,
        validators: [Validators.required]
      },
      IssuerBankID: {
        label: 'Issuer Bank ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order is required'
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
      ExpiryDate: {
        label: 'Expiry Date',
        defaultValue: null,
        validators: [Validators.required]
      }
    }
  }
    
  getExportOrderAutoCompleteDef(formConfig: FormConfigType<LetterOfCredit>, form: FormGroup): AutoCompleteDef<ExportOrder> {
    return {
      type: 'formControl',
      group: form,
      control: 'ExportOrders',  
      label: formConfig.ExportOrders.label,  
      validationMessage: formConfig.ExportOrders.error,  
      placeholder: 'Search Export Orders',
      options: [],
      optionLabel: 'ExportOrder',  
      columns: [
        { data: 'ExportOrderNo', label: 'ExportOrderNo', width: '300px' }  
      ],
      multiple: true
    }
  }
}
