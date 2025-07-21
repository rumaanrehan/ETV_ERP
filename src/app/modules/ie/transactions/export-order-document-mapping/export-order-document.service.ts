import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder, ExportOrder_SelectList, ExportOrderRequest } from '../export-order/export-order';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ExportOrderService } from '../export-order/export-order.service';
import { HttpClient } from '@angular/common/http';
import { ExportOrderDocument_IndexTableFilter, ExportOrderDocument_IndexTableList, ExportOrderDocument } from './export-order-document';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderDocumentService {
  private endpoint = 'IE/ExportOrderDocument';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService,
    private http: HttpClient
  ) { } 
    
  GetExportOrderList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.exportOrderService.PopulateList(model);
  }

  PopulateGrid(model: DataTableParams<ExportOrderDocument_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrderDocument_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportOrderDocument_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  
  GetDetails(ExportOrderID: number): Observable<ApiDataResponse<ExportOrderDocument>> {
    return this.apiService.post<ApiDataResponse<ExportOrderDocument>>(`${this.endpoint}/GetDetails?ExportOrderID=${ExportOrderID}`, {});
  }

  CreateRecord(model: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`http://localhost:44316/api/${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrderDocument): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ExportOrderDocument): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ExportOrderDocument_IndexTableFilter> {
    return {
      ExportOrderNo: '',
      DocumentFile: '',
    }
  }

  getFormConfig(): FormConfigType<ExportOrderDocument> {
    return {
      ExportOrderDocumentID: {
        label: 'Export Order Document  ID',
        defaultValue: null
      },
        ExportOrderID: {
        label: 'Export Order',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order is required'
        }
      },
        ExportOrderNo: {
        label: 'Export Order No',
        defaultValue: null,        
      },
      DocumentTypeID: {
        label: 'Document Type  ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Document Type ID is required'
        }
      },
      DocumentFile: {
        label: 'Document File',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Document File is required'
        }
      },      
    }
  }
  
  getExportOrderAutoCompleteDef(formConfig: FormConfigType<ExportOrderDocument>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ExportOrderNo',  
      label: formConfig.ExportOrderID.label,  
      validationMessage: formConfig.ExportOrderID.error,  
      placeholder: 'Search Export Order',
      options: [],
      optionLabel: 'ExportOrderNo',  
      columns: [
        { data: 'ExportOrderNo', label: 'Export Order No', width: '300px' }  
      ],
    }
  }
}
