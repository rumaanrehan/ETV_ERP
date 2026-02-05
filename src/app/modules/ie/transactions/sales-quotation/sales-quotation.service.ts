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
import { SalesEnquiry_Detail, SalesEnquiry_SelectList, SalesEnquiryRequest } from '../sales-enquiry/sales-enquiry';
import { SalesEnquiryService } from '../sales-enquiry/sales-enquiry.service';
import { SalesQuotation, SalesQuotation_Detail, SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableList, SalesQuotation_IndexTableSort, SalesQuotation_SelectList, SalesQuotationBulkUpdateRequest, SalesQuotationDetail, SalesQuotationRequest } from './sales-quotation';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { CurrencyExchangeService } from '../../../../shared/services/currency-exchange.service';
import { ExchangeRateResponse, GetExchangeRateRequest } from '../../../../shared/models/currency';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../../environments/environment';
import { GreaterThan } from '../../../../shared/validators/greater-than.validator';
import { noFractionValidator } from '../../../../shared/validators/no-fraction.validator';
import { GreaterThanOrEqual } from '../../../../shared/validators/greater-than-equal-to.validator';
import { LessThanOrEqual } from '../../../../shared/validators/less-than-equal-to.validator';
import { NonZero } from '../../../../shared/validators/non-zero.validator';

@Injectable({
  providedIn: 'root'
})
export class SalesQuotationService {
  private endpoint = 'IE/SalesQuotation';

  constructor(
    private apiService: ApiService,
    private salesEnquiryService: SalesEnquiryService,
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

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  GetSalesEnquiryList(model: SalesEnquiryRequest): Observable<ApiListResponse<SalesEnquiry_SelectList>> {
    return this.salesEnquiryService.PopulateList(model);
  }

  GetSalesEnquiryDetails(salesEnquiryID: number): Observable<ApiDataResponse<SalesEnquiry_Detail>> {
    return this.salesEnquiryService.GetDetails(salesEnquiryID);
  }

  PopulateList(model: SalesQuotationRequest): Observable<ApiListResponse<SalesQuotation_SelectList>> {
    return this.apiService.post<ApiListResponse<SalesQuotation_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<SalesQuotation_IndexTableFilter>): Observable<ApiPagedListResponse<SalesQuotation_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<SalesQuotation_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(salesQuotationID: number): Observable<ApiDataResponse<SalesQuotation_Detail>> {
    return this.apiService.post<ApiDataResponse<SalesQuotation_Detail>>(`${this.endpoint}/GetDetails?salesQuotationID=${salesQuotationID}`, {});
  }

  CreateRecord(model: SalesQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: SalesQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelQuotation(model: SalesQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  BulkChangeStatus(model: SalesQuotationBulkUpdateRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/BulkChangeStatus`, model);
  }

  GeneratePdf(request: any) {
    return this.http.post(`${Environment.apiBaseUrl}/${this.endpoint}/PrintInvoice`, request, { responseType: 'blob' });
  }

  getFormConfig_DataTableFilter(): FormConfigType<SalesQuotation_IndexTableFilter> {
    return {
      SalesQuotationNo: {
        label: 'Quotation No',
        defaultValue: ''
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: ''
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<SalesQuotation_IndexTableSort> {
    return {
      SalesQuotationNo: {
        label: 'Quotation No',
        defaultValue: -1
      },
      SalesQuotationDate: {
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

  getFormConfig(): FormConfigType<SalesQuotation> {
    return {
      SalesQuotationID: {
        label: '',
        defaultValue: null
      },
      SalesQuotationNo: {
        label: 'Quotation No',
        defaultValue: "NEW"
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 2,
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required."
        },
        type: 'control'
      },
      SalesQuotationDate: {
        label: 'Quotation Date',
        defaultValue: new Date(),
        validators: [Validators.required, LessThanOrEqual("ValidityDate")],
        validationMessages: {
          required: "Quotation Date is required.",
          lessThanOrEqual: "Quotation Date should be less than Validity Date."
        },
        type: 'control'
      },
      ValidityDate: {
        label: 'Validity Date',
        defaultValue: null,
        validators: [GreaterThanOrEqual('SalesQuotationDate')],
        validationMessages: {
          greaterThanOrEqual: "Validity Date should be greater than Quotation Date."
        },
        type: 'control'
      },
      SalesEnquiryID: {
        label: 'Enquiry ID',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Sales Enquiry is required."
        },
        type: 'control'
      },
      SalesEnquiryNo: {
        label: 'Sales Enquiry',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Sales Enquiry is required."
        },
        type: 'control'
      },
      CustomerID: {
        label: 'Customer',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer is required."
        },
        type: 'control'
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer is required."
        },
        type: 'control'
      },
      FCCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Foreign Currency is required."
        },
        type: 'control'
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Exchange Rate is required.",
          nonZero: "Exchange Rate cannot be 0."
        },
        type: 'control'
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null
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
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
          },
          HSCode: {
            label: 'HS Code',
            defaultValue: null,
            validators: [Validators.minLength(2), Validators.maxLength(8), Validators.pattern(/^\d{2,8}$/)],
            validationMessages: {
              minlength: "HS Code must be at least 2 digits.",
              maxlength: "HS Code cannot exceed 8 digits.",
              pattern: "HS Code must contain only digits."
            },
            type: 'control'
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
          TaxRate: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax rate is required."
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
          QuotationAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Quotation Amount is required.",
              nonZero: "Quotation Amount cannot be 0."
            },
            type: 'control'
          },
          QuotationAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Amounts are not converted into base currency.",
              nonZero: "Quotation Amount cannot be 0."
            },
            type: 'control'
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
        label: '',
        defaultValue: null
      },
    };
  }

  getSalesEnquiryAutoCompleteDef(formConfig: FormConfigType<SalesQuotation>, form: FormGroup): AutoCompleteDef<SalesEnquiry_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'SalesEnquiryNo',
      label: formConfig.SalesEnquiryNo.label,
      validationMessage: formConfig.SalesEnquiryNo.error,
      placeholder: 'Search Sales Enquiry',
      options: [],
      optionLabel: 'SalesEnquiryNo',
      columns: [
        { data: 'SalesEnquiryNo', label: 'Sales Enquiry No', width: '200px' },
        { data: 'CustomerName', label: 'Customer Name', width: '200px' }
      ],
    }
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<SalesQuotation>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
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

  getProductAutoCompleteDef(formConfig: FormConfigType<SalesQuotationDetail>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<SalesQuotation_IndexTableList> {
    return {
      tableKey: 'IE_SalesQuotation_IndexDataView',
      defaultSortColumn: { sortField: 'SalesQuotationNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'SalesQuotationNo', label: 'Quotation No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'BasedOn', label: 'Based On', type: 'dropdown' },
        { field: 'StatusID', label: 'Status', type: 'dropdown' }
      ],
      sortFields: [
        { field: 'SalesQuotationNo', label: 'Quotation No', enabled: true, order: 1 },
        { field: 'SalesQuotationDate', label: 'Quotation Date', enabled: true, order: 0 },
        { field: 'NetAmountFC', label: 'Quotation Amount', enabled: true, order: 0 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}