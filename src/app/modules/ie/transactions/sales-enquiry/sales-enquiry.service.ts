import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataViewDef } from '../../../../shared/components/z-dataview/z-dataview';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { GreaterThan } from '../../../../shared/validators/greater-than.validator';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { SalesEnquiry, SalesEnquiryRequest, SalesEnquiry_Detail, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_IndexTableSort, SalesEnquiry_SelectList } from './sales-enquiry';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class SalesEnquiryService {
  private endpoint = 'IE/SalesEnquiry';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService
  ) { }

  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  PopulateList(model: SalesEnquiryRequest): Observable<ApiListResponse<SalesEnquiry_SelectList>> {
    return this.apiService.post<ApiListResponse<SalesEnquiry_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<SalesEnquiry_IndexTableFilter>): Observable<ApiPagedListResponse<SalesEnquiry_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<SalesEnquiry_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(salesEnquiryID: number): Observable<ApiDataResponse<SalesEnquiry_Detail>> {
    return this.apiService.post<ApiDataResponse<SalesEnquiry_Detail>>(`${this.endpoint}/GetDetails?salesEnquiryID=${salesEnquiryID}`, {});
  }

  CreateRecord(model: SalesEnquiry): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: SalesEnquiry): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  CancelOrder(model: SalesEnquiry): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }

  getFormConfig_DataTableFilter(): FormConfigType<SalesEnquiry_IndexTableFilter> {
    return {
      SalesEnquiryNo: {
        label: 'Sales Enquiry No',
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
    }
  }

  getFormConfig_DataTableSort(): FormConfigType<SalesEnquiry_IndexTableSort> {
    return {
      SalesEnquiryNo: {
        label: 'Sales Enquiry No',
        defaultValue: -1
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      }
    }
  }

  getFormConfig(): FormConfigType<SalesEnquiry> {
    return {
      SalesEnquiryNo: {
        label: 'Sales Enquiry No',
        defaultValue: "NEW"
      },
      SalesEnquiryID: {
        label: '',
        defaultValue: null
      },
      EnquiryDate: {
        label: 'Enquiry Date',
        defaultValue: new Date()
      },
      CustomerID: {
        label: 'Customer ID',
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
      ContactName: {
        label: 'Contact Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator],
        validationMessages: {
          required: "Name person name is required",
        }
      },
      ContactPhone: {
        label: 'Contact Phone',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)],
        validationMessages: {
          required: 'Phone No is required',
          pattern: 'Enter a valid phone number'
        }
      },
      ContactEmail: {
        label: 'Contact Email',
        defaultValue: '',
        validators: [Validators.email],
        validationMessages: {
          email: 'Enter a valid email address'
        }
      },
      Note: {
        label: 'Note',
        defaultValue: '',
      },
      ExpectedDeliveryDate: {
        label: 'Expected Delivery Date',
        defaultValue: null,
        validators: [GreaterThan("EnquiryDate")],
        validationMessages: {
          greaterThan: "Expected Delivery Date must be after Enquiry Date"
        }
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

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<SalesEnquiry>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
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

  getProductAutoCompleteDef(formConfig: FormConfigType<SalesEnquiry>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
    return {
      type: 'formControl',
      group:form,
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<SalesEnquiry_IndexTableList> {
    return {
      tableKey: 'IE_SalesEnquiry_IndexDataView',
      defaultSortColumn: { sortField: 'ExportOrderNo', sortOrder: 1 },
      filterForm: filterForm,
      sortingForm: sortingForm,
      filterFields: [
        { field: 'SalesEnquiryNo', label: 'Enquiry No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        {
          field: 'StatusID',
          label: 'Status',
          type: 'dropdown'
        }
      ],
      sortFields: [
        { field: 'SalesEnquiryNo', label: 'Enquiry No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],

      data: [],
      totalRecords: 0,
      loading: false
    }
  }
}