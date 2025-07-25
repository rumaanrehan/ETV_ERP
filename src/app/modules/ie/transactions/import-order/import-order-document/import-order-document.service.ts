import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { ImportOrderService } from '../import-order.service';
import { HttpClient } from '@angular/common/http';
import { ImportOrder_SelectList, ImportOrderRequest } from '../import-order';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../../shared/models/api-response';
import { DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ImportOrderDocument, ImportOrderDocument_IndexTableFilter, ImportOrderDocument_IndexTableList } from './import-order-document';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class ImportOrderDocumentService {
  private endpoint = 'IE/ImportOrderDocument';

  constructor(
    private apiService: ApiService,
    private importOrderService: ImportOrderService,
    private http: HttpClient
  ) { } 
    
  GetImportOrderList(model: ImportOrderRequest): Observable<ApiListResponse<ImportOrder_SelectList>> {
    return this.importOrderService.PopulateList(model);
  }

  PopulateGrid(model: DataTableParams<ImportOrderDocument_IndexTableFilter>): Observable<ApiPagedListResponse<ImportOrderDocument_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ImportOrderDocument_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }
  
  GetDetails(ImportOrderID: number): Observable<ApiDataResponse<ImportOrderDocument>> {
    return this.apiService.post<ApiDataResponse<ImportOrderDocument>>(`${this.endpoint}/GetDetails?ImportOrderID=${ImportOrderID}`, {});
  }

  CreateRecord(model: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`http://localhost:44316/api/${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ImportOrderDocument): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ImportOrderDocument): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ImportOrderDocument_IndexTableFilter> {
    return {
      ImportOrderNo: '',
      DocumentFile: '',
    }
  }

  getFormConfig(): FormConfigType<ImportOrderDocument> {
    return {
      ImportOrderDocumentID: {
        label: 'Import Order Document  ID',
        defaultValue: null
      },
        ImportOrderID: {
        label: 'Import Order',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Import Order is required'
        }
      },
        ImportOrderNo: {
        label: 'Import Order No',
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
  
  getImportOrderAutoCompleteDef(formConfig: FormConfigType<ImportOrderDocument>, form: FormGroup): AutoCompleteDef<ImportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ImportOrderNo',  
      label: formConfig.ImportOrderID.label,  
      validationMessage: formConfig.ImportOrderID.error,  
      placeholder: 'Search Import Order',
      options: [],
      optionLabel: 'ImportOrderNo',  
      columns: [
        { data: 'ImportOrderNo', label: 'Import Order No', width: '300px' }  
      ],
    }
  }
}
