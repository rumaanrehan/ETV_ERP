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
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { PaymentTerm_SelectList, PaymentTermRequest } from '../../settings/payment-term-master/payment-term-master';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { SalesQuotation, SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableList, SalesQuotation_SelectList, SalesQuotationDetail, SalesQuotationRequest } from './sales-quotation';

@Injectable({
  providedIn: 'root'
})
export class SalesQuotationService {
  private endpoint = 'IE/SalesQuotation';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private selectListService: SelectListService
  ) { }

  GetMasterDropdownLists(): Observable<{
    paymentTermList: ApiListResponse<PaymentTerm_SelectList>;
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
  }> {
    return forkJoin({
      paymentTermList: this.paymentTermMasterService.PopulateList({ PopulateType: 'SelectList' } as PaymentTermRequest),
      taxSlabList: this.taxSlabMasterService.PopulateList({ PopulateType: 'SelectList' } as TaxSlabRequest)
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

  PopulateList(model: SalesQuotationRequest): Observable<ApiListResponse<SalesQuotation_SelectList>> {
    return this.apiService.post<ApiListResponse<SalesQuotation_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<SalesQuotation_IndexTableFilter>): Observable<ApiPagedListResponse<SalesQuotation_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<SalesQuotation_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(quotationID: number): Observable<ApiDataResponse<SalesQuotation>> {
    return this.apiService.post<ApiDataResponse<SalesQuotation>>(`${this.endpoint}/GetDetails?quotationID=${quotationID}`, {});
  }

  GetQuotationDetails(quotationID: number): Observable<ApiListResponse<SalesQuotationDetail>> {
    return this.apiService.post<ApiListResponse<SalesQuotationDetail>>(`${this.endpoint}/GetQuotationDetails?quotationID=${quotationID}`, {});
  }

  GetQuotationItemDetails(quotationID: number): Observable<ApiListResponse<SalesQuotationDetail>> {
    return this.apiService.post<ApiListResponse<SalesQuotationDetail>>(`${this.endpoint}/GetOrderItemDetails?exportOrderID=${quotationID}`, {});
  }

  CreateRecord(model: SalesQuotation): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: SalesQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelQuotation(model: SalesQuotation): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<SalesQuotation_IndexTableFilter> {
    return {
      QuotationNo: {
        label: 'Quotation No',
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
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig(): FormConfigType<SalesQuotation> {
    return {
      QuotationID: {
        label: '',
        defaultValue: null
      },
      QuotationNo: {
        label: 'Quotation No',
        defaultValue: "NEW"
      },
      QuotationDate: {
        label: 'Quotation Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Quotation Date is required"
        }
      },
      EnquiryID: {
        label: 'Enquiry ID',
        defaultValue: null
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
        defaultValue: ''
      },
      FCCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate',
        defaultValue: null,
        validators: [RequiredIf('FCCurrencyID', Operator.NotEqualTo, null)],
        validationMessages: {
          RequiredIf: "Exchange Rate Date is required"
        }
      },
      ValidityDate: {
        label: 'Validity Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Validity Date is required"
        }
      },
      PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Payment Term is required"
        }
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Incoterm is required"
        }
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
            validators: [Validators.required],
            validationMessages: {
              required: "Rate per unit in base currency is required"
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
              required: "Taxable amount in base currency is required"
            }
          },
          TaxAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax amount in foreign currency is required"
            }
          },
          TaxAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax amount in base currency is required"
            }
          },
          QuotationAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Quotation amount in foreign currency is required"
            }
          },
          QuotationAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Quotation amount in base currency is required"
            }
          }
        }
      },
      SubtotalAmountFC: {
        label: 'Subtotal Amount(FC)',
        defaultValue: null
      },
      SubtotalAmountBC: {
        label: 'Subtotal Amount (BC)',
        defaultValue: null
      },
      TaxAmountFC: {
        label: 'Tax Amount (FC)',
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
      Narration: {
        label: 'Narration',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StatusID: {
        label: 'Status',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: "Status is required"
        }
      },
      IsRoundOff: {
        label: 'Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: '',
        defaultValue: null
      }
    };
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

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<SalesQuotation>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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