import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/currency-master/currency-master';
import { CurrencyMasterService } from '../../../admin/settings/currency-master/currency-master.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { PaymentTerm_SelectList, PaymentTermRequest } from '../../settings/payment-term-master/payment-term-master';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { PurchaseQuotation_SelectList, PurchaseQuotation_IndexTableFilter, PurchaseQuotation_IndexTableList, PurchaseQuotation_Detail, PurchaseQuotation, PurchaseQuotation_IndexTableSort, PurchasesQuotationRequest } from './purchase-quotation';

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuotationService {
  private endpoint = 'IE/PurchaseQuotation';
  purchaseEnquiryService: any;

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private currencyMasterService: CurrencyMasterService,
    private selectListService: SelectListService
  ) { }

  GetMasterDropdownLists(): Observable<{
    paymentTermList: ApiListResponse<PaymentTerm_SelectList>;
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

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  GetPurchaseEnquiryList(model: PurchasesQuotationRequest): Observable<ApiListResponse<PurchaseQuotation_SelectList>> {
    return this.purchaseEnquiryService.PopulateList(model);
  }

  GetPurchaseEnquiryDetails(purchaseEnquiryID: number): Observable<ApiDataResponse<PurchaseQuotation_Detail>> {
    return this.purchaseEnquiryService.GetDetails(purchaseEnquiryID);
  }

  PopulateList(model: PurchasesQuotationRequest): Observable<ApiListResponse<PurchaseQuotation_SelectList>> {
    return this.apiService.post<ApiListResponse<PurchaseQuotation_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<PurchaseQuotation_IndexTableFilter>): Observable<ApiPagedListResponse<PurchaseQuotation_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<PurchaseQuotation_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(purchaseQuotationID: number): Observable<ApiDataResponse<PurchaseQuotation_Detail>> {
    return this.apiService.post<ApiDataResponse<PurchaseQuotation_Detail>>(`${this.endpoint}/GetDetails?purchaseQuotationID=${purchaseQuotationID}`, {});
  }

  CreateRecord(model: PurchaseQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PurchaseQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelQuotation(quotationID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?quotationID=${quotationID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  getFormConfig_DataTableFilter(): FormConfigType<PurchaseQuotation_IndexTableFilter> {
    return {
      PurchaseQuotationNo: {
        label: 'Purchase Quotation No',
        defaultValue: ''
      },
      VendorName: {
        label: 'Vendor Name',
        defaultValue: ''
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 0
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<PurchaseQuotation_IndexTableSort> {
    return {
      PurchaseQuotationNo: {
        label: 'Purchase Quotation No',
        defaultValue: -1
      },
      PurchaseQuotationDate: {
        label: 'Quotation Date',
        defaultValue: 0
      },
      NetAmountFC: {
        label: 'Quotation Amount',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig(): FormConfigType<PurchaseQuotation> {
    return {
      PurchaseQuotationID: {
        label: '',
        defaultValue: null
      },
      PurchaseQuotationNo: {
        label: 'Purchase Quotation No',
        defaultValue: "NEW"
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 2,
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required"
        }
      },
      PurchaseQuotationDate: {
        label: 'Purchase Quotation Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Purchase Quotation Date is required"
        }
      },
      VendorID: {
        label: 'Vendor ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Vendor ID is required"
        }
      },
      VendorName: {
        label: 'Vendor Name',
        defaultValue: null
      },
      PurchaseRequisitionID: {
        label: 'Purchase Requisition ID',
        defaultValue: null
      },
      PurchaseRequisitionNo: {
        label: 'Purchase Requisition No',
        defaultValue: null
      },
      ValidityDate: {
        label: 'Validity Date',
        defaultValue: null
      },
      FCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Foreign Currency is required"
        }
      },
      ExchangeRateDate: {
        label: 'Exchange Rate Date',
        defaultValue: new Date(),
        validators: [Validators.required],
        validationMessages: {
          required: "Exchange Rate is required"
        }
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Exchange Rate Date is required"
        }
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Incoterm id Required"
        }
      },

      ProductList: {
        type: 'array',
        items:
        {
          ProductID: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required"
            }
          },
          ProductName: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product name is required"
            }
          },
          UOM: {
            label: '',
            defaultValue: null
          },
          QuotedQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Quoted quantity is required"
            }
          },
          TaxRate: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax rate is required"
            }
          },
          RatePerUnitFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Rate per unit in foreign currency is required"
            }
          },
          RatePerUnitBC: {
            label: '',
            defaultValue: null,
          },
          TaxableAmountFC: {
            label: '',
            defaultValue: null,
          },
          TaxableAmountBC: {
            label: '',
            defaultValue: null,
          },
          TaxAmountFC: {
            label: '',
            defaultValue: null,
          },
          TaxAmountBC: {
            label: '',
            defaultValue: null,
          },
          QuotationAmountFC: {
            label: '',
            defaultValue: null
          },
          QuotationAmountBC: {
            label: '',
            defaultValue: null,
          }
        }
      },
      PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null
      },
      SubtotalAmountFC: {
        label: '',
        defaultValue: null
      },
      SubtotalAmountBC: {
        label: '',
        defaultValue: null
      },
      TaxAmountFC: {
        label: '',
        defaultValue: null
      },
      TaxAmountBC: {
        label: '',
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
      IsRoundOff: {
        label: 'Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: '',
        defaultValue: null
      },
      ProductID: {
        label: '',
        defaultValue: null
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: null
      }
    };
  }

  getPurchaseEnquiryAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotation>, form: FormGroup): AutoCompleteDef<PurchaseQuotation_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'PurchaseEnquiryNo',
      label: formConfig.QuotationNo.label,
      placeholder: 'Search Purchase Enquiry',
      options: [],
      optionLabel: 'PurchaseEnquiryNo',
      columns: [
        { data: 'PurchaseEnquiryNo', label: 'Purchase Enquiry No', width: '200px' },
        { data: 'CustomerName', label: 'Customer Name', width: '200px' }
      ],
    }
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotation>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'VendorName',
      label: formConfig.VendorName.label,
      validationMessage: formConfig.VendorName.error,
      placeholder: 'Search Customer',
      options: [],
      optionLabel: 'CompanyName',
      columns: [
        { data: 'CompanyCode', label: 'Code', width: '150px' },
        { data: 'CompanyName', label: 'Name', width: '150px' }
      ],
    }
  }

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotation>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<PurchaseQuotation_IndexTableList> {
    return {
      tableKey: 'IE_SalesQuotation_IndexDataView',
      defaultSortColumn: { sortField: 'QuotationNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'QuotationNo', label: 'Quotation No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        {
          field: 'BasedOn',
          label: 'Based On',
          type: 'dropdown',
        },
        {
          field: 'StatusID',
          label: 'Status',
          type: 'dropdown'
        }
      ],
      sortFields: [
        { field: 'QuotationNo', label: 'Quotation No', enabled: true, order: 1 },
        { field: 'QuotationDate', label: 'Quotation Date', enabled: true, order: 0 },
        { field: 'NetAmountFC', label: 'Quotation Amount', enabled: true, order: 0 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}