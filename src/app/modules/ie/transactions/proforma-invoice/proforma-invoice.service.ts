import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { ExportOrder, ExportOrder_Detail, ExportOrder_SelectList, ExportOrderDetail, ExportOrderRequest } from '../export-order/export-order';
import { ExportOrderService } from '../export-order/export-order.service';
import { ProformaInvoice, ProformaInvoice_Detail, ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList, ProformaInvoice_SelectList, ProformaInvoiceDetail, ProformaInvoiceRequest } from './proforma-invoice';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/currency-master/currency-master';
import { CurrencyMasterService } from '../../../admin/settings/currency-master/currency-master.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { HttpClient } from '@angular/common/http';
import { Port_SelectList, PortRequest } from '../../settings/port-master/port-master';
import { PortMasterService } from '../../settings/port-master/port-master.service';
import { PaymentTerm_SelectList, PaymentTermRequest } from '../../settings/payment-term-master/payment-term-master';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { Environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProformaInvoiceService {
  private endpoint = 'IE/ProformaInvoice';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private currencyMasterService: CurrencyMasterService,
    private portService: PortMasterService,
    private selectListService: SelectListService,
    private paymentTermMasterService: PaymentTermMasterService,
    private http: HttpClient
  ) { }

  GetMasterDropdownLists(): Observable<{
    paymentTermList: ApiListResponse<PaymentTerm_SelectList>
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
    currencyList: ApiListResponse<Currency_SelectList>;
  }> {
    return forkJoin({
      paymentTermList: this.paymentTermMasterService.PopulateList({ PopulateType: 'SelectList' } as PaymentTermRequest),
      taxSlabList: this.taxSlabMasterService.PopulateList({ PopulateType: 'SelectList' } as TaxSlabRequest),
      currencyList: this.currencyMasterService.PopulateList({ PopulateType: 'SelectList' } as CurrencyRequest)
    });
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetExportOrderList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.exportOrderService.PopulateList(model);
  }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  PopulateList(model: ProformaInvoiceRequest): Observable<ApiListResponse<ProformaInvoice_SelectList>> {
    return this.apiService.post<ApiListResponse<ProformaInvoice_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<ProformaInvoice_IndexTableFilter>): Observable<ApiPagedListResponse<ProformaInvoice_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ProformaInvoice_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(proformaInvoiceID: number): Observable<ApiDataResponse<ProformaInvoice_Detail>> {
    return this.apiService.post<ApiDataResponse<ProformaInvoice_Detail>>(`${this.endpoint}/GetDetails?proformaInvoiceID=${proformaInvoiceID}`, {});
  }

  GetExportOrderDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder_Detail>> {
    return this.exportOrderService.GetDetails(exportOrderID);
  }

  GetPortList(model: PortRequest): Observable<ApiListResponse<Port_SelectList>> {
    return this.portService.PopulateList(model);
  }

  CreateRecord(model: ProformaInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ProformaInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelRecord(proformaInvoiceID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?proformaInvoiceID=${proformaInvoiceID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  GeneratePdf(request: any) {
    return this.http.post(`${Environment.apiBaseUrl}/${this.endpoint}/PrintInvoice`, request, { responseType: 'blob' });
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ProformaInvoice_IndexTableFilter> {
    return {
      ProformaInvoiceNo: '',
      BasedOn: 0,
      ExportOrderNo: '',
      CustomerName: '',
      StatusID: 0
    }
  }

  getFormConfig(): FormConfigType<ProformaInvoice> {
    return {
      ProformaInvoiceID: {
        label: '',
        defaultValue: null
      },
      ProformaInvoiceNo: {
        label: 'Proforma Invoice No',
        defaultValue: "NEW"
      },
      ProformaInvoiceDate: {
        label: 'Proforma Invoice Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Proforma Invoice is required"
        }
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 1, // 1 is for Export Order
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required"
        }
      },
      ExportOrderID: {
        label: 'Export Order',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Export Order is required"
        }
      },
      ExportOrderNo: {
        label: 'Export Order',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Export Order is required"
        }
      },
      ReferenceNo: {
        label: 'Reference Number',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Reference Number is required"
        }
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Reference Date is required"
        }
      },
      CustomerID: {
        label: 'Customer',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer is required"
        }
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: null,
      },
      FCCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null
      },
      ExchangeRateDate: {
        label: 'Exchange Date',
        defaultValue: null,
        validators: [RequiredIf('FCCurrencyID', Operator.NotEqualTo, null)],
        validationMessages: {
          RequiredIf: "Exchange Rate Date is required"
        }
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate to BC',
        defaultValue: null,
        validators: [RequiredIf('FCCurrencyID', Operator.NotEqualTo, null)],
        validationMessages: {
          RequiredIf: "Exchange Rate to Base Currency is required"
        }
      },
      BankChargesFC: {
        label: 'Bank Charge (FC)',
        defaultValue: null
      },
      BankChargesBC: {
        label: 'Bank Charge (BC)',
        defaultValue: null
      },
      FreightChargeFC: {
        label: 'Freight Charge (FC)',
        defaultValue: null
      },
      FreightChargeBC: {
        label: 'Freight Charge (BC)',
        defaultValue: null
      },
      InsuranceAmountFC: {
        label: 'Insurance Amount (FC)',
        defaultValue: null
      },
      InsuranceAmountBC: {
        label: 'Insurance Amount (BC)',
        defaultValue: null
      },
      ProductID: {
        label: '',
        defaultValue: null
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: null
      },
      ProductList: {
        type: 'array',
        items: {
          ProductID: {
            label: 'Product',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required"
            }
          },
          ProductName: {
            label: 'Product Name',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required"
            }
          },
          SalesQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Sales Qty is required"
            }
          },
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
          },
          SalesTaxRate: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax Rate is required"
            }
          },
          RatePerUnitFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Rate in foreign currency is required"
            }
          },
          RatePerUnitBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Rate is required"
            }
          },
          TaxableAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Taxable amount in foreign currency is required"
            }
          },
          TaxableAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Taxable Amount in base currency is required"
            }
          },
          TaxAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax in foreign currency is required"
            }
          },
          TaxAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax in base currency is required"
            }
          },
          SalesAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Sales amount in foreign currency is required"
            }
          },
          SalesAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Sales amount in base currency is required"
            }
          }
        }
      },
      Narration: {
        label: 'Narration',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      SubtotalAmountFC: {
        label: '',
        defaultValue: null
      },
      TaxAmountFC: {
        label: '',
        defaultValue: null
      },
      SubtotalAmountBC: {
        label: 'Subtotal Amount (BC)',
        defaultValue: null
      },
      TaxAmountBC: {
        label: 'Tax Amount (BC)',
        defaultValue: null
      },
      NetAmountFC: {
        label: '',
        defaultValue: null
      },
      NetAmountBC: {
        label: '',
        defaultValue: null
      }, PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Payment Terms are required"
        }
      },
      ShipmentModeID: {
        label: 'Shipment Mode',
        defaultValue: null
      },
      LoadingPortName: {
        label: 'Port Name',
        defaultValue: null
      },
      DischargePortName: {
        label: 'Port Name',
        defaultValue: null
      },
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: null
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: null
      },
      FinalDestination: {
        label: 'Final Destination',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Final Destination is required"
        }
      },
      StatusID: {
        label: '',
        defaultValue: 1
      },
      IsRoundOff: {
        label: 'Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: 'Coin Adjustment',
        defaultValue: null
      }
    };
  }

  getExportOrderAutoCompleteDef(formConfig: FormConfigType<ProformaInvoice>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ExportOrderNo',
      label: formConfig.ExportOrderNo.label,
      validationMessage: formConfig.ExportOrderNo.error,
      placeholder: 'Search ExportOrder',
      options: [],
      optionLabel: 'ExportOrderNo',
      columns: [
        { data: 'ExportOrderNo', label: 'Export Order No', width: '100px' },
        { data: 'CustomerName', label: 'Customer Name', width: '200px' }
      ],
    }
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<ProformaInvoice>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'CustomerName',
      label: formConfig.CustomerID.label,
      validationMessage: formConfig.CustomerID.error,
      placeholder: 'Search Customer',
      options: [],
      optionLabel: 'CompanyName',
      columns: [
        { data: 'CompanyCode', label: 'Code', width: '150px' },
        { data: 'CompanyName', label: 'Name', width: '150px' }
      ],
    }
  }

  getLoadingPortAutoCompleteDef(formConfig: FormConfigType<ProformaInvoice>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'LoadingPortName',
      label: formConfig.LoadingPortID.label,
      validationMessage: formConfig.LoadingPortID.error,
      placeholder: 'Search Port',
      options: [],
      optionLabel: 'PortName',
      columns: [
        { data: 'PortCode', label: 'Code', width: '150px' },
        { data: 'PortName', label: 'Name', width: '150px' }
      ],
    }
  }

  getDischargePortAutoCompleteDef(formConfig: FormConfigType<ProformaInvoice>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'DischargePortName',
      label: formConfig.DischargePortID.label,
      validationMessage: formConfig.DischargePortID.error,
      placeholder: 'Search Port',
      options: [],
      optionLabel: 'PortName',
      columns: [
        { data: 'PortCode', label: 'Code', width: '150px' },
        { data: 'PortName', label: 'Name', width: '150px' }
      ],
    }
  }

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<ProformaInvoice>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ProductName',
      label: formConfig.ProductName.label,
      validationMessage: formConfig.ProductName.error,
      placeholder: 'Search Product',
      options: [],
      optionLabel: 'ProductName',
      columns: [
        { data: 'ProductCode', label: 'Product Code', width: '100px' },
        { data: 'ProductName', label: 'Product Name', width: '200px' }
      ],
    }
  }
}
