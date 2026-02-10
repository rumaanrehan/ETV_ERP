import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Validators, FormGroup } from "@angular/forms";
import { Observable, forkJoin } from "rxjs";
import { Environment } from "../../../../../environments/environment";
import { ApiService } from "../../../../core/services/api.service";
import { DataTableParams } from "../../../../shared/components/z-datatable/z-datatable";
import { AutoCompleteDef } from "../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete";
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from "../../../../shared/models/api-response";
import { GetExchangeRateRequest, ExchangeRateResponse } from "../../../../shared/models/currency";
import { DataTableFilterFormConfigType, FormConfigType } from "../../../../shared/models/form.model";
import { StaticListRequest, StaticList } from "../../../../shared/models/select-list";
import { CurrencyExchangeService } from "../../../../shared/services/currency-exchange.service";
import { SelectListService } from "../../../../shared/services/select-list.service";
import { GreaterThanOrEqual } from "../../../../shared/validators/greater-than-equal-to.validator";
import { LessThanOrEqual } from "../../../../shared/validators/less-than-equal-to.validator";
import { noFractionValidator } from "../../../../shared/validators/no-fraction.validator";
import { NonZero } from "../../../../shared/validators/non-zero.validator";
import { NotOnlyWhitespaceValidator } from "../../../../shared/validators/not-only-whitespace.validator";
import { RequiredIf, Operator } from "../../../../shared/validators/required-if.validator";
import { Currency_SelectList, CurrencyRequest } from "../../../admin/settings/currency-master/currency-master";
import { CurrencyMasterService } from "../../../admin/settings/currency-master/currency-master.service";
import { TaxSlab_SelectList, TaxSlabRequest } from "../../../admin/settings/tax-slab-master/tax-slab-master";
import { TaxSlabMasterService } from "../../../admin/settings/tax-slab-master/tax-slab-master.service";
import { ProductRequest, Product_SelectList } from "../../../ims/settings/product-master/product-master";
import { ProductMasterService } from "../../../ims/settings/product-master/product-master.service";
import { CompanyRequest, Company_SelectList } from "../../settings/company-master/company-master";
import { CompanyMasterService } from "../../settings/company-master/company-master.service";
import { PaymentTerm_SelectList, PaymentTermRequest } from "../../settings/payment-term-master/payment-term-master";
import { PaymentTermMasterService } from "../../settings/payment-term-master/payment-term-master.service";
import { PortRequest, Port_SelectList } from "../../settings/port-master/port-master";
import { PortMasterService } from "../../settings/port-master/port-master.service";
import { ExportOrderRequest, ExportOrder_SelectList, ExportOrder_Detail } from "../export-order/export-order";
import { ExportOrderService } from "../export-order/export-order.service";
import { ProformaInvoiceRequest, ProformaInvoice_SelectList, ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList, ProformaInvoice_Detail, ProformaInvoice, ProformaInvoiceDetail } from "./proforma-invoice";

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
    private currencyExchangeService: CurrencyExchangeService,
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

  GetExchangeRate(model: GetExchangeRateRequest): Observable<ApiDataResponse<ExchangeRateResponse>> {
    return this.currencyExchangeService.GetRate(model);
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
      BasedOn: {
        label: 'Based On',
        defaultValue: 2,
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required."
        },
        type: 'control'
      },
      ProformaInvoiceDate: {
        label: 'Proforma Invoice Date',
        defaultValue: new Date(),
        validators: [Validators.required, GreaterThanOrEqual("ReferenceDate")],
        validationMessages: {
          required: "Proforma Invoice Date is required.",
          greaterThanOrEqual: "Proforma Invoice Date must be greater than or equal to Reference Date."
        },
        type: 'control'
      },
      ExportOrderID: {
        label: 'Export Order',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Export Order is required."
        },
        type: 'control'
      },
      ExportOrderNo: {
        label: 'Export Order',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Export Order is required."
        },
        type: 'control'
      },
      ReferenceNo: {
        label: 'Reference Number',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(100)],
        validationMessages: {
          required: "Reference Number is required.",
          notOnlyWhitespace: "Reference Number cannot be empty or whitespace.",
          maxLength: "Reference Number cannot exceed 100 characters."
        },
        type: 'control'
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [Validators.required, LessThanOrEqual("ProformaInvoiceDate")],
        validationMessages: {
          required: "Reference Date is required.",
          lessThanOrEqual: "Reference Date must be less than or equal to Proforma Invoice Date."
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
        validators: [Validators.required, Validators.min(0.01), Validators.max(999999999)],
        validationMessages: {
          required: "Exchange Rate is required.",
          min: "Exchange Rate must be greater than 0.",
          max: "Exchange Rate to BC must be less than or equal to 999,999,999."
        },
        type: 'control'
      },
      BankChargesFC: {
        label: 'Bank Charge (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Bank charges cannot be less than 0."
        },
        type: 'control'
      },
      BankChargesBC: {
        label: 'Bank Charge (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Bank charges cannot be less than 0."
        },
        type: 'control'
      },
      FreightChargeFC: {
        label: 'Freight Charge (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Freight charges cannot be less than 0."
        }
      },
      FreightChargeBC: {
        label: 'Freight Charge (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Freight charges cannot be less than 0."
        }
      },
      InsuranceAmountFC: {
        label: 'Insurance Amount (FC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Insurance charges cannot be less than 0."
        }
      },
      InsuranceAmountBC: {
        label: 'Insurance Amount (BC)',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: "Insurance charges cannot be less than 0."
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
              required: "Product is required."
            },
            type: 'control'
          },
          SalesQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, Validators.min(1), Validators.max(99999), noFractionValidator()],
            validationMessages: {
              required: "Sales Qty is required.",
              min: "Sales Qty must be at least 1.",
              max: "Sales Qty cannot exceed 99999.",
              noFraction: "Quoted quantity cannot have fractions."
            },
            type: 'control'
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
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
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
          RatePerUnitFC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, NonZero(), Validators.max(10000000)],
            validationMessages: {
              required: "Rate per unit is required.",
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
              required: "Taxable amount in foreign currency is required.",
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
              required: "Sales amount in foreign currency is required.",
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
        },
        type: 'control'
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
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: null
      },
      LoadingPortName: {
        label: 'Port Name',
        defaultValue: null
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: null
      },
      DischargePortName: {
        label: 'Port Name',
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

  getProductAutoCompleteDef(formConfig: FormConfigType<ProformaInvoiceDetail>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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
}