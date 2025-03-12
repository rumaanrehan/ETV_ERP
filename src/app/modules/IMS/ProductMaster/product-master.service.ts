import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList } from './product-master';
import { Environment } from '../../../../environments/environment';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  private apiUrl: string;
  
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  
  PopulateList(CategoryID?: number, PopulateType?: any): Observable<ApiListResponse<ProductMaster>> {
    return this.http.post<ApiListResponse<ProductMaster>>(`${this.apiUrl}Admin/StateMaster/PopulateList?CountryID=${CategoryID}&PopulateType=${PopulateType}`, {});
  }
  
  PopulateGrid(model: DataTableParams<ProductMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ProductMaster_IndexTableList>> {
    return this.http.post<ApiPagedListResponse<ProductMaster_IndexTableList>>(`${this.apiUrl}IMS/ProductMaster/PopulateGrid`, model);
  }


  GetDetails(productId: number): Observable<ApiDataResponse<ProductMaster>> {
    return this.http.post<ApiDataResponse<ProductMaster>>(`${this.apiUrl}IMS//GetDetails?productId=${productId}`, {});
  }

  CreateProduct(product: ProductMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, product);
  }



  UpdateProduct(model: ProductMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, model);
  }

  DeleteProduct(id: ProductMaster): Observable<ApiResponse> {
    const body = { ProductId: id };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Delete`, body);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ProductMaster_IndexTableFilter> {
    return {
      ProductCode: '',
      ProductName: '',
      ProductCategory: '',
      IsActive: true
    }
  }

  getFormConfig(): FormConfigType<ProductMaster> {
    return {
      ProductID: {
        label: '',
        defaultValue: null
      },
      ProductCode: {
        label: 'Product Code',
        defaultValue: 'NEW',
        validators: [Validators.required],
        validationMessages: {
          required: 'Product Code is required.',
        },
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Product Name is required.',
        },
      },
      CategoryID: {
        label: 'Product Category',
        defaultValue: 0
      },
      ProductDescription: {
        label: 'Product Description',
        defaultValue: ''
      },
      GenericID: {
        label: 'Generic/Item Name',
        defaultValue: 0
      },
      ManufacturerID: {
        label: 'Manufacturer ID',
        defaultValue: 0
      },
      UOMID: {
        label: 'UOM ID',
        defaultValue: 0
      },
      Unit: {
        label: 'Unit',
        defaultValue: null
      },
      HSCode: {
        label: 'HS Code',
        defaultValue: ''
      },
      PurTaxOn: {
        label: 'Unit Price',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Purchase Tax On is required'
        }
      },
      TaxSlabID: {
        label: 'Tax Slab ID',
        defaultValue: 0
      },
      PurTaxRate: {
        label: 'Purchase Tax Rate',
        defaultValue: 0
      },
      ReorderLevel: {
        label: 'Reorder Level',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Reorder Level cannot be negative.',
        },
      },
      ReorderQty: {
        label: 'Reorder Quantity',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Reorder Quantity cannot be negative.',
        },
      },
      IsApprovalRequiredToPurchase: {
        label: 'Is Approval Required To Purchase',
        defaultValue: false
      },
      IsApprovalRequiredToIssue: {
        label: 'Is Approval Required To Issue',
        defaultValue: false
      },
      NetWeight: {
        label: 'Net Weight',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Net Weight cannot be negative.',
        },
      },
      GrossWeight: {
        label: 'Gross Weight',
        defaultValue: null,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Gross Weight cannot be negative.',
        },
      }
    };
  }
}
