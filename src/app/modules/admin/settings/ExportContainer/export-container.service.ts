import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrderService } from '../ExportOrder/export-order.service';
import { ExportContainer, ExportContainer_IndexTableFilter, ExportContainer_IndexTableList } from './export-container';
import { FormGroup, Validators } from '@angular/forms';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ExportOrder, ExportOrderListRequest } from '../ExportOrder/export-order';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class ExportContainerService {
  private endpoint = 'Admin/ExportContainer';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService
  ) {}

  GetExportOrderList(model: ExportOrderListRequest): Observable<ApiListResponse<ExportOrder>> {
    return this.exportOrderService.GetExportOrderList(model);
  }
  
  PopulateGrid(model: DataTableParams<ExportContainer_IndexTableFilter>): Observable<ApiPagedListResponse<ExportContainer_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportContainer_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(exportOrderID: number): Observable<ApiDataResponse<ExportContainer>> {
    return this.apiService.post<ApiDataResponse<ExportContainer>>(`${this.endpoint}/GetDetails?ExportOrderID=${exportOrderID}`, {});
  }

  CreateRecord(model: ExportContainer): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportContainer): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteRecord(model: ExportContainer): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ExportContainer_IndexTableFilter> {
    return {
      ContainerNo: '',
      ContainerType: ''
    }
  }

  getFormConfig(): FormConfigType<ExportContainer> {
    return {
      ContainerID: {
        label: '',
        defaultValue: null,
      },
      ContainerNo: {
        label: 'Container No',
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
      ContainerType: {
        label: 'Container Type',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Container Type is required'
        }
      },
      ShippedDate: {
        label: 'Shipped Date',
        defaultValue: null,
        validators: [Validators.required]
      },
      EstimatedArrivalDate: {
        label: 'Estimated Arrival Date',
        defaultValue: null,
        validators: [Validators.required]
      },
      TrackingURL:{
        label: 'Item Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Item Type is required'
        }
      }
    }
  }
  
  getExportOrderAutoCompleteDef(formConfig: FormConfigType<ExportContainer>, form: FormGroup): AutoCompleteDef<ExportOrder> {
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