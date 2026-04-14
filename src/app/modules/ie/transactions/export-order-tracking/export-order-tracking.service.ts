import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder_SelectList, ExportOrderRequest } from '../export-order/export-order';
import { ExportOrderService } from '../export-order/export-order.service';
import { ExportOrderTracking } from './export-order-tracking';

@Injectable({
  providedIn: 'root'
})
export class ExportContainerService {
  private endpoint = 'IE/ExportOrderTracking';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService
  ) { }

  GetExportOrderList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.exportOrderService.PopulateList(model);
  }

  CreateRecord(model: ExportOrderTracking): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrderTracking): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  //#region Form Configuration
  // getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ExportContainer_IndexTableFilter> {
  //   return {
  //     ContainerNo: '',
  //     ContainerType: ''
  //   }
  // }

  getFormConfig(): FormConfigType<ExportOrderTracking> {
    return {
      ExportOrderID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Export Order is required'
        }
      },
      ExportOrderNo: {
        label: 'Export Order',
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
      TrackingURL: {
        label: 'Tracking URL',
        defaultValue: null,
        validators: [Validators.required, Validators.email],
        validationMessages: {
          required: 'Container Tracking URL is required.',
          email: 'Please enter a valid email address.'
        }
      }
    }
  }

  getExportOrderAutoCompleteDef(formConfig: FormConfigType<ExportOrderTracking>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ExportOrderNo',
      label: formConfig.ExportOrderNo.label,
      validationMessage: formConfig.ExportOrderNo.error,
      placeholder: 'Search Export Orders',
      options: [],
      optionLabel: 'ExportOrderNo',
      columns: [
        { data: 'ExportOrderNo', label: 'Export Order No', width: '300px' }
      ],
      multiple: true
    }
  }
}