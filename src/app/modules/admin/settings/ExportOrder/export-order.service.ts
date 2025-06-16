import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList } from './export-order';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderService {
  private endpoint = 'Admin/ExportOrder';

  constructor(
    private apiService: ApiService
  ) { }
  
  PopulateGrid(model: DataTableParams<ExportOrder_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrder_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportOrder_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder>> {
    return this.apiService.post<ApiDataResponse<ExportOrder>>(`${this.endpoint}/GetDetails?exportOrderID=${exportOrderID}`, {});
  }

  CreateRecord(model: ExportOrder): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrder): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<ExportOrder_IndexTableFilter> {
    return {
      ExportOrderNo: {
        label: 'Order No',
        defaultValue: null
      },
      StatusID: {
        label: 'Status',
        defaultValue: null
      }
    };
  }

  getFormConfig(): FormConfigType<ExportOrder> {
    return {
      ExportOrderID: {
        label: 'Order No',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ExportOrderNo: {
        label: 'Order No',
        defaultValue: "NEW",
        validators: [],
        validationMessages: {}
      },
      ExportOrderDate: {
        label: 'Order Date',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ReferenceNo: {
        label: 'Reference Number',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      PaymentReferenceNo: {
        label: 'Payment Reference Number',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      CustomerID: {
        label: 'Customer',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      CustomerAddress: {
        label: 'Customer Address',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      CurrencyID: {
        label: 'Currency',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ExchangeRateDate: {
        label: 'Exchange Rate Date',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate to BC',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      FreightChargeBC: {
        label: 'Freight Charge (BC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      InsuranceAmountBC: {
        label: 'Insurance Amount (BC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      IsDutyDrawable: {
        label: 'Is Duty Drawable',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsRoDTEP: {
        label: 'Is RoDTEP',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      ProductList: {
        type: 'array',
        items: {
          ProductID: {
            label: 'Product',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Product is required"
            }
          },
          Quantity: {
            label: 'Quantity',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Quantity is required"
            }
          },
          RatePerUnitBC: {
            label: 'Rate Per Unit',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Rate is required"
            }
          }
        }
      },
      AmountBeforeTaxFC: {
        label: 'Amount Before Tax (FC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TaxAmountFC: {
        label: 'Tax Amount (FC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      AmountBeforeTaxBC: {
        label: 'Amount Before Tax (BC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      TaxAmountBC: {
        label: 'Tax Amount (BC)',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      PaymentTerms: {
        label: 'Payment Terms',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ShipmentMode: {
        label: 'Shipment Mode',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DestinationName: {
        label: 'Destination Name',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      Narration: {
        label: 'Narration',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StatusID: {
        label: 'Status',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      }
    };
  }
}
