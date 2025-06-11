import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemGroup_SelectList } from '../item-group-master/item-group-master';
import { ItemGroupMasterService } from '../item-group-master/item-group-master.service';
import { ItemCategoryMaster, ItemCategory_IndexFilter, ItemCategory_IndexList, ItemCategory_SelectList } from './item-category-master';

@Injectable({
  providedIn: 'root',
})
export class ItemCategoryMasterService {
  private endpoint = 'IMS/ItemCategoryMaster';

  constructor(
    private apiService: ApiService,
    private itemGroupService: ItemGroupMasterService,
  ) { }

  GetMasterDropdownLists(): Observable<{ 
    itemGroupList: ApiListResponse<ItemGroup_SelectList>;
    }> {
    return forkJoin({
      itemGroupList: this.itemGroupService.PopulateList("SelectList"),
    });
  }

  PopulateList(populateType: string): Observable<ApiListResponse<ItemCategory_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemCategory_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }

  PopulateGrid(model: DataTableParams<ItemCategory_IndexFilter>): Observable<ApiPagedListResponse<ItemCategory_IndexList>> {
    return this.apiService.post<ApiPagedListResponse<ItemCategory_IndexList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(ItemCategoryID: number): Observable<ApiDataResponse<ItemCategoryMaster>> {
    return this.apiService.post<ApiDataResponse<ItemCategoryMaster>>(`${this.endpoint}/GetDetails?ItemCategoryID=${ItemCategoryID}`, {});
  }

  CreateRecord(model: ItemCategoryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ItemCategoryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ItemCategoryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemCategory_IndexFilter>{
    return {
      ItemCategoryCode: '',
      ItemCategoryName: '',
      ItemGroupName: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<ItemCategoryMaster> {
    return {
      ItemCategoryID: {
        label: '',
        defaultValue: null
      },
      ItemCategoryCode: {
        label: 'Item Category Code',
        defaultValue: 'NEW',
        validators: [Validators.required],
        validationMessages: {
          required: 'Item Category Code is required.'
        }
      },
      ItemCategoryName: {
        label: 'Item Category Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Item Category Name is required.'
        }
      },
      ItemGroupID: {
        label: 'Item Group',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Item Group is required.'
        }
      }
    };
  }
}
