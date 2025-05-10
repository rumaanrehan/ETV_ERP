import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../shared/models/select-list';
import { SelectListService } from '../../../shared/services/select-list.service';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemCategoryMaster_SelectList } from '../ItemCategoryMaster/item-category-master';
import { ItemCategoryMasterService } from '../ItemCategoryMaster/item-category-master.service';
import { ItemGroupMaster_SelectList } from '../ItemGroupMaster/item-group-master';
import { ItemGroupMasterService } from '../ItemGroupMaster/item-group-master.service';
import { ManufacturerMaster_SelectList } from '../Manufacturer-Master/manufacturer-master';
import { ManufacturerMasterService } from '../Manufacturer-Master/manufacturer-master.service';
import { UOMMaster_SelectList } from '../UOMMaster/UOM-master';
import { UOMMasterService } from '../UOMMaster/UOM-master.service';
import { ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList } from './product-master';
import { ItemMasterService } from '../GenericItemMaster/item-master.service';
import { ItemMaster_SelectList } from '../GenericItemMaster/item-master';

@Injectable({
  providedIn: 'root',
})
export class ProductMasterService {
  private endpoint = 'IMS/ProductMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private ItemGroupMasterService: ItemGroupMasterService,
    private ItemCategoryMasterService: ItemCategoryMasterService,
    private itemMasterService: ItemMasterService,
    private ManufacturerMasterService: ManufacturerMasterService,
    private UOMMasterService: UOMMasterService,
  ) {}

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetMasterDropdownLists(): Observable<{ 
    itemGroupList: ApiListResponse<ItemGroupMaster_SelectList>;
    itemCategoryList: ApiListResponse<ItemCategoryMaster_SelectList>;
    itemList: ApiListResponse<ItemMaster_SelectList>;
    manufactBy urerList: ApiListResponse<ManufacturerMaster_SelectList>;
    uOMList: ApiListResponse<UOMMaster_SelectList>;
    }> {
    return forkJoin({
      itemGroupList: this.ItemGroupMasterService.PopulateList("SelectList"),
      itemCategoryList: this.ItemCategoryMasterService.PopulateList("SelectList"),
      itemList: this.itemMasterService.PopulateList("SelectList"),
      manufacturerList: this.ManufacturerMasterService.PopulateList("SelectList"),
      uOMList: this.UOMMasterService.PopulateList("SelectList")
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
      ProductName: {
        label: 'Product Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Product Name is required.',
        },
      },
      ItemGroupID: {
        label: 'Item Group ID',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ItemCategoryID: {
        label: 'Item Category ID',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      GenericItemID: {
        label: 'Generic Item ID',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ManufacturerID: {
        label: 'Manufacturer ID',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      UOMID: {
        label: 'UOM ID',
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
        label: 'Unit Price',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Purchase Tax On is required',
        },
      },
    };
  }
}
