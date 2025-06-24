import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemCategory_SelectList, ItemCategoryRequest } from '../item-category-master/item-category-master';
import { ItemCategoryMasterService } from '../item-category-master/item-category-master.service';
import { ItemGroup_SelectList, ItemGroupRequest } from '../item-group-master/item-group-master';
import { ItemGroupMasterService } from '../item-group-master/item-group-master.service';
import { ItemType_SelectList, ItemTypeRequest } from '../item-type-master/item-type-master';
import { ItemTypeMasterService } from '../item-type-master/item-type-master.service';
import { GenericMaster, GenericRequest, Generic_IndexTableFilter, Generic_IndexTableList, Generic_SelectList } from './generic-master';

@Injectable({
  providedIn: 'root'
})
export class GenericMasterService {
  private endpoint = 'IMS/GenericMaster';

  constructor(
    private apiService: ApiService,
    private itemTypeMasterService: ItemTypeMasterService,
    private itemGroupMasterService: ItemGroupMasterService,
    private itemCategoryMasterService: ItemCategoryMasterService,
  ) {}

  GetMasterDropdownLists(): Observable<{ 
    itemTypeMasterList: ApiListResponse<ItemType_SelectList>;
    }> {
    return forkJoin({
      itemTypeMasterList: this.itemTypeMasterService.PopulateList({PopulateType: "SelectList"} as ItemTypeRequest),
    });
  }

  LoadItemGroup(model: ItemGroupRequest): Observable<ApiListResponse<ItemGroup_SelectList>> {
    return this.itemGroupMasterService.PopulateList(model)
  }

  LoadItemCategory(model: ItemCategoryRequest): Observable<ApiListResponse<ItemCategory_SelectList>> {
    return this.itemCategoryMasterService.PopulateList(model)
  }

  PopulateList(model: GenericRequest): Observable<ApiListResponse<Generic_SelectList>> {
    return this.apiService.post<ApiListResponse<Generic_SelectList>>( `${this.endpoint}/PopulateList`, model );
  }

  PopulateGrid(model: DataTableParams<Generic_IndexTableFilter>): Observable<ApiPagedListResponse<Generic_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Generic_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(genericID: number): Observable<ApiDataResponse<GenericMaster>> {
    return this.apiService.post<ApiDataResponse<GenericMaster>>(`${this.endpoint}/GetDetails?GenericID=${genericID}`, {});
  }

  CreateRecord(model: GenericMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: GenericMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: GenericMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Generic_IndexTableFilter> {
    return {
      GenericCode: '',
      GenericName: '',
      ItemCategoryName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<GenericMaster> {
    return {
      GenericID: {
        label: '',
        defaultValue: null,
      },
      GenericCode: {
        label: 'Generic/Item Code',
        defaultValue: 'NEW'
      },
      GenericName: {
        label: 'Generic/Item Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Generic/Item Name is required'
        }
      },
      ItemTypeID:{
        label: 'Item Type',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ItemGroupID:{
        label: 'Item Group',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ItemCategoryID:{
        label: 'Item Category',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
}
