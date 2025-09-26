import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { ProductMasterService } from '../../../ims/settings/product-master/product-master.service';
import { CompanyMasterService } from '../../settings/company-master/company-master.service';
import { PaymentTermMasterService } from '../../settings/payment-term-master/payment-term-master.service';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SalesEnquiry, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_SelectList, SalesEnquiryDetail, SalesEnquiryRequest } from './sales-enquiry';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ProductRequest, Product_SelectList } from '../../../ims/settings/product-master/product-master';
import { CompanyRequest, Company_SelectList } from '../../settings/company-master/company-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { FormGroup, Validators } from '@angular/forms';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class SalesEnquiryService {
  private endpoint = 'IE/SalesEnquiry';

  constructor(
    private apiService: ApiService,
    private companyMasterService: CompanyMasterService,
    private productMasterService: ProductMasterService,
    private paymentTermMasterService: PaymentTermMasterService,
    private selectListService: SelectListService
  ) { }
  
  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }
  
  GetCompanyList(model: CompanyRequest): Observable<ApiListResponse<Company_SelectList>> {
    return this.companyMasterService.PopulateList(model);
  }

  GetProductList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.productMasterService.PopulateList(model);
  }

  PopulateList(model: SalesEnquiryRequest): Observable<ApiListResponse<SalesEnquiry_SelectList>> {
    return this.apiService.post<ApiListResponse<SalesEnquiry_SelectList>>(`${this.endpoint}/PopulateList?`, model);
  }

  PopulateGrid(model: DataTableParams<SalesEnquiry_IndexTableFilter>): Observable<ApiPagedListResponse<SalesEnquiry_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<SalesEnquiry_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(EnquiryID: number): Observable<ApiDataResponse<SalesEnquiry>> {
    return this.apiService.post<ApiDataResponse<SalesEnquiry>>(`${this.endpoint}/GetDetails?enquiryID=${EnquiryID}`, {});
  }

  GetOrderItemDetails(EnquiryID: number): Observable<ApiListResponse<SalesEnquiryDetail>> {
    return this.apiService.post<ApiListResponse<SalesEnquiryDetail>>(`${this.endpoint}/GetOrderItemDetails?enquiryID=${EnquiryID}`, {});
  }

  CreateRecord(model: SalesEnquiry): Observable<ApiResponse> {
    console.log(model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: SalesEnquiry): Observable<ApiResponse> {
     console.log(model)
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
    
  }

  CancelOrder(model: SalesEnquiry): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Cancel`, model);
  }
  
  getFormConfig_DataTableFilter(): FormConfigType<SalesEnquiry_IndexTableFilter> {
    return {
      EnquiryNo: {
        label: 'Enquiry No',
        defaultValue: ''
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: ''
      },
      StatusID: {
        label: 'Status',
        defaultValue: 0
      },

    }
  }

  getFormConfig(): FormConfigType<SalesEnquiry> {
    return {
      EnquiryNo: {
        label: 'EnquiryNo',
        defaultValue: "NEW"
      },
      EnquiryID: {
        label: '',
        defaultValue: null
      },
      StatusID: {
        label: 'Status',
        defaultValue: null

      },
      ProductID: {
        label: 'ProductID',
        defaultValue: null

      },
      EnquiryDate: {
        label: 'Enquire Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: "Order Date is required"
        }
      },
      CustomerName: {
        label: 'Customer Name',
        defaultValue: null,
      },
      CustomerID: {
        label: 'Customer ID',
        defaultValue: null,
      },
    
      ContactPersonName: {
        label: 'Contact Person Name',
        defaultValue: null,
      },
      Phone: {
        label: 'Phone',
        defaultValue: null,
        validators: [
         Validators.required,
         Validators.pattern(/^[6-9]\d{9}$/) // Indian 10-digit numbers starting with 6-9
      ],
        validationMessages: {
        required: "Phone number is required",
        pattern: "Enter a valid 10-digit phone number"
      }
    },
    Email: {
      label: 'Email',
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
        validators: [Validators.required],
        validationMessages: {
          required: "Status is required"
        }
    },
    ExpectedDeliveryDate: {
      label: 'Expected Delivery Date',
      defaultValue: null,
      validators: [Validators.required],
      validationMessages: {
        required: "Expected Delivery Date is required"
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
          validators: [Validators.required],
          validationMessages: {
            required: " ProductID is required"
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
        RequestedQty: {
          label: '',
          defaultValue: null,
          validators: [Validators.required],
          validationMessages: {
            required: "RequestedQty is required"
          }
        },
        Remark: {
          label: 'Remark',
          defaultValue: '',
          validators: [
            Validators.required,
            Validators.maxLength(200)
          ],
          validationMessages: {
            required: 'Remark is required',
            maxlength: 'Remark cannot exceed 200 characters'
          }
       },
      }
    },
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