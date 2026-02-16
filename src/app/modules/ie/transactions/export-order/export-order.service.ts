import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { TableDef } from '../../../../shared/components/z-table/z-table';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { ExchangeRateResponse, GetExchangeRateRequest } from '../../../../shared/models/currency';
import { FormConfigType } from '../../../../shared/models/form.model';
import { DataTableFilterList, DataTableFilterListRequest, StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { CurrencyExchangeService } from '../../../../shared/services/currency-exchange.service';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { GreaterThanOrEqual } from '../../../../shared/validators/greater-than-equal-to.validator';
import { LessThanOrEqual } from '../../../../shared/validators/less-than-equal-to.validator';
import { noFractionValidator } from '../../../../shared/validators/no-fraction.validator';
import { NonZero } from '../../../../shared/validators/non-zero.validator';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
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
import { Port_SelectList, PortRequest } from '../../settings/port-master/port-master';
import { PortMasterService } from '../../settings/port-master/port-master.service';
import { ExportOrderDocumentTemplate } from '../export-order-document/export-order-document';
import { ExportOrderPaymentTemplate } from '../export-order-payment/export-payment';
import { ExportOrderShipping } from '../export-order-shipping/export-order-shipping';
import { SalesQuotation_Detail, SalesQuotation_SelectList, SalesQuotationRequest } from '../sales-quotation/sales-quotation';
import { SalesQuotationService } from '../sales-quotation/sales-quotation.service';
import { ExportOrder, ExportOrder_Detail, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_IndexTableSort, ExportOrder_SelectList, ExportOrderBillRegulationRequest, ExportOrderBulkUpdateRequest, ExportOrderCancelRequest, ExportOrderDetail, ExportOrderDocumentList, ExportOrderPaymentList, ExportOrderRequest } from './export-order';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderService {
  private endpoint = 'IE/ExportOrder';

  constructor(
    private apiService: ApiService,
    private salesQuotationService: SalesQuotationService,
    private companyMasterService: CompanyMasterService,
    private currencyMasterService: CurrencyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private portService: PortMasterService,
    private selectListService: SelectListService,
    private currencyExchangeService: CurrencyExchangeService,
    private http: HttpClient
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

  GetDataTableList(model: DataTableFilterListRequest): Observable<ApiListResponse<DataTableFilterList>> {
    return this.selectListService.GetDataTableList(model);
  }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetSalesQuotationList(model: SalesQuotationRequest): Observable<ApiListResponse<SalesQuotation_SelectList>> {
    return this.salesQuotationService.PopulateList(model);
  }

  GetPortList(model: PortRequest): Observable<ApiListResponse<Port_SelectList>> {
    return this.portService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  PopulateList(model: ExportOrderRequest): Observable<ApiListResponse<ExportOrder_SelectList>> {
    return this.apiService.post<ApiListResponse<ExportOrder_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<ExportOrder_IndexTableFilter>): Observable<ApiPagedListResponse<ExportOrder_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ExportOrder_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder_Detail>> {
    return this.apiService.post<ApiDataResponse<ExportOrder_Detail>>(`${this.endpoint}/GetDetails?exportOrderID=${exportOrderID}`, {});
  }

  GetOrderItemDetails(exportOrderID: number): Observable<ApiListResponse<ExportOrderDetail>> {
    return this.apiService.post<ApiListResponse<ExportOrderDetail>>(`${this.endpoint}/GetOrderItemDetails?exportOrderID=${exportOrderID}`, {});
  }

  GetSalesQuotationDetails(salesQuotationID: number): Observable<ApiDataResponse<SalesQuotation_Detail>> {
    return this.salesQuotationService.GetDetails(salesQuotationID);
  }

  CreateRecord(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  AddShippingRecord(model: ExportOrderShipping): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/AddShippingDetail`, model);
  }

  GetShippingRecord(exportOrderID: number | null): Observable<ApiDataResponse<ExportOrderShipping>> {
    return this.apiService.post<ApiDataResponse<ExportOrderShipping>>(`${this.endpoint}/GetShippingDetails?exportOrderID=${exportOrderID}`, {});
  }

  UpdateShippingRecord(model: ExportOrderShipping): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/UpdateShippingDetails`, model);
  }

  AddBillRegulationRecord(model: ExportOrderBillRegulationRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/AddBillRegulation`, model);
  }

  GetBillRegulationRecord(exportOrderID: number | null): Observable<ApiDataResponse<ExportOrderBillRegulationRequest>> {
    return this.apiService.post<ApiDataResponse<ExportOrderBillRegulationRequest>>(`${this.endpoint}/GetBillRegulation?exportOrderID=${exportOrderID}`, {});
  }

  UpdateBillRegulationRecord(model: ExportOrderBillRegulationRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/UpdateBillRegulation`, model);
  }

  UpdateRecord(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ExportOrderCancelRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }  
  
  UploadPODocument(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${Environment.apiBaseUrl}/${this.endpoint}/POUpload`, formData);
  }

  BulkChangeStatus(model: ExportOrderBulkUpdateRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/BulkChangeStatus`, model);
  }

  LoadDocument(exportOrderID: number): Observable<ApiListResponse<ExportOrderDocumentList>> {
    return this.apiService.post<ApiListResponse<ExportOrderDocumentList>>(`${this.endpoint}/LoadDocument?exportOrderID=${exportOrderID}`, {});
  }

  GetDocument(documentPath: string): Observable<Blob> {
    return this.apiService.blobPost(`FileHandler/download?documentPath=${documentPath}`, {});
  }

  DeleteDocument(model: ExportOrderDocumentList): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/DeleteDocument`, model);
  }

  LoadPayment(exportOrderID: number): Observable<ApiListResponse<ExportOrderPaymentList>> {
    return this.apiService.post<ApiListResponse<ExportOrderPaymentList>>(`${this.endpoint}/LoadPayment?exportOrderID=${exportOrderID}`, {});
  }

  DeletePayment(model: ExportOrderPaymentList): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/DeletePayment`, model);
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
      BasedOn: {
        label: 'Based On',
        defaultValue: 0
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
      FinalDestination: {
        label: 'Destination',
        defaultValue: ''
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<ExportOrder_IndexTableSort> {
    return {
      ExportOrderNo: {
        label: 'Order No',
        defaultValue: -1
      },
      ExportOrderDate: {
        label: 'Order Date',
        defaultValue: 0
      },
      NetAmountBC: {
        label: 'Net Amount (BC)',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig(): FormConfigType<ExportOrder> {
    return {
      ExportOrderID: {
        label: '',
        defaultValue: null
      },
      ExportOrderNo: {
        label: 'Order No',
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
      ExportOrderDate: {
        label: 'Order Date',
        defaultValue: new Date(),
        validators: [Validators.required, GreaterThanOrEqual("ReferenceDate")],
        validationMessages: {
          required: "Export Order Date is required.",
          greaterThanOrEqual: "Order Date must be greater than or equal to Reference Date."
        },
        type: 'control'
      },
      SalesQuotationID: {
        label: 'Sales Quotation',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Sales Quotation is required."
        }
      },
      SalesQuotationNo: {
        label: 'Sales Quotation',
        defaultValue: null,
        validators: [RequiredIf("BasedOn", Operator.EqualTo, 1)],
        validationMessages: {
          required: "Sales Quotation is required."
        }
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [Validators.required, LessThanOrEqual("ExportOrderDate")],
        validationMessages: {
          required: "Reference Date is required.",
          lessThanOrEqual: "Reference Date must be less than or equal to Order Date."
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
        }
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
        validators: [Validators.required, NonZero()],
        validationMessages: {
          required: "Exchange Rate to Base Currency is required.",
          nonZero: "Exchange Rate cannot be 0."
        },
        type: 'control'
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Incoterm is required."
        }
      },
      IsDutyDrawable: {
        label: 'Is Duty Drawable',
        defaultValue: false
      },
      IsRoDTEP: {
        label: 'Is RoDTEP',
        defaultValue: false
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
              noFraction: "Sales quantity cannot have fractions."
            },
            type: 'control'
          },
          UOM: {
            label: '',
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
          required: "Payment Term is required."
        }
      },
      ShipmentModeID: {
        label: 'Shipment Mode',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Shipment Mode is required."
        }
      },
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: null
      },
      LoadingPortName: {
        label: 'Loading Port Name',
        defaultValue: null
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: null
      },
      DischargePortName: {
        label: 'Discharge Port Name',
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
      StatusID: {
        label: 'Status',
        defaultValue: 3,
        validators: [Validators.required],
        validationMessages: {
          required: "Status is required"
        }
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
      }
    };
  }

  getSalesQuotationAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<SalesQuotation_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'SalesQuotationNo',
      label: formConfig.SalesQuotationNo.label,
      validationMessage: formConfig.SalesQuotationNo.error,
      placeholder: 'Search Sales Quotation',
      options: [],
      optionLabel: 'SalesQuotationNo',
      columns: [
        { data: 'SalesQuotationNo', label: 'Sales Quotation No', width: '200px' },
        { data: 'CustomerName', label: 'Customer Name', width: '200px' }
      ],
    }
  }

  getExportOrderDocumentTableDef(templateList: ExportOrderDocumentTemplate): TableDef<ExportOrderDocumentList> {
    return {
      columnDef: [
        { data: '', label: 'S No', hideVisToggle: true, width: '5%', customTemplate: templateList.SerialNoTemplate },
        { data: 'ExportOrderDocumentID', label: 'Document ID', visible: false, hideVisToggle: true, width: '10%' },
        { data: 'ExportOrderNo', label: 'Export Order No', width: '20%' },
        { data: 'DocumentTypeName', label: 'Document Type', width: '20%' },
        { data: 'UploadedDateTime', label: 'Uploaded On', width: '10%', customTemplate: templateList.UpdateDateTemplate },
        { data: 'UploadedBy', label: 'Uploaded By', width: '10%' },
        { data: '', label: 'Is Verified', hideVisToggle: true, width: '10%', customTemplate: templateList.IsVerfiedTemplate },
        { data: '', label: '', hideVisToggle: true, width: '10%', customTemplate: templateList.ActionTemplate },
      ],
      data: []
    };
  }

  getExportOrderPaymentTableDef(templateList: ExportOrderPaymentTemplate): TableDef<ExportOrderPaymentList> {
    return {
      columnDef: [
        { data: '', label: 'S No', hideVisToggle: true, width: '5%', customTemplate: templateList.SerialNoTemplate },
        { data: 'ExportOrderNo', label: 'Export Order No', width: '15%' },
        { data: 'ExportOrderPaymentNo', label: 'Payment No', width: '15%' },
        { data: 'PaymentRefNo', label: 'Reference No', width: '20%' },
        { data: 'PaymentAmountBC', label: 'Amount (BC)', width: '10%', cssClass: 'text-end' },
        { data: 'PaymentDate', label: 'Payment Date', width: '15%', customTemplate: templateList.PaymentDateTemplate },
        { data: 'CreatedBy', label: 'Created By', width: '10%' },
        { data: '', label: '', hideVisToggle: true, width: '10%', customTemplate: templateList.ActionTemplate }
      ],
      data: []
    };
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
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

  getLoadingPortAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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

  getDischargePortAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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

  getProductAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ProductName',
      validationMessage: formConfig.ProductList.items.ProductName.error,
      placeholder: 'Search Product',
      options: [],
      optionLabel: 'ProductName',
      columns: [
        { data: 'ProductCode', label: 'Product Code', width: '100px' },
        { data: 'ProductName', label: 'Product Name', width: '200px' }
      ],
    }
  }

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<ExportOrder_IndexTableList> {
    return {
      tableKey: 'IE_ExportOrder_IndexDataView',
      defaultSortColumn: { sortField: 'ExportOrderNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'ExportOrderNo', label: 'Order No', type: 'text' },
        { field: 'ReferenceNo', label: 'Ref No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'BasedOn', label: 'Based On', type: 'dropdown' },
        { field: 'IncotermID', label: 'Incoterm', type: 'dropdown' },
        { field: 'StatusID', label: 'Status', type: 'dropdown' }
      ],
      sortFields: [
        { field: 'ExportOrderNo', label: 'Order No', enabled: true, order: 1 },
        { field: 'ExportOrderDate', label: 'Order Date', enabled: true, order: 0 },
        { field: 'NetAmountBC', label: 'Order Amount', enabled: true, order: 0 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}
