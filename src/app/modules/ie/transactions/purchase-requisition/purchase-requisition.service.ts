import { Injectable, model } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { forkJoin, Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { PurchaseRequisition, PurchaseRequisition_Detail, PurchaseRequisition_IndexTableFilter, PurchaseRequisition_IndexTableList, PurchaseRequisition_IndexTableSort, PurchaseRequisition_SelectList, PurchaseRequisitionDetail, PurchaseRequisitionRequest } from './purchase-requisition';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { Currency_SelectList, CurrencyRequest } from '../../../admin/settings/currency-master/currency-master';
import { CurrencyMasterService } from '../../../admin/settings/currency-master/currency-master.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionService {
  private endpoint = 'IE/PurchaseRequisition';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private currencyMasterService: CurrencyMasterService,
    private productMasterService: ProductMasterService,
  ) { }
  
  GetMasterDropdownLists(): Observable<{
    currencyList: ApiListResponse<Currency_SelectList>;
  }> {
    return forkJoin({
      currencyList: this.currencyMasterService.PopulateList({ PopulateType: 'SelectList' } as CurrencyRequest)
    });
  }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }
  
  PopulateList(model: PurchaseRequisitionRequest): Observable<ApiListResponse<PurchaseRequisition_SelectList>> {
    return this.apiService.post<ApiListResponse<PurchaseRequisition_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<PurchaseRequisition_IndexTableFilter>): Observable<ApiPagedListResponse<PurchaseRequisition_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<PurchaseRequisition_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(PurchaseRequisitionID: number): Observable<ApiDataResponse<PurchaseRequisition_Detail>> {
    return this.apiService.post<ApiDataResponse<PurchaseRequisition_Detail>>(`${this.endpoint}/GetDetails?PurchaseRequisitionID=${PurchaseRequisitionID}`, {});
  }

  CreateRecord(model: PurchaseRequisition): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PurchaseRequisition): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(purchaseRequisitionID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel?purchaseRequisitionID=${purchaseRequisitionID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  getFormConfig(): FormConfigType<PurchaseRequisition> {
    return {
      PurchaseRequisitionID: {
        label: '',
        defaultValue: null
      },
      RequisitionNo: {
        label: 'Requisition No',
        defaultValue: "NEW"
      },
      RequisitionDate: {
        label: 'Requisition Date',
        defaultValue: new Date()
      },
      RequestedBy: {
        label: 'Requested By',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Requested By is required"
        }
      },
      FCCurrencyID: {
        label: 'Foreign Currency',
        defaultValue: null,
      },
      ExchangeRateDate: {
        label: 'Exchang Rate Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Exchang Rate Date is required"
        }
      },
      RequiredByDate: {
        label: 'Required By Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Required By Date is required"
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
      Note: {
        label: 'Note',
        defaultValue: '',
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: null
      },
      ProductList: {
        type: 'array',
        items: {
          ProductID: {
            label: '',
            defaultValue: null,
          },
          ProductName: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Product is required"
            }
          },
          RequestedQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required],
            validationMessages: {
              required: "Requested Qty is required"
            }
          },
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
          },
          Remarks: {
            label: '',
            defaultValue: '',
            validators: [
              Validators.maxLength(200)
            ],
            validationMessages: {
              maxlength: 'Remarks cannot exceed 200 characters'
            }
          },
        }
      },
      ProductID: {
        label: 'ProductID',
        defaultValue: null
      }
    };
  }

  getFormConfig_DataTableFilter(): FormConfigType<PurchaseRequisition_IndexTableFilter> {
    return {
      RequisitionNo: {
        label: 'Purchase Requisition ID',
        defaultValue: null
      },
      RequestedBy: {
        label: 'Customer Name',
        defaultValue: ''
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<PurchaseRequisition_IndexTableSort> {
    return {
      RequisitionNo: {
        label: 'Requisition No',
        defaultValue: -1
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<PurchaseRequisition>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<PurchaseRequisition_IndexTableList> {
    return {
      tableKey: 'IE_PurchaseRequisition_IndexDataView',
      defaultSortColumn: { sortField: 'RequisitionNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'RequisitionNo', label: 'Requisition No', type: 'text'},
        { field: 'RequestedBy', label: 'Requested By', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown' }
      ],
      sortFields: [
        { field: 'RequisitionNo', label: 'Requisition No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}
