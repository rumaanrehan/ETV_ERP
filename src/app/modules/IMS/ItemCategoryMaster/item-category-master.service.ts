import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemGroupMaster_SelectList } from '../ItemGroupMaster/item-group-master';
import { ItemGroupMasterService } from '../ItemGroupMaster/item-group-master.service';
import { ItemCategoryMaster, ItemCategoryMaster_IndexFilter, ItemCategoryMaster_IndexList, ItemCategoryMaster_SelectList } from './item-category-master';

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
    itemGroupList: ApiListResponse<ItemGroupMaster_SelectList>;
    }> {
    return forkJoin({
      itemGroupList: this.itemGroupService.PopulateList("SelectList"),
    });
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<ItemCategoryMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemCategoryMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${PopulateType}`, {} );
  }

  PopulateGrid(model: DataTableParams<ItemCategoryMaster_IndexFilter>): Observable<ApiPagedListResponse<ItemCategoryMaster_IndexList>> {
    return this.apiService.post<ApiPagedListResponse<ItemCategoryMaster_IndexList>>(`${this.endpoint}/PopulateGrid`, model);
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

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemCategoryMaster_IndexFilter>{
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
      },
    };
  }
}
