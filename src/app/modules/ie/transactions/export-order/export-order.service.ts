import { Injectable, TemplateRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_SelectList, ExportOrderDetail, ExportOrderDocumentList, ExportOrderPaymentList, ExportOrderRequest } from './export-order';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { ProductRequest, Product_SelectList, ProductMaster } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { PortMasterService } from '../../settings/port-master/port-master.service';
import { Port_SelectList, PortRequest } from '../../settings/port-master/port-master';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { TaxSlabMasterService } from '../../../admin/settings/TaxSlabMaster/tax-slab-master.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/TaxSlabMaster/tax-slab-master';
import { TableDef } from '../../../../shared/components/z-table/z-table';
import { ExportOrderDocumentTemplate } from '../export-order-document/export-order-document';
import { PaymentTerm_SelectList, PaymentTermRequest } from '../../settings/payment-term-master/payment-term-master';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { ExportOrderPaymentTemplate } from '../export-order-payment/export-payment';

@Injectable({
  providedIn: 'root'
})
export class ExportOrderService {
  private endpoint = 'IE/ExportOrder';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private portService: PortMasterService,
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

  GetDetails(exportOrderID: number): Observable<ApiDataResponse<ExportOrder>> {
    return this.apiService.post<ApiDataResponse<ExportOrder>>(`${this.endpoint}/GetDetails?exportOrderID=${exportOrderID}`, {});
  }

  GetOrderItemDetails(exportOrderID: number): Observable<ApiListResponse<ExportOrderDetail>> {
    return this.apiService.post<ApiListResponse<ExportOrderDetail>>(`${this.endpoint}/GetOrderItemDetails?exportOrderID=${exportOrderID}`, {});
  }

  CreateRecord(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
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
      ExportOrderDate: {
        label: 'Order Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Order Date is required"
        }
      },
      ReferenceNo: {
        label: 'Reference Number',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Reference Number is required"
        }
      },
      ReferenceDate: {
        label: 'Reference Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Reference Date is required"
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
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Incoterm is required"
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
      FreightChargeBC: {
        label: 'Freight Charge (BC)',
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
          RatePerUnitBC: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Rate is required"
            }
          },
          RatePerUnitFC: {
            label: 'Rate Per Unit FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Rate in foreign currency is required"
            }
          },
          TaxableAmountFC: {
            label: 'Taxable Amount FC',
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
            label: 'Tax Amount FC',
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
          }
        }
      },
      PaymentTermID: {
        label: 'Payment Term',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Payment Terms are required"
        }
      },
      ShipmentModeID: {
        label: 'Shipment Mode',
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
        validators: [Validators.required],
        validationMessages: {
          required: "Final Destination is required"
        }
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
      }
    };
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

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<ExportOrder>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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
