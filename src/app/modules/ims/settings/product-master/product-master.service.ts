import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { GenericMasterService } from '../generic-master/generic-master.service';
import { ItemCategory_SelectList, ItemCategoryRequest } from '../item-category-master/item-category-master';
import { ItemCategoryMasterService } from '../item-category-master/item-category-master.service';
import { ItemGroupMasterService } from '../item-group-master/item-group-master.service';
import { UOM_SelectList, UOMRequest } from '../uom-master/uom-master';
import { UOMMasterService } from '../uom-master/uom-master.service';
import { Product_Details, Product_IndexTableFilter, Product_IndexTableList, Product_SelectList, ProductMaster, ProductRequest } from './product-master';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  private endpoint = 'IMS/ProductMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private itemGroupMasterService: ItemGroupMasterService,
    private itemCategoryMasterService: ItemCategoryMasterService,
    private genericMasterService: GenericMasterService,
    private uomMasterService: UOMMasterService,
    private taxSlabMasterService: TaxSlabMasterService
  ) { }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{
    itemCategoryList: ApiListResponse<ItemCategory_SelectList>;
    uomList: ApiListResponse<UOM_SelectList>;
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
  }> {
    return forkJoin({
      itemCategoryList: this.itemCategoryMasterService.PopulateList({ PopulateType: "SelectList" } as ItemCategoryRequest),
      uomList: this.uomMasterService.PopulateList({ PopulateType: "SelectList" } as UOMRequest),
      taxSlabList: this.taxSlabMasterService.PopulateList({ PopulateType: "SelectList" } as TaxSlabRequest)
    });
  }

  LoadItemCategory(model: ItemCategoryRequest): Observable<ApiListResponse<ItemCategory_SelectList>> {
    return this.itemCategoryMasterService.PopulateList(model)
  }

  PopulateList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    return this.apiService.post<ApiListResponse<Product_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Product_IndexTableFilter>): Observable<ApiPagedListResponse<Product_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Product_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(productID: number): Observable<ApiDataResponse<Product_Details>> {
    return this.apiService.post<ApiDataResponse<Product_Details>>(`${this.endpoint}/GetDetails?productID=${productID}`, {});
  }

  CreateRecord(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Update`, model);
  }

  DeleteReactivate(productID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?ProductID=${productID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Product_IndexTableFilter> {
    return {
      ProductCode: '',
      ProductName: '',
      ItemCategoryName: '',
      UOMName: '',
      ActiveStatusID: 0
    };
  }

  getFormConfig(): FormConfigType<ProductMaster> {
    return {
      ProductID: {
        label: '',
        defaultValue: null
      },
      ProductCode: {
        label: 'Product Code',
        defaultValue: 'NEW'
      },
      ItemCategoryID: {
        label: 'Item Category',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Item Category is required.'
        }
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: '',
        validators: [Validators.required, Validators.maxLength(150), NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Product Name is required.',
          maxlength: 'Maximum 150 characters allowed.'
        }
      },
      ModelCode: {
        label: 'Model Code',
        defaultValue: '',
        validators: [Validators.maxLength(150), NotOnlyWhitespaceValidator()],
        validationMessages: {
          maxlength: 'Maximum 150 characters allowed.'
        }
      },
      UOMID: {
        label: 'UOM',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Unit of Measure is required.'
        }
      },
      Unit: {
        label: 'Unit',
        defaultValue: null
        // validators: [Validators.required, Validators.min(0.0001), Validators.max(10000)],
        // validationMessages: {
        //   required: 'Unit is required.',
        //   min: 'Unit must be greater than zero.',
        //   max: 'Unit cannot exceed 10,000.'
        // }
      },
      HSCode: {
        label: 'HS Code',
        defaultValue: '',
        validators: [Validators.minLength(2), Validators.maxLength(8), Validators.pattern(/^\d{2,8}$/)],
        validationMessages: {
          minlength: "HS Code must be at least 2 digits.",
          maxlength: "HS Code cannot exceed 8 digits.",
          pattern: "HS Code must contain only digits."
        },
        type: 'control'
      },
      TaxSlabID: {
        label: 'Tax Slab',
        defaultValue: null
      },
      PurTaxOn: {
        label: 'Pur Tax on',
        defaultValue: ""
      },
    };
  }
}
