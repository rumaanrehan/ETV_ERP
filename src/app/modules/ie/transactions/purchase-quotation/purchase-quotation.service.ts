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
import { PurchaseQuotation_SelectList, PurchaseQuotation_IndexTableFilter, PurchaseQuotation_IndexTableList, PurchaseQuotation_Detail, PurchaseQuotation, PurchaseQuotation_IndexTableSort, PurchaseQuotationRequest, PurchaseQuotationDetail, PurchaseQuotationBulkUpdateRequest } from './purchase-quotation';
import { Environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CurrencyExchangeService } from '../../../../shared/services/currency-exchange.service';
import { ExchangeRateResponse, GetExchangeRateRequest } from '../../../../shared/models/currency';
import { LessThanOrEqual } from '../../../../shared/validators/less-than-equal-to.validator';
import { GreaterThanOrEqual } from '../../../../shared/validators/greater-than-equal-to.validator';
import { noFractionValidator } from '../../../../shared/validators/no-fraction.validator';
import { NonZero } from '../../../../shared/validators/non-zero.validator';

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuotationService {
  private endpoint = 'IE/PurchaseQuotation';
  purchaseRequisitionService: any;

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private currencyMasterService: CurrencyMasterService,
    private selectListService: SelectListService,
    private currencyExchangeService: CurrencyExchangeService,
    private http: HttpClient,
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

  GetExchangeRate(model: GetExchangeRateRequest): Observable<ApiDataResponse<ExchangeRateResponse>> {
    return this.currencyExchangeService.GetRate(model);
  }
  GeneratePdf(request: any) {
    return this.http.post(`${Environment.apiBaseUrl}/${this.endpoint}/PrintInvoice`, request, { responseType: 'blob' });
  }
  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  BulkChangeStatus(model: PurchaseQuotationBulkUpdateRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/BulkChangeStatus`, model);
  }
  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  GetPurchaseRequisitionList(model: PurchaseQuotationRequest): Observable<ApiListResponse<PurchaseQuotation_SelectList>> {
    return this.purchaseRequisitionService.PopulateList(model);
  }

  GetPurchaseRequisitionDetails(purchaseRequisitionID: number): Observable<ApiDataResponse<PurchaseQuotation_Detail>> {
    return this.purchaseRequisitionService.GetDetails(purchaseRequisitionID);
  }

  PopulateList(model: PurchaseQuotationRequest): Observable<ApiListResponse<PurchaseQuotation_SelectList>> {
    return this.apiService.post<ApiListResponse<PurchaseQuotation_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<PurchaseQuotation_IndexTableFilter>): Observable<ApiPagedListResponse<PurchaseQuotation_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<PurchaseQuotation_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(PurchaseQuotationID: number): Observable<ApiDataResponse<PurchaseQuotation_Detail>> {
    return this.apiService.post<ApiDataResponse<PurchaseQuotation_Detail>>(`${this.endpoint}/GetDetails?purchaseQuotationID=${PurchaseQuotationID}`, {});
  }

  CreateRecord(model: PurchaseQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PurchaseQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelQuotation(purchaseQuotationID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?PurchaseQuotationID=${purchaseQuotationID}&reasonToUpdate=${reasonToUpdate}`, {});
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
        defaultValue: null
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
        label: 'Quotation Date',
        defaultValue: new Date(),
        validators: [Validators.required, LessThanOrEqual("ValidityDate")],
        validationMessages: {
          required: "Quotation Date is required.",
          lessThanOrEqual: "Quotation Date should be less than Validity Date."
        },
        type: 'control'
      },
      VendorID: {
        label: 'Vendor',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Vendor ID is required"
        },
        type: 'control'
      },
      VendorName: {
        label: 'Vendor Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Vendor is required."
        },
        type: 'control'
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
        defaultValue: null,
        validators: [GreaterThanOrEqual('PurchaseQuotationDate')],
        validationMessages: {
          greaterThanOrEqual: "Validity Date should be greater than Quotation Date."
        },
        type: 'control'
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
          required: "Exchange Rate is required.",
          nonZero: "Exchange Rate cannot be 0."
        },
        type: 'control'
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
        items: {
          ProductID: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required."
            },
            type: 'control'
          },
          ProductName: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product name is required."
            },
            type: 'control'
          },
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
          },
          HSCode: {
            label: 'HS Code',
            defaultValue: null,
            // validators: [Validators.minLength(2), Validators.maxLength(8), Validators.pattern(/^\d{2,8}$/)],
            // validationMessages: {
            //   minlength: "HS Code must be at least 2 digits.",
            //   maxlength: "HS Code cannot exceed 8 digits.",
            //   pattern: "HS Code must contain only digits."
            // },
            // type: 'control'
          },
          QuotedQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, Validators.min(1), Validators.max(99999), noFractionValidator()],
            validationMessages: {
              required: "Quoted quantity is required.",
              min: "Requested Qty must be at least 1.",
              max: "Requested Qty cannot exceed 99999.",
              noFraction: "Quoted quantity cannot have fractions."
            },
            type: 'control'
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
            validators: [Validators.required, NonZero(), Validators.max(10000000)],
            validationMessages: {
              required: "Rate in foreign currency is required.",
              nonZero: "Rate per unit cannot be 0.",
              max: "Maximum Rate Per Unit allowed is 10,000,000."
            },
            type: 'control'
          },
          RatePerUnitBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Amounts are not converted into base currency.",
              nonZero: "Rate per unit cannot be 0."
            },
            type: 'control'
          },
          TaxableAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Amounts are not converted into base currency.",
              nonZero: "Taxable Amount cannot be 0."
            },
            type: 'control'
          },
          TaxableAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Amounts are not converted into base currency.",
              nonZero: "Taxable Amount cannot be 0."
            },
            type: 'control'
          },
          TaxAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax Amount is required."
            },
            type: 'control'
          },
          TaxAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Amounts are not converted into base currency."
            },
            type: 'control'
          },
          TotalAmountFC: {
            label: '',
            defaultValue: null
          },
          TotalAmountBC: {
            label: '',
            defaultValue: null,
          }
        }
      },
      PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null
      },
      Narration: {
        label: 'Note',
        defaultValue: null,
        validators: [Validators.maxLength(500)],
        validationMessages: {
          maxLength: "Note cannot exceed 500 characters."
        },
        type: 'control'
      },
      SubtotalAmountFC: {
        label: '',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Subtotal FC must be equal to the sum of Taxable Amount FC in Product List.",
          nonZero: "Subtotal Amount cannot be 0."
        },
        type: 'control'
      },
      SubtotalAmountBC: {
        label: 'Subtotal Amount (BC)',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Amounts are not converted into base currency.",
          nonZero: "Subtotal Amount cannot be 0."
        },
        type: 'control'
      },
      TaxAmountFC: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Tax Amount FC must be equal to the sum of Tax Amount FC in Product List."
        },
        type: 'control'
      },
      TaxAmountBC: {
        label: 'Tax Amount (BC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Amounts are not converted into base currency."
        },
        type: 'control'
      },
      NetAmountFC: {
        label: '',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Net Amount FC must be equal to the sum of all amount in the order.",
          nonZero: "Net Amount cannot be 0."
        },
        type: 'control'
      },
      NetAmountBC: {
        label: '',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Amounts are not converted into base currency.",
          nonZero: "Net Amount cannot be 0."
        },
        type: 'control'
      },        
      IsRoundOff: {
        label: 'Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: 'Round Off',
        defaultValue: null
      },    
    };
  }

  getPurchaseRequisitionAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotation>, form: FormGroup): AutoCompleteDef<PurchaseQuotation_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'PurchaseRequisitionNo',
      label: formConfig.PurchaseQuotationNo.label,
      placeholder: 'Search Purchase Requisition',
      options: [],
      optionLabel: 'PurchaseRequisitionNo',
      columns: [
        { data: 'PurchaseRequisitionNo', label: 'Purchase Requisition No', width: '200px' },
        { data: 'VendorName', label: 'Vendor Name', width: '200px' }
      ],
    }
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotation>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'VendorName',
      label: formConfig.VendorID.label,
      validationMessage: formConfig.VendorID.error,
      placeholder: 'Search Vendor',
      options: [],
      optionLabel: 'ProductName',
      columns: [
        { data: 'CompanyCode', label: 'Company Code', width: '100px' },
        { data: 'CompanyName', label: 'Company Name', width: '200px' }
      ],
    }
  }

  getProductAutoCompleteDef(formConfig: FormConfigType<PurchaseQuotationDetail>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ProductName',
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
      tableKey: 'IE_PurchaseQuotation_IndexDataView',
      defaultSortColumn: { sortField: 'QuotationNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'PurchaseQuotationNo', label: 'Quotation No', type: 'text' },
        { field: 'VendorName', label: 'Vendor', type: 'text' },
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
        { field: 'PurchaseQuotationNo', label: 'PurchaseQuotation No', enabled: true, order: 1 },
        { field: 'PurchaseQuotationDate', label: 'PurchaseQuotation Date', enabled: true, order: 0 },
        { field: 'NetAmountFC', label: 'Quotation Amount', enabled: true, order: 0 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}