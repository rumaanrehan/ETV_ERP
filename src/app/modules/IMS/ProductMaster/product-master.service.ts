import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList } from './product-master';
import { Environment } from '../../../../environments/environment';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { StaticList, StaticListRequest } from '../../../shared/models/select-list';
import { SelectListService } from '../../../shared/services/select-list.service';
import { ApiService } from '../../../core/services/api.service';
import { ItemCategoryMasterService } from '../ItemCategoryMaster/item-category-master.service';
import { ItemCategoryMaster_SelectList } from '../ItemCategoryMaster/item-category-master';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  private endpoint = 'IMS/ProductMaster';
  
  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private itemcategoryMasterService: ItemCategoryMasterService
  ) {}

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{ 
    categoryList: ApiListResponse<ItemCategoryMaster_SelectList>;
    }> {
    return forkJoin({
      categoryList: this.itemcategoryMasterService.PopulateList("SelectList"),
    });
  }
  
  PopulateGrid(model: DataTableParams<ProductMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ProductMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ProductMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }


  GetDetails(productID: number): Observable<ApiDataResponse<ProductMaster>> {
    return this.apiService.post<ApiDataResponse<ProductMaster>>(`${this.endpoint}/GetDetails?productID=${productID}`, {});
  }

  CreateRecord(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Update`, model);
  }

  DeleteProduct(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
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
