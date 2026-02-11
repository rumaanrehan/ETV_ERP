import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { RequiredIf, Operator } from '../../../../shared/validators/required-if.validator';
import { TaxInvoice_IndexTableFilter, TaxInvoice, TaxInvoiceRequest, TaxInvoice_SelectList, TaxInvoice_IndexTableList, Document_SelectList, TaxInvoice_Detail, TaxInvoiceDetail } from './tax-invoice';
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
import { ExportOrderRequest, ExportOrder_Detail, ExportOrder_SelectList } from '../export-order/export-order';
import { ProformaInvoice_Detail, ProformaInvoice_SelectList, ProformaInvoiceRequest } from '../proforma-invoice/proforma-invoice';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProformaInvoiceService } from '../proforma-invoice/proforma-invoice.service';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
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
import { ExchangeRateResponse, GetExchangeRateRequest } from '../../../../shared/models/currency';
import { CurrencyExchangeService } from '../../../../shared/services/currency-exchange.service';
import { GreaterThanOrEqual } from '../../../../shared/validators/greater-than-equal-to.validator';
import { LessThanOrEqual } from '../../../../shared/validators/less-than-equal-to.validator';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { NonZero } from '../../../../shared/validators/non-zero.validator';
import { noFractionValidator } from '../../../../shared/validators/no-fraction.validator';

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
    private selectListService: SelectListService,
    private portService: PortMasterService,
    private paymentTermService: PaymentTermMasterService,
    private currencyExchangeService: CurrencyExchangeService,
    private http: HttpClient
  ) { }

  GetMasterDropdownLists(): Observable<{
    paymentTermList: ApiListResponse<PaymentTerm_SelectList>;
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
    currencyList: ApiListResponse<Currency_SelectList>;
  }> {
    return forkJoin({
      paymentTermList: this.paymentTermService.PopulateList({ PopulateType: 'SelectList' } as PaymentTermRequest),
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

  GetPortList(model: PortRequest): Observable<ApiListResponse<Port_SelectList>> {
    return this.portService.PopulateList(model);
  }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  GetExportOrderDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder_Detail>> {
    return this.exportOrderService.GetDetails(exportOrderID);
  }

  GetProformaInvoiceDetails(proformaInvoice: number): Observable<ApiDataResponse<ProformaInvoice_Detail>> {
    return this.proformaInvoiceService.GetDetails(proformaInvoice);
  }

  PopulateList(model: TaxInvoiceRequest): Observable<ApiListResponse<TaxInvoice_SelectList>> {
    return this.apiService.post<ApiListResponse<TaxInvoice_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<TaxInvoice_IndexTableFilter>): Observable<ApiPagedListResponse<TaxInvoice_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<TaxInvoice_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(taxInvoiceID: number): Observable<ApiDataResponse<TaxInvoice_Detail>> {
    return this.apiService.post<ApiDataResponse<TaxInvoice_Detail>>(`${this.endpoint}/GetDetails?taxInvoiceID=${taxInvoiceID}`, {});
  }

  CreateRecord(model: TaxInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: TaxInvoice): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelRecord(taxInvoiceID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?taxInvoiceID=${taxInvoiceID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  GetExchangeRate(model: GetExchangeRateRequest): Observable<ApiDataResponse<ExchangeRateResponse>> {
    return this.currencyExchangeService.GetRate(model);
  }

  GeneratePdf(request: any) {
    return this.http.post(`${Environment.apiBaseUrl}/${this.endpoint}/PrintInvoice`, request, { responseType: 'blob' });
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<TaxInvoice_IndexTableFilter> {
    return {
      TaxInvoiceNo: '',
      BasedOn: 0,
      DocumentNo: '',
      CustomerName: '',
      Status: 0
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
        defaultValue: 3,
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required."
        },
        type: 'control'
      },
      TaxInvoiceDate: {
        label: 'Tax Invoice Date',
        defaultValue: new Date(),
        validators: [Validators.required, GreaterThanOrEqual("ReferenceDate")],
        validationMessages: {
          required: "Tax Invoice Date is required.",
          greaterThanOrEqual: "Invoice Date must be greater than or equal to Reference Date."
        },
        type: 'control'
      },
      DocumentID: {
        label: 'Document ID',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1), RequiredIf("BasedOn", Operator.EqualTo, 2)],
        validationMessages: {
          required: "Document ID is required."
        },
        type: 'control'
      },
      DocumentNo: {
        label: 'Document No',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1), RequiredIf("BasedOn", Operator.EqualTo, 2)],
        validationMessages: {
          required: "Document No is required."
        },
        type: 'control'
      },
      ReferenceNo: {
        label: 'Reference Number',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(100)],
        validationMessages: {
          required: "Reference Number is required.",
          maxLength: "Reference Number cannot exceed 100 characters."
        },
        type: 'control'
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [Validators.required, LessThanOrEqual("TaxInvoiceDate")],
        validationMessages: {
          required: "Reference Date is required.",
          notOnlyWhitespace: "Reference Number cannot be empty or whitespace.",
          lessThanOrEqual: "Reference Date must be less than or equal to Invoice Date."
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
      ExchangeRateDate: {
        label: 'Exchange Date',
        defaultValue: new Date(),
        validators: [Validators.required],
        validationMessages: {
          required: "Exchange Rate Date is required."
        },
        type: 'control'
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate to BC',
        defaultValue: null,
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Exchange Rate is required.",
          nonZero: "Exchange Rate cannot be 0."
        },
        type: 'control'
      },
      BankChargesFC: {
        label: 'Bank Charge (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Bank charges cannot be less than 0."
        }
      },
      BankChargesBC: {
        label: 'Bank Charge (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Bank charges cannot be less than 0."
        }
      },
      FreightChargeFC: {
        label: 'Freight Charge (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Freight Charge cannot be less than 0."
        }
      },
      FreightChargeBC: {
        label: 'Freight Charge (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Freight Charge cannot be less than 0."
        }
      },
      InsuranceAmountFC: {
        label: 'Insurance Amount (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Insurance Amount cannot be less than 0."
        }
      },
      InsuranceAmountBC: {
        label: 'Insurance Amount (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Insurance Amount cannot be less than 0."
        }
      },
      ProductList: {
        type: 'array',
        items: {
          ProductID: {
            label: 'Product',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required."
            }
          },
          ProductName: {
            label: 'Product Name',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required."
            }
          },
          SalesQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, Validators.min(1), Validators.max(99999), noFractionValidator()],
            validationMessages: {
              required: "Sales Qty is required.",
              min: "Sales Qty must be at least 1.",
              max: "Sales Qty cannot exceed 99999.",
              noFraction: "Sales quantity cannot have fractions"
            },
            type: 'control'
          },
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null,
          },
          HSCode: {
            label: 'HS Code',
            defaultValue: null
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
          SalesTaxRate: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax Rate is required."
            },
            type: 'control'
          },
          TaxAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax in foreign currency is required."
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
          SalesAmountFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Sales Amount is required.",
              nonZero: "Sales Amount cannot be 0."
            },
            type: 'control'
          },
          SalesAmountBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero()],
            validationMessages: {
              required: "Amounts are not converted into base currency.",
              nonZero: "Sales Amount cannot be 0."
            },
            type: 'control'
          }
        }
      },
      PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Payment Terms are required."
        }
      },
      ShipmentModeID: {
        label: 'Shipment Mode',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Shipment Mode is required."
        },
        type: 'control'
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
        validators: [Validators.required, Validators.maxLength(100)],
        validationMessages: {
          required: "Final Destination is required.",
          maxlength: "Final Destination cannot exceed 100 characters."
        },
        type: 'control'
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
        label: 'Is Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: 'Coin Adjustment',
        defaultValue: null
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

  getLoadingPortAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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

  getDischargePortAutoCompleteDef(formConfig: FormConfigType<TaxInvoice>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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

  getProductAutoCompleteDef(formConfig: FormConfigType<TaxInvoiceDetail>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ProductName',
      label: formConfig.ProductName.label,
      validationMessage: formConfig.ProductName.error?.[0],
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
