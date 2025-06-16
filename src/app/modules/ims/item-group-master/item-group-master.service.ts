import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemType_SelectList, ItemTypeRequest } from '../item-type-master/item-type-master';
import { ItemGroup_IndexTableFilter, ItemGroup_IndexTableList, ItemGroup_SelectList, ItemGroupMaster, ItemGroupRequest } from './item-group-master';
import { ItemTypeMasterService } from './../item-type-master/item-type-master.service';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupMasterService {
  private endpoint = 'IMS/ItemGroupMaster';

  constructor(
    private apiService: ApiService,
    private itemTypeMasterService: ItemTypeMasterService,
  ) {}

  GetMasterDropdownLists(): Observable<{ 
    itemTypeList: ApiListResponse<ItemType_SelectList>;
    }> {
    return forkJoin({
      itemTypeList: this.itemTypeMasterService.PopulateList({PopulateType: 'SelectList'} as ItemTypeRequest),
    });
  }

  PopulateList(model: ItemGroupRequest): Observable<ApiListResponse<ItemGroup_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemGroup_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<ItemGroup_IndexTableFilter>): Observable<ApiPagedListResponse<ItemGroup_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ItemGroup_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(itemGroupID: number): Observable<ApiDataResponse<ItemGroupMaster>> {
    return this.apiService.post<ApiDataResponse<ItemGroupMaster>>(`${this.endpoint}/GetDetails?ItemGroupID=${itemGroupID}`, {});
  }

  CreateRecord(model: ItemGroupMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: ItemGroupMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: ItemGroupMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemGroup_IndexTableFilter> {
    return {
      ItemGroupCode: '',
      ItemGroupName: '',
      ItemTypeID: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<ItemGroupMaster> {
    return {
      ItemGroupID: {
        label: '',
        defaultValue: null,
      },
      ItemGroupCode: {
        label: 'Item Group Code',
        defaultValue: 'NEW'
      },
      ItemGroupName: {
        label: 'Item Group Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Item Group Name is required'
        }
      },
      ItemTypeID:{
        label: 'Item Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Item Type is required'
        }
      }
    }
  }
}
