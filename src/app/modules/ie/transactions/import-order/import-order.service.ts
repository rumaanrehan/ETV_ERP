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
import { Product_SelectList, ProductRequest } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { Company_SelectList, CompanyRequest } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { Port_SelectList, PortRequest } from '../../settings/port-master/port-master';
import { PortMasterService } from '../../settings/port-master/port-master.service';
import { ImportOrder, ImportOrder_IndexTableFilter, ImportOrder_IndexTableList, ImportOrder_IndexTableSort, ImportOrder_SelectList, ImportOrderDetail, ImportOrderRequest } from './import-order';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';

@Injectable({
  providedIn: 'root'
})
export class ImportOrderService {
  private endpoint = 'IE/ImportOrder';

  constructor(
    private apiService: ApiService,
    private portService: PortMasterService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    private selectListService: SelectListService
  ) { }

  GetMasterDropdownLists(): Observable<{
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
  }> {
    return forkJoin({
      taxSlabList: this.taxSlabMasterService.PopulateList({ PopulateType: 'SelectList' } as TaxSlabRequest),
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

  PopulateList(model: ImportOrderRequest): Observable<ApiListResponse<ImportOrder_SelectList>> {
    return this.apiService.post<ApiListResponse<ImportOrder_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<ImportOrder_IndexTableFilter>): Observable<ApiPagedListResponse<ImportOrder_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ImportOrder_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(importOrderID: number): Observable<ApiDataResponse<ImportOrder>> {
    return this.apiService.post<ApiDataResponse<ImportOrder>>(`${this.endpoint}/GetDetails?importOrderID=${importOrderID}`, {});
  }

  GetOrderItemDetails(importOrderID: number): Observable<ApiListResponse<ImportOrderDetail>> {
    return this.apiService.post<ApiListResponse<ImportOrderDetail>>(`${this.endpoint}/GetOrderItemDetails?importOrderID=${importOrderID}`, {});
  }

  CreateRecord(model: ImportOrder): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ImportOrder): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ImportOrder): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<ImportOrder_IndexTableFilter> {
    return {
      ImportOrderNo: {
        label: 'Order No',
        defaultValue: ''
      },
      CustomerName: {
        label: 'Order No',
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
      VendorID: {
        label: 'Vendor',
        defaultValue: null,
        // validators: [Validators.required],
        // validationMessages: {
        //   required: "Vendor is required"
        // }
      },
      VendorName: {
        label: 'Vendor',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Vendor Name is required"
        }
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
          PurchaseQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Purchase Qty is required"
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
          TaxAmountBC: {
            label: 'Tax Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Tax in base currency is required"
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
          }
        }
      },
      PaymentTerms: {
        label: 'Payment Terms',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          require: "Payment Terms are required"
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
          require: "Status is required"
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
        {
          field: 'StatusID',
          label: 'Status',
          type: 'dropdown'
        }
      ],
      sortFields: [
        { field: 'ImportOrderNo', label: 'Order No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}
