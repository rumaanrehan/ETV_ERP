
import { GenericMasterService } from '../generic-master/generic-master.service';
import { ItemCategory_SelectList, ItemCategoryRequest } from '../item-category-master/item-category-master';
import { ItemCategoryMasterService } from '../item-category-master/item-category-master.service';
import { ItemGroup_SelectList, ItemGroupRequest } from '../item-group-master/item-group-master';
import { ItemGroupMasterService } from '../item-group-master/item-group-master.service';
import { Manufacturer_SelectList, ManufacturerRequest } from '../manufacturer-master/manufacturer-master';
import { ManufacturerMasterService } from '../manufacturer-master/manufacturer-master.service';
import { UOM_SelectList, UOMRequest } from '../uom-master/uom-master';
import { UOMMasterService } from '../uom-master/uom-master.service';
import { Product_SelectList, ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList, ProductRequest } from './product-master';
import { ItemTypeMasterService } from '../item-type-master/item-type-master.service';
import { ItemType_SelectList, ItemTypeRequest } from '../item-type-master/item-type-master';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { StaticListRequest, StaticList } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { GenericRequest, Generic_SelectList } from '../generic-master/generic-master';
import { TaxSlabMasterService } from '../../../admin/settings/tax-slab-master/tax-slab-master.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/tax-slab-master/tax-slab-master';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  private endpoint = 'IMS/ProductMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private itemTypeMasterService: ItemTypeMasterService,
    private itemGroupMasterService: ItemGroupMasterService,
    private itemCategoryMasterService: ItemCategoryMasterService,
    private genericMasterService: GenericMasterService,
    private ManufacturerMasterService: ManufacturerMasterService,
    private uomMasterService: UOMMasterService,
    private taxSlabMasterService: TaxSlabMasterService,
    
  ) {}

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{ 
    itemTypeList: ApiListResponse<ItemType_SelectList>
    // itemGroupList: ApiListResponse<ItemGroup_SelectList>;
    // itemCategoryList: ApiListResponse<ItemCategory_SelectList>;
    // itemList: ApiListResponse<Generic_SelectList>;
    manufacturerList: ApiListResponse<Manufacturer_SelectList>;
    uomList: ApiListResponse<UOM_SelectList>;
    taxSlabList: ApiListResponse<TaxSlab_SelectList>;
    }> {
    return forkJoin({
      itemTypeList: this.itemTypeMasterService.PopulateList({PopulateType: "SelectList"} as ItemTypeRequest),
      // itemGroupList: this.ItemGroupMasterService.PopulateList({PopulateType: "SelectList"} as ItemGroupRequest),
      // itemCategoryList: this.ItemCategoryMasterService.PopulateList({PopulateType: "SelectList"} as ItemCategoryRequest),
      // itemList: this.genericMasterService.PopulateList("SelectList"),
      manufacturerList: this.ManufacturerMasterService.PopulateList({PopulateType: "SelectList"} as ManufacturerRequest),
      uomList: this.uomMasterService.PopulateList({PopulateType: "SelectList"} as UOMRequest),
      taxSlabList: this.taxSlabMasterService.PopulateList({PopulateType: "SelectList"} as TaxSlabRequest)
    });
  }

  LoadItemGroup(model: ItemGroupRequest): Observable<ApiListResponse<ItemGroup_SelectList>> {
    return this.itemGroupMasterService.PopulateList(model)
  }

  LoadItemCategory(model: ItemCategoryRequest): Observable<ApiListResponse<ItemCategory_SelectList>> {
    return this.itemCategoryMasterService.PopulateList(model)
  }

  loadGeneric(model: GenericRequest): Observable<ApiListResponse<Generic_SelectList>> {
    return this.genericMasterService.PopulateList(model)
  }

  PopulateList(model: ProductRequest): Observable<ApiListResponse<Product_SelectList>> {
    console.log("Loading Product List...");
    return this.apiService.post<ApiListResponse<Product_SelectList>>(`${this.endpoint}/PopulateList`, model);
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

  DeleteReactivate(model: ProductMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ProductMaster_IndexTableFilter> {
    return {
      ProductCode: '',
      ProductName: '',
      ItemGroupName: '',
      ItemCategoryName: '',
      GenericItemName: '',
      ManufacturerName: '',
      UOMName: '',
      ActiveStatusID: 0
    };
  }

  getFormConfig(): FormConfigType<ProductMaster> {
    return {
      ProductID: {
        label:'',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ProductCode: {
        label:'Product Code',
        defaultValue: 'NEW',
        validators: [],
        validationMessages: {}
      },
      ItemTypeID: {
        label: 'Item Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          require: "Item Type is required"
        }
      },
      ItemGroupID: {
        label: 'Item Group ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          require: "Item Griup is required"
        }
      },
      ItemCategoryID: {
        label: 'Item Category ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          require: "Item Category is required"
        }
      },
      ProductName: {
        label: 'Product Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Product Name is required.',
        },
      },
      GenericID: {
        label: 'Generic/Item',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ManufacturerID: {
        label: 'Manufacturer',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      UOMID: {
        label: 'UOM',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      Unit: {
        label: 'Unit',
        defaultValue: null,
      },
      HSCode: {
        label: 'HS Code',
        defaultValue: '',
      },
      TaxSlabID: {
        label: 'Tax Slab ID',
        defaultValue: 0,
      },
      PurTaxRate: {
        label: 'Purchase Tax Rate',
        defaultValue: 0,
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
        defaultValue: false,
      },
      IsApprovalRequiredToIssue: {
        label: 'Is Approval Required To Issue',
        defaultValue: false,
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
      },
      ProductDescription:{
        label: 'Product Description',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      PurTaxOn: {
        label: 'Tax on',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Purchase Tax On is required',
        },
      },
    };
  }
}
