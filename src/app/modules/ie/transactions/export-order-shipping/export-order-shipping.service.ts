import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrderService } from '../export-order/export-order.service';
import { ExportOrderShipping } from './export-order-shipping';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderShippingService {

  constructor(
    private exportOrderService: ExportOrderService,
  ) { }

  AddShippingRecord(model: ExportOrderShipping): Observable<ApiResponse> {
    return this.exportOrderService.AddShippingRecord(model);
  }

  GetShippingRecord(exportOrderID: number | null): Observable<ApiDataResponse<ExportOrderShipping>> {
    return this.exportOrderService.GetShippingRecord(exportOrderID);
  }

  UpdateShippingRecord(model: ExportOrderShipping): Observable<ApiResponse> {
    return this.exportOrderService.UpdateShippingRecord(model);
  }

  getFormConfig(): FormConfigType<ExportOrderShipping> {
    return {
      ExportOrderID: {
        label: '',
        defaultValue: null
      },
      ExportOrderNo: {
        label: 'Export Order No',
        defaultValue: null
      },
      ShippingBillNo: {
        label: 'Shipping Bill No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Shipping Bill No is required"
        }
      },
      ShippingBillDate: {
        label: 'Shipping Bill Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Shipping Bill Date is required"
        }
      },
      AirwayBillNo: {
        label: 'Airway Bill No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Airway Bill No is required"
        }
      },
      AirwayBillDate: {
        label: 'Airway Bill Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Airway Bill Date is required"
        }
      }
    };
  }
}
