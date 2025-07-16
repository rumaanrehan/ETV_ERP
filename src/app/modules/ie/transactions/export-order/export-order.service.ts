import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_SelectList, ExportOrderDetail, ExportOrderRequest } from './export-order';
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

@Injectable({
  providedIn: 'root'
})
export class ExportOrderService {
  private endpoint = 'IE/ExportOrder';

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
      taxSlabList: this.taxSlabMasterService.PopulateList({PopulateType: 'SelectList'} as TaxSlabRequest),
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
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: ExportOrder): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<ExportOrder_IndexTableFilter> {
    return {
      ExportOrderNo: {
        label: 'Order No',
        defaultValue: ''
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    };
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
        label: 'Customer',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer Name is required"
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
              require: "Product is required"
            }
          },
          ProductName: {
            label: 'Product Name',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Product is required"
            }
          },
          SalesQty: {
            label: 'Sales Qty',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Sales Qty is required"
            }
          },
          SalesTaxRate: {
            label: 'Tax Rate',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Tax Rate is required"
            }
          },
          RatePerUnitBC: {
            label: 'Rate Per Unit',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Rate is required"
            }
          },
          RatePerUnitFC: {
            label: 'Rate Per Unit FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Rate in foreign currency is required"
            }
          },
          TaxAmountBC: {
            label: 'Tax Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Tax in base currency is required"
            }
          },
          TaxAmountFC: {
            label: 'Tax Amount FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Tax in foreign currency is required"
            }
          },
          TaxableAmountFC: {
            label: 'Taxable Amount FC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Taxable amount in foreign currency is required"
            }
          },
          TaxableAmountBC: {
            label: 'Taxable Amount BC',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              require: "Taxable Amount in base currency is required"
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
