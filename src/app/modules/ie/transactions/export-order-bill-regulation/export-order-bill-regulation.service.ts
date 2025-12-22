import { Injectable } from '@angular/core';
import { ExportOrderService } from '../export-order/export-order.service';
import { ExportOrderBillRegulation, ExportOrderBillRegulationRequest } from './export-order-bill-regulation';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderBillRegulationService {

  constructor(
    private exportOrderService: ExportOrderService,
  ) { }

  AddBillRegulationRecord(model: ExportOrderBillRegulationRequest): Observable<ApiResponse> {
    debugger;
    return this.exportOrderService.AddBillRegulationRecord(model);
  }

  GetBillRegulationRecord(exportOrderID: number | null): Observable<ApiDataResponse<ExportOrderBillRegulationRequest>> {
    return this.exportOrderService.GetBillRegulationRecord(exportOrderID);
  }

  UpdateBillRegulationRecord(model: ExportOrderBillRegulationRequest): Observable<ApiResponse> {
    return this.exportOrderService.UpdateBillRegulationRecord(model);
  }  
  
  getFormConfig(): FormConfigType<ExportOrderBillRegulation> {
    return {
      ExportOrderID: {
        label: '',  
        defaultValue: null
      },
      ExportOrderNo: {
        label: 'Export Order No',
        defaultValue: null
      },
      ShippingBill:{
        label: 'Shipping Bill',
        defaultValue: false
      },
      AirwayBill:{
        label: 'Airway Bill',
        defaultValue: false
      },
      IECCertificate:{
        label: 'IEC Certificate',
        defaultValue: false
      },
      Invoice:{
        label: 'Invoice',
        defaultValue: false
      },
      PackingSlip:{
        label: 'Packing Slip',
        defaultValue: false
      },
      CustomerPO:{
        label: 'Customer PO',
        defaultValue: false
      }
    };
  }
}
