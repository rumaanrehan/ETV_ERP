import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemCategory_SelectList } from '../item-category-master/item-category-master';
import { ItemCategoryMasterService } from '../item-category-master/item-category-master.service';
import { ItemMaster, ItemMaster_IndexTableFilter, ItemMaster_IndexTableList, ItemMaster_SelectList } from './item-master';

@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {
  private endpoint = 'IMS/ItemMaster';

  constructor(
    private apiService: ApiService,
    private itemCategoryMasterService: ItemCategoryMasterService,
  ) {}

  GetMasterDropdownLists(): Observable<{ 
    itemCategoryMasterList: ApiListResponse<ItemCategory_SelectList>;
    }> {
    return forkJoin({
      itemCategoryMasterList: this.itemCategoryMasterService.PopulateList("SelectList"),
    });
  }

  PopulateList(populateType: any): Observable<ApiListResponse<ItemMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${populateType}`, {} );
  }

  PopulateGrid(model: DataTableParams<ItemMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ItemMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ItemMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(itemID: number): Observable<ApiDataResponse<ItemMaster>> {
    return this.apiService.post<ApiDataResponse<ItemMaster>>(`${this.endpoint}/GetDetails?ItemID=${itemID}`, {});
  }

  CreateRecord(model: ItemMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ItemMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ItemMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemMaster_IndexTableFilter> {
    return {
      ItemCode: '',
      ItemName: '',
      ItemCategoryName: '',
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<ItemMaster> {
    return {
      ItemID: {
        label: '',
        defaultValue: null,
      },
      ItemCode: {
        label: 'Generic/Item Code',
        defaultValue: 'NEW'
      },
      ItemName: {
        label: 'Generic/Item Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Generic/Item Name is required'
        }
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
