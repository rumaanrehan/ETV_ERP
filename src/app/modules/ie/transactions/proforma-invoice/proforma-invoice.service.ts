import { Injectable } from '@angular/core';
import { ProformaInvoice, ProformaInvoiceDetail } from './proforma-invoice';
import { FormGroup, Validators } from '@angular/forms';
import { FormConfigType } from '../../../../shared/models/form.model';
import { RequiredIf, Operator } from '../../../../shared/validators/required-if.validator';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_SelectList, ExportOrderDetail, ExportOrderRequest } from '../export-order/export-order';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ApiService } from '../../../../core/services/api.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { ExportOrderService } from '../export-order/export-order.service';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { forkJoin, Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/TaxSlabMaster/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/TaxSlabMaster/tax-slab-master.service';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';

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
    private selectListService: SelectListService
  ) { }

  GetMasterDropdownLists(): Observable<{
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
  }> {
    return forkJoin({
      taxSlabList: this.taxSlabMasterService.PopulateList({ PopulateType: 'SelectList' } as TaxSlabRequest)
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

  PopulateList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.apiService.post<ApiListResponse<ExportOrder_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  // PopulateGrid(model: DataTableParams<ExportOrder_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrder_IndexTableList>> {
  //   return this.apiService.post<ApiPagedListResponse<ExportOrder_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  // }

  GetExportOrderDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder>> {
    return this.exportOrderService.GetDetails(exportOrderID);
  }

  GetExportOrderItemDetails(exportOrderID: number): Observable<ApiListResponse<ExportOrderDetail>> {
    return this.exportOrderService.GetOrderItemDetails(exportOrderID);
  }

  CreateRecord(model: ProformaInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ProformaInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ProformaInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<ExportOrder_IndexTableFilter> {
    return {
      ExportOrderNo: {
        label: 'Order No',
        defaultValue: ''
      },
      ReferenceNo: {
        label: 'Reference No',
        defaultValue: ''
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: ''
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: 0
      },
      DutyDrawableID: {
        label: 'Is Duty Drawable',
        defaultValue: 0
      },
      RoDTEPID: {
        label: 'Is RoDTEP',
        defaultValue: 0
      },
      ShipmentModeID: {
        label: 'Shipment Mode',
        defaultValue: 0
      },
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: 0
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
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
        label: 'Subtotal Amount(FC)',
        defaultValue: null
      },
      TaxAmountFC: {
        label: 'Tax Amount (FC)',
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
