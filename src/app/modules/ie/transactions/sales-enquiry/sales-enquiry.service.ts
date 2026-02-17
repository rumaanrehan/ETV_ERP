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
import { SalesEnquiry, SalesEnquiryBulkUpdateRequest, SalesEnquiryDetail, SalesEnquiryRequest, SalesEnquiry_Detail, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_IndexTableSort, SalesEnquiry_SelectList } from './sales-enquiry';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { noFractionValidator } from '../../../../shared/validators/no-fraction.validator';
import { GreaterThanOrEqual } from '../../../../shared/validators/greater-than-equal-to.validator';
import { LessThanOrEqual } from '../../../../shared/validators/less-than-equal-to.validator';

@Injectable({
  providedIn: 'root'
})
export class SalesEnquiryService {
  private endpoint = 'IE/SalesEnquiry';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private http: HttpClient,
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

  BulkChangeStatus(model: SalesEnquiryBulkUpdateRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/BulkChangeStatus`, model);
  }

  GeneratePdf(request: any) {
    return this.http.post(`${Environment.apiBaseUrl}/${this.endpoint}/PrintInvoice`, request, { responseType: 'blob' });
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
        defaultValue: new Date(),
        validators: [Validators.required, LessThanOrEqual("ExpectedDeliveryDate")],
        validationMessages: {
          required: "Enquiry Date is required",
          lessThanOrEqual: "Enquiry Date must be less than or equal to Expected Delivery Date"
        },
        type: 'control',
      },
      ExpectedDeliveryDate: {
        label: 'Expected Delivery Date',
        defaultValue: null,
        validators: [GreaterThanOrEqual("EnquiryDate")],
        validationMessages: {
          greaterThanOrEqual: "Expected Delivery Date must be greater than or equal to Enquiry Date"
        },
        type: 'control'
      },
      CustomerID: {
        label: 'Customer',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer is required"
        },
        type: 'control'
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Customer is required"
        },
        type: 'control'
      },
      ContactName: {
        label: 'Contact Name',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator()],
        validationMessages: {
          notOnlyWhitespace: "Name person name cannot be empty or whitespace"
        },
        type: 'control',
      },
      ContactPhone: {
        label: 'Contact Phone',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator(), Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)],
        validationMessages: {
          notOnlyWhitespace: "Contact Phone cannot be empty or whitespace",
          pattern: 'Enter a valid phone number'
        },
        type: 'control'
      },
      ContactEmail: {
        label: 'Contact Email',
        defaultValue: '',
        validators: [NotOnlyWhitespaceValidator(), Validators.email],
        validationMessages: {
          notOnlyWhitespace: "Contact Email cannot be empty or whitespace",
          email: 'Enter a valid email address'
        },
        type: 'control'
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
            },
            type: 'control'
          },
          RequestedQty: {
            label: '',
            defaultValue: null,
            validators: [Validators.required, Validators.min(1), Validators.max(99999), noFractionValidator()],
            validationMessages: {
              required: "Requested Qty is required",
              min: "Requested Qty must be at least 1",
              max: "Requested Qty cannot exceed 99999",
              noFraction: "Requested Qty cannot have fractions"
            },
            type: 'control'
          },
          UOM: {
            label: 'Measurement Unit',
            defaultValue: null
          },
          Remarks: {
            label: '',
            defaultValue: '',
            validators: [Validators.maxLength(200)],
            validationMessages: {
              maxlength: 'Remarks cannot exceed 200 characters'
            }
          },
        }
      },
      Note: {
        label: 'Note',
        defaultValue: '',
        validators: [Validators.maxLength(500)],
        validationMessages: {
          maxlength: 'Note cannot exceed 500 characters'
        },
        type: 'control'
      },
    };
  }

  getCompanyMasterAutoCompleteDef(formConfig: FormConfigType<SalesEnquiry>, form: FormGroup): AutoCompleteDef<Company_SelectList> {
    return {
      type: 'formControl',
      group: form,
      control: 'CustomerName',
      label: formConfig.CustomerName.label,
      validationMessage: formConfig.CustomerName.error,
      placeholder: 'Search Customer',
      options: [],
      optionLabel: 'CompanyName',
      columns: [
        { data: 'CompanyCode', label: 'Code', width: '150px' },
        { data: 'CompanyName', label: 'Name', width: '150px' }
      ],
    }
  }

  getProductAutoCompleteDef(formConfig: FormConfigType<SalesEnquiryDetail>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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

  getDataViewDef(filterForm: FormGroup, sortingForm: FormGroup): DataViewDef<SalesEnquiry_IndexTableList> {
    return {
      tableKey: 'IE_SalesEnquiry_IndexDataView',
      defaultSortColumn: { sortField: 'SalesEnquiryNo', sortOrder: 1 },
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