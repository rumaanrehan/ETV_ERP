import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { RequiredIf, Operator } from '../../../../shared/validators/required-if.validator';
import { TaxInvoice_IndexTableFilter, TaxInvoice, TaxInvoiceRequest, TaxInvoice_SelectList, TaxInvoiceDetail, TaxInvoice_IndexTableList } from './tax-invoice';
import { ApiService } from '../../../../core/services/api.service';
import { CurrencyMasterService } from '../../../admin/settings/CurrencyMaster/currency-master.service';
import { TaxSlabMasterService } from '../../../admin/settings/TaxSlabMaster/tax-slab-master.service';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { ExportOrderService } from '../export-order/export-order.service';
import { Observable, forkJoin } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { StaticListRequest, StaticList } from '../../../../shared/models/select-list';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/CurrencyMaster/currency-master';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/TaxSlabMaster/tax-slab-master';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { ExportOrder, ExportOrderDetail, ExportOrderRequest, ExportOrder_SelectList } from '../export-order/export-order';
import { ProformaInvoice, ProformaInvoice_SelectList, ProformaInvoiceDetail } from '../proforma-invoice/proforma-invoice';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProformaInvoiceService } from '../proforma-invoice/proforma-invoice.service';

@Injectable({
  providedIn: 'root'
})
export class TaxInvoiceService {
  private endpoint = 'IE/TaxInvoice';

  constructor(
    private apiService: ApiService,
    private exportOrderService: ExportOrderService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private currencyMasterService: CurrencyMasterService,
    private selectListService: SelectListService,
    private proformaInvoiceService: ProformaInvoiceService
  ) { }

  GetMasterDropdownLists(): Observable<{
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
    currencyList: ApiListResponse<Currency_SelectList>;
  }> {
    return forkJoin({
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

  GetExportOrderDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder>> {
    return this.exportOrderService.GetDetails(exportOrderID);
  }

  GetExportOrderItemDetails(exportOrderID: number): Observable<ApiListResponse<ExportOrderDetail>> {
    return this.exportOrderService.GetOrderItemDetails(exportOrderID);
  }

  GetProformaInvoiceDetails(proformaInvoice: number): Observable<ApiDataResponse<ProformaInvoice>> {
    return this.proformaInvoiceService.GetDetails(proformaInvoice);
  }

  GetProformaInvoiceItemDetails(proformaInvoice: number): Observable<ApiListResponse<ProformaInvoiceDetail>> {
    return this.proformaInvoiceService.GetInvoiceItemDetails(proformaInvoice);
  }

  PopulateList(model: TaxInvoiceRequest): Observable<ApiListResponse<TaxInvoice_SelectList>> {
    return this.apiService.post<ApiListResponse<TaxInvoice_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<TaxInvoice_IndexTableFilter>): Observable<ApiPagedListResponse<TaxInvoice_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<TaxInvoice_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(taxInvoiceID: number): Observable<ApiDataResponse<TaxInvoice>> {
    return this.apiService.post<ApiDataResponse<TaxInvoice>>(`${this.endpoint}/GetDetails?taxInvoiceID=${taxInvoiceID}`, {});
  }

  GetInvoiceItemDetails(taxInvoiceID: number): Observable<ApiListResponse<TaxInvoiceDetail>> {
    return this.apiService.post<ApiListResponse<TaxInvoiceDetail>>(`${this.endpoint}/GetInvoiceItemDetails?taxInvoiceID=${taxInvoiceID}`, {});
  }

  CreateRecord(model: TaxInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: TaxInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelRecord(model: TaxInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }



  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<TaxInvoice_IndexTableFilter> {
    return {
      TaxInvoiceNo: '',
      CustomerName: '',
      StatusID: 0
    }
  }


  getFormConfig(): FormConfigType<TaxInvoice> {
    return {
      TaxInvoiceID: {
        label: '',
        defaultValue: null
      },
      TaxInvoiceNo: {
        label: 'Tax Invoice No',
        defaultValue: "NEW"
      },
      TaxInvoiceDate: {
        label: 'Tax Invoice Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Tax Invoice is required"
        }
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 1, // 1 is for Export Order. 2 is for Proforma Invoice, 3 is for Direct
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required"
        }
      },
      DocumentID: {
        label: 'Document',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.NotEqualTo, 3)],
        validationMessages: {
          required: "Document is required"
        }
      },
      DocumentNo: {
        label: 'Document No',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.NotEqualTo, 3)],
        validationMessages: {
          required: "Document No is required"
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
      },
      StatusID: {
        label: '',
        defaultValue: 1
      }
    };
  }
}
