import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { DataTableFilterList, DataTableFilterListRequest, StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { Port_SelectList, PortRequest } from '../../settings/port-master/port-master';
import { PortMasterService } from '../../settings/port-master/port-master.service';
import { ImportOrder, ImportOrder_Detail, ImportOrder_IndexTableFilter, ImportOrder_IndexTableList, ImportOrder_IndexTableSort, ImportOrder_SelectList, ImportOrderDetail, ImportOrderRequest } from './import-order';
import { CurrencyMasterService } from '../../../admin/settings/currency-master/currency-master.service';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { PaymentTerm_SelectList, PaymentTermRequest } from '../../settings/payment-term-master/payment-term-master';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/currency-master/currency-master';

@Injectable({
  providedIn: 'root'
})
export class ImportOrderService {
  private endpoint = 'IE/ImportOrder';

  constructor(
    private apiService: ApiService,
    // private purchaseQuotationService: PurchaseQuotationService,
    private companyMasterService: CompanyMasterService,
    private currencyMasterService: CurrencyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private portService: PortMasterService,
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
  
  GetDataTableList(model: DataTableFilterListRequest): Observable<ApiListResponse<DataTableFilterList>> {
    return this.selectListService.GetDataTableList(model);
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

  PopulateList(model: ImportOrderRequest): Observable<ApiListResponse<ImportOrder_SelectList>> {
    return this.apiService.post<ApiListResponse<ImportOrder_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<ImportOrder_IndexTableFilter>): Observable<ApiPagedListResponse<ImportOrder_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ImportOrder_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(importOrderID: number): Observable<ApiDataResponse<ImportOrder_Detail>> {
    return this.apiService.post<ApiDataResponse<ImportOrder_Detail>>(`${this.endpoint}/GetDetails?importOrderID=${importOrderID}`, {});
  }

  GetOrderItemDetails(importOrderID: number): Observable<ApiListResponse<ImportOrderDetail>> {
    return this.apiService.post<ApiListResponse<ImportOrderDetail>>(`${this.endpoint}/GetOrderItemDetails?importOrderID=${importOrderID}`, {});
  }

  CreateRecord(model: ImportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ImportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(importOrderID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?ImportOrderID=${importOrderID}&ReasonToUpdate=${reasonToUpdate}`, {});
  }

  getFormConfig_DataTableFilter(): FormConfigType<ImportOrder_IndexTableFilter> {
    return {
      ImportOrderNo: {
        label: 'Order No',
        defaultValue: ''
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: ''
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    };
  }

  getFormConfig_DataTableSort(): FormConfigType<ImportOrder_IndexTableSort> {
    return {
      ImportOrderNo: {
        label: 'Order No',
        defaultValue: 1
      },
      ImportOrderDate: {
        label: 'Order Date',
        defaultValue: 0
      },
      NetAmountBC: {
        label: 'Net Amount BC',
        defaultValue: 0
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    };
  }

  getFormConfig(): FormConfigType<ImportOrder> {
    return {
      ImportOrderID: {
        label: '',
        defaultValue: null
      },
      ImportOrderNo: {
        label: 'Order No',
        defaultValue: "NEW"
      },
      ImportOrderDate: {
        label: 'Order Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Order Date is required"
        }
      },
      BasedOn: {
        label: 'Based On',
        defaultValue: 2,
        validators: [Validators.required],
        validationMessages: {
          required: "Based On is required"
        }
      },
      PurchaseQuotationID: {
        label: 'Purchase Quotation',
        defaultValue: null
      },
      VendorID: {
        label: 'Vendor',
        defaultValue: null
      },
      ForeignCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Foreign Currency is required"
        }
      },
      ExchangeRateDate: {
        label: 'Exchange Rate Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Exchange Rate Date is required"
        }
      },
      ExchangeRateToBC: {
        label: 'Exchange Rate to BC',
        defaultValue: null,
      },
      IncotermID: {
        label: 'Incoterm',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Incoterm is required"
        }
      },
      PaymentTermID: {
        label: 'Payment Terms',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Payment Terms is required"
        }
      },
      FreightAmountFC: {
        label: 'Freight Amount (FC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Freight Amount in foreign currency is required"
        }
      },
      FreightAmountBC: {
        label: 'Freight Amount (BC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Freight Amount in base currency is required"
        }
      },
      InsuranceAmountFC: {
        label: 'Insurance Amount (FC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Insurance Amount in foreign currency is required"
        }
      },
      InsuranceAmountBC: {
        label: 'Insurance Amount (BC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Insurance Amount in base currency is required"
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
          PurchaseQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Purchase Qty is required"
            }
          },
          UOM: {
            label: 'UOM',
            defaultValue: null
          },
          RatePerUnitFC: {
            label: 'Rate Per Unit FC',
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
            label: 'Taxable Amount FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Taxable amount in foreign currency is required"
            }
          },
          TaxableAmountBC: {
            label: 'Taxable Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Taxable Amount in base currency is required"
            }
          },
          PurchaseTaxRate: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax Rate is required"
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
            label: 'Tax Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax in base currency is required"
            }
          },
          TotalAmountFC: {
            label: 'Total Amount FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Total amount in foreign currency is required"
            }
          },
          TotalAmountBC: {
            label: 'Total Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Total amount in base currency is required"
            }
          },
          IsDeleted: {
            label: '',
            defaultValue: false
          }
        }
      },
      CustomDutyFC: {
        label: 'Custom Duty (FC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Custom Duty in foreign currency is required"
        }
      },
      CustomDutyBC: {
        label: 'Custom Duty (BC)',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Custom Duty in base currency is required"
        }
      },
      SubtotalAmountFC: {
        label: 'Subtotal Amount(FC)',
        defaultValue: null
      },
      SubtotalAmountBC: {
        label: 'Subtotal Amount(BC)',
        defaultValue: null
      },
      IsRoundOff: {
        label: 'Is Round Off',
        defaultValue: true
      },
      CoinAdjustment: {
        label: 'Coin Adjustment',
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
        label: 'Net Amount (FC)',
        defaultValue: null
      },
      NetAmountBC: {
        label: 'Net Amount (BC)',
        defaultValue: null
      },
      // PaidAmountFC: {
      //   label: 'Paid Amount (FC)',
      //   defaultValue: null
      // },
      // PaidAmountBC: {
      //   label: 'Paid Amount (BC)',
      //   defaultValue: null
      // },
      // BalanceAmountFC: {
      //   label: 'Balance Amount (FC)',
      //   defaultValue: null
      // },
      // BalanceAmountBC: {
      //   label: 'Balance Amount (BC)',
      //   defaultValue: null
      // },
      ShipmentModeID: {
        label: 'Shipment Mode',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Shipment Mode is required"
        }
      },
      LoadingPortID: {
        label: 'Loading Port',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Loading Port is required"
        }
      },
      DischargePortID: {
        label: 'Discharge Port',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Discharge Port is required"
        }
      },
      LoadingPortName: {
        label: 'Loading Port Name',
        defaultValue: null
      },
      DischargePortName: {
        label: 'Discharge Port Name',
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
        validators: [Validators.required],
        validationMessages: {
          required: "Narration is required"
        }
      },
      // BillOfEntryNo: {
      //   label: 'Bill of Entry No',
      //   defaultValue: null
      // },
      // BillOfEntryDate: {
      //   label: 'Bill of Entry Date',
      //   defaultValue: null
      // },
      // AirwayBillNo: {
      //   label: 'Airway Bill No',
      //   defaultValue: null
      // },
      // AirwayBillDate: {
      //   label: 'Airway Bill Date',
      //   defaultValue: null
      // },
      StatusID: {
        label: 'Status',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: "Status is required"
        }
      },
      ProductID: {
        label: 'Product',
        defaultValue: null
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: null
      }
    };
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<ImportOrder>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'VendorName',
      label: formConfig.VendorID.label,
      validationMessage: formConfig.VendorID.error,
      placeholder: 'Search Vendor',
      options: [],
      optionLabel: 'CompanyName',
      columns: [
        { data: 'CompanyCode', label: 'Code', width: '150px' },
        { data: 'CompanyName', label: 'Name', width: '150px' }
      ],
    }
  }
  
  getLoadingPortAutoCompleteDef(formConfig: FormConfigType<ImportOrder>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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
  
  getDischargePortAutoCompleteDef(formConfig: FormConfigType<ImportOrder>, form: FormGroup): AutoCompleteDef<Port_SelectList> {
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

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<ImportOrder>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<ImportOrder_IndexTableList> {
    return {
      tableKey: 'IE_ImportOrder_IndexDataView',
      defaultSortColumn: { sortField: 'ImportOrderNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'ImportOrderNo', label: 'Order No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown' }
      ],
      sortFields: [
        { field: 'ImportOrderNo', label: 'Order No', enabled: true, order: 1 },
        { field: 'ImportOrderDate', label: 'Order Date', enabled: true, order: 0 },
        { field: 'NetAmountBC', label: 'Net Amount BC', enabled: false, order: 0 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}
