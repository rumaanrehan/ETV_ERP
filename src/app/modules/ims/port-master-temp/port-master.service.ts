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
import { PortMaster, PortMaster_IndexFilter, PortMaster_IndexList, PortMaster_SelectList } from './port-master';

@Injectable({
  providedIn: 'root',
})
export class PortMasterService {
  private endpoint = 'IMS/PortMaster';

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

  PopulateList(populateType: string): Observable<ApiListResponse<PortMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<PortMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${populateType}`, {} );
  }

  PopulateGrid(model: DataTableParams<PortMaster_IndexFilter>): Observable<ApiPagedListResponse<PortMaster_IndexList>> {
    return this.apiService.post<ApiPagedListResponse<PortMaster_IndexList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(PortID: number): Observable<ApiDataResponse<PortMaster>> {
    return this.apiService.post<ApiDataResponse<PortMaster>>(`${this.endpoint}/GetDetails?PortID=${PortID}`, {});
  }

  CreateRecord(model: PortMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PortMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: PortMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<PortMaster_IndexFilter>{
    return {
      PortCode: '',
      PortName: '',
      PortTypeID: '',
      ActiveStatusID: 0,
    }
  }

  getFormConfig(): FormConfigType<PortMaster> {
    return {
      PortID: {
        label: '',
        defaultValue: null
      },
      PortCode: {
        label: 'Port Code',
        defaultValue: 'NEW',
        validators: [Validators.required],
        validationMessages: {
          required: 'Port Code is required.'
        }
      },
      PortName: {
        label: 'Port Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Port Name is required.'
        }
      },
      PortTypeID: {
        label: 'Port Type',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Port Type is required.'
        }        
      },
    };
  }
}
