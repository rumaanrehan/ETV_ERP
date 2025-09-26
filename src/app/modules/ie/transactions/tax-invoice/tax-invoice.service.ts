import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { RequiredIf, Operator } from '../../../../shared/validators/required-if.validator';
import { TaxInvoice_IndexTableFilter, TaxInvoice, TaxInvoiceRequest, TaxInvoice_SelectList, TaxInvoiceDetail, TaxInvoice_IndexTableList, Document_SelectList } from './tax-invoice';
import { ApiService } from '../../../../core/services/api.service';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { ExportOrderService } from '../export-order/export-order.service';
import { Observable, forkJoin } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { StaticListRequest, StaticList } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { ExportOrder, ExportOrderDetail, ExportOrderRequest, ExportOrder_SelectList } from '../export-order/export-order';
import { ProformaInvoice, ProformaInvoice_SelectList, ProformaInvoiceDetail, ProformaInvoiceRequest } from '../proforma-invoice/proforma-invoice';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProformaInvoiceService } from '../proforma-invoice/proforma-invoice.service';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/currency-master/currency-master';
import { CurrencyMasterService } from '../../../admin/settings/currency-master/currency-master.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';

@Injectable({
  providedIn: 'root'
})
export class TaxInvoiceService {
  private endpoint = 'IE/TaxInvoice';

  constructor(
    private apiService: ApiService,
    private proformaInvoiceService: ProformaInvoiceService,
    private exportOrderService: ExportOrderService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private currencyMasterService: CurrencyMasterService,
    private selectListService: SelectListService
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

  GetProformaInvoiceList(model: ProformaInvoiceRequest): Observable<ApiListResponse<ProformaInvoice_SelectList>> {
    return this.proformaInvoiceService.PopulateList(model);
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

  GetProformaInvoiceDetails(proformaInvoice: number): Observable<ApiDataResponse<ProformaInvoice>> {
    return this.proformaInvoiceService.GetDetails(proformaInvoice);
  }

  GetExportOrderItemDetails(exportOrderID: number): Observable<ApiListResponse<ExportOrderDetail>> {
    return this.exportOrderService.GetOrderItemDetails(exportOrderID);
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
    console.log(model);
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
      BasedOn: 0,
      CustomerName: '',
      ActiveStatusID: 0
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
      BasedOn: {
        label: 'Based On',
        defaultValue: 1, // 1 is for Proforma Invoice. 2 is for Export Order, 3 is for Direct
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required"
        }
      },
      // ProformaInvoiceDate: {
      //   label: 'Proforma Invoice Date',
      //   defaultValue: null,
      //   validators: [Validators.required],
      //   validationMessages: {
      //     required: "Proforma Invoice is required"
      //   }
      // },
      TaxInvoiceDate: {
        label: 'Tax Invoice Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Tax Invoice is required"
        }
      },
      // ProformaInvoiceNo: {
      //   label: 'Proforma Invoice',
      //   defaultValue: null,
      //   validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
      //   validationMessages: {
      //     required: "Proforma Invoice is required"
      //   }
      // },
      // ExportOrderNo: {
      //   label: 'Export Order',
      //   defaultValue: null,
      //   validators: [RequiredIf("BasedOn", Operator.EqualTo, 2)],
      //   validationMessages: {
      //     required: "Export Order is required"
      //   }
      // },
      DocumentID: {
        label: 'Document ID',
        defaultValue: null,
        // validators: [RequiredIf("BasedOn", Operator.NotEqualTo, 3)],
        // validationMessages: {
        //   required: "Document is required"
        // }
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

  getDocumentAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<Document_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'DocumentNo',
      label: formConfig.DocumentNo.label,
      validationMessage: formConfig.DocumentNo.error,
      placeholder: 'Search Document',
      options: [],
      optionLabel: 'DocumentNo',
      columns: [
        { data: 'DocumentNo', label: 'Document No', width: '100px' },
        { data: 'CustomerName', label: 'Customer Name', width: '200px' }
      ],
    }
  }
  
  // getProformaInvoiceAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<ProformaInvoice_SelectList> {
  //   return {
  //     type: 'formControl',
  //     group: form,
  //     control: 'ProformaInvoiceNo',
  //     label: formConfig.ProformaInvoiceNo.label,
  //     validationMessage: formConfig.ProformaInvoiceNo.error,
  //     placeholder: 'Search ProformaInvoice',
  //     options: [],
  //     optionLabel: 'ProformaInvoiceNo',
  //     columns: [
  //       { data: 'ProformaInvoiceNo', label: 'ProformaInvoiceNo', width: '100px' },
  //       { data: 'CustomerName', label: 'Customer Name', width: '200px' }
  //     ],
  //   }
  // }
  
  // getExportOrderAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<ExportOrder_SelectList> {
  //   return {
  //     type: 'formControl',
  //     group: form,
  //     control: 'ExportOrderNo',
  //     label: formConfig.ExportOrderNo.label,
  //     validationMessage: formConfig.ExportOrderNo.error,
  //     placeholder: 'Search ExportOrder',
  //     options: [],
  //     optionLabel: 'ExportOrderNo',
  //     columns: [
  //       { data: 'ExportOrderNo', label: 'Export Order No', width: '100px' },
  //       { data: 'CustomerName', label: 'Customer Name', width: '200px' }
  //     ],
  //   }
  // }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
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

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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
