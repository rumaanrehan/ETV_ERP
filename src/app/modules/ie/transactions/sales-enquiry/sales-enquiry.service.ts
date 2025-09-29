import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { SalesEnquiry, SalesEnquiry_Detail, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_SelectList, SalesEnquiryRequest } from './sales-enquiry';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { GreaterThan } from '../../../../shared/validators/greater-than.validator';

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
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Enquiry Date is required"
        }
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
        validators: [Validators.required],
        validationMessages: {
          required: "Contact Name is required"
        }
      },
      ContactPhone: {
        label: 'Contact Phone',
        defaultValue: null,
        validators: [
          Validators.pattern(/^[6-9]\d{9}$/)
        ],
        validationMessages: {
          pattern: "Enter a valid 10-digit phone number"
        }
      },
      ContactEmail: {
        label: 'Contact Email',
        defaultValue: '',
        validators: [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)
        ],
        validationMessages: {
          required: 'Email is required',
          pattern: 'Please enter a valid email address'
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

  getProductMasterAutoCompleteDef(formConfig: FormConfigType<SalesEnquiry>, form: FormGroup): AutoCompleteDef<Product_SelectList> {
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