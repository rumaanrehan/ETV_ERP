import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { ImportOrderService } from '../import-order.service';
import { ImportOrder_SelectList, ImportOrderRequest } from '../import-order';
import { Observable } from 'rxjs';
import { ApiListResponse, ApiResponse } from '../../../../../shared/models/api-response';
import { ImportOrderTracking } from './import-order-tracking';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class ImportOrderTrackingService {
  private endpoint = 'IE/ImportOrderTracking';

  constructor(
    private apiService: ApiService,
    private importtOrderService: ImportOrderService
  ) {}
 
  GetImportOrderList(model: ImportOrderRequest): Observable<ApiListResponse<ImportOrder_SelectList>> {
    return this.importtOrderService.PopulateList(model);
  }
  // GetImportOrderList(model: ImportOrderRequest): Observable<ApiDataResponse<ImportOrder>> {
  //   return this.ImportOrderService.PopulateList(model);
  // }
  
  // PopulateGrid(model: DataTableParams<ImportContainer_IndexTableFilter>): Observable<ApiPagedListResponse<ImportContainer_IndexTableList>> {
  //   return this.apiService.post<ApiPagedListResponse<ImportContainer_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  // }

  // GetDetails(importOrderID: number): Observable<ApiDataResponse<ImportContainer>> {
  //   return this.apiService.post<ApiDataResponse<ImportContainer>>(`${this.endpoint}/GetDetails?importOrderID=${importOrderID}`, {});
  // }

  CreateRecord(model: ImportOrderTracking): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ImportOrderTracking): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  // DeleteRecord(model: ImportContainer): Observable<ApiResponse> {
  //   return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  // }

  //#region Form Configuration
  // getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ImportContainer_IndexTableFilter> {
  //   return {
  //     ContainerNo: '',
  //     ContainerType: ''
  //   }
  // }

  getFormConfig(): FormConfigType<ImportOrderTracking> {
    return {
      ImportOrderID:{
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Import Order is required'
        }
      },
      ImportOrderNo:{
        label: 'Import Order',
        defaultValue: null,
      },
      ContainerNo: {
        label: 'Container No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Container No is required'
        }
      },
      ContainerTypeID: {
        label: 'Container Type',
        defaultValue: null,
      },
      ShippedDate: {
        label: 'Shipped Date',
        defaultValue: null,
        // validators: [Validators.required]
      },
      EstimatedArrivalDate: {
        label: 'Estimated Arrival Date',
        defaultValue: null,
        // validators: [Validators.required]
      },
      TrackingURL:{
        label: 'Tracking URL',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Container Tracking URL is required'
        }
      }
    }
  }
  
  getImportOrderAutoCompleteDef(formConfig: FormConfigType<ImportOrderTracking>, form: FormGroup): AutoCompleteDef<ImportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ImportOrderNo',  
      label: formConfig.ImportOrderNo.label,  
      validationMessage: formConfig.ImportOrderNo.error,  
      placeholder: 'Search Import Orders',
      options: [],
      optionLabel: 'ImportOrderNo',  
      columns: [
        { data: 'ImportOrderNo', label: 'Import Order No', width: '300px' }  
      ],
      multiple: true
    }
  }
}