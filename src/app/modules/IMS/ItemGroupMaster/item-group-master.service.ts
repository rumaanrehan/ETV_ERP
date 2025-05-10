import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { ItemGroupMaster, ItemGroupMaster_IndexTableFilter, ItemGroupMaster_IndexTableList, ItemGroupMaster_SelectList } from './item-group-master';
import { ItemTypeMaster_SelectList } from '../ItemTypeMaster/item-type-master';
import { ItemTypeMasterService } from '../ItemTypeMaster/item-type-master.service';

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
    itemTypeList: ApiListResponse<ItemTypeMaster_SelectList>;
    }> {
    return forkJoin({
      itemTypeList: this.itemTypeMasterService.PopulateList()
    });
  }

  PopulateList(populateType: string): Observable<ApiListResponse<ItemGroupMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemGroupMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${populateType}`, {} );
  }

  PopulateGrid(model: DataTableParams<ItemGroupMaster_IndexTableFilter>): Observable<ApiPagedListResponse<ItemGroupMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<ItemGroupMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
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
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<ItemGroupMaster_IndexTableFilter> {
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
