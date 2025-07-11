import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataTableParams } from '../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../shared/validators/not-only-whitespace.validator';
import { StoreMaster_SelectList, StoreMaster_IndexTableFilter, StoreMaster_IndexTableList, StoreMaster } from './store-master';

@Injectable({
  providedIn: 'root'
})
export class StoreMasterService {
  private endpoint = 'IMS/StoreMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(populateType: any): Observable<ApiListResponse<StoreMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<StoreMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }

  PopulateGrid(model: DataTableParams<StoreMaster_IndexTableFilter>): Observable<ApiPagedListResponse<StoreMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<StoreMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(StoreID: number): Observable<ApiDataResponse<StoreMaster>> {
    return this.apiService.post<ApiDataResponse<StoreMaster>>(`${this.endpoint}/GetDetails?StoreID=${StoreID}`, {});
  }

  CreateRecord(model: StoreMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: StoreMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: StoreMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<StoreMaster_IndexTableFilter> {
    return {
      StoreCode: '',
      StoreName: '',
      ActiveStatusID: 1
    }
  }

  getFormConfig(): FormConfigType<StoreMaster> {
    return {
      StoreID: {
        label: '',
        defaultValue: null
      },
      StoreCode: {
        label: 'StoreCode',
        defaultValue: 'New',
        validators: [],
        validationMessages: {}
      },
      StoreName: {
        label: 'Store Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Store Name is Required.',
          maxlength: 'Store Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      CanIssueToStores: {
        label: 'Can Issue To Stores',
        defaultValue: false,
      },
      CanIssueToPatients: {
        label: 'Can Issue To Patients',
        defaultValue: false,
      },
      CanRaiseIndent: {
        label: 'Can Raise Indent',
        defaultValue: false,
      },
      InwardAcceptType: {
        label: 'Accept Inward Stock',
        defaultValue: 1 ,
        // validators: [Validators.required],
        // validationMessages: {
        //   required: 'Please select an option from the In Ward Accept Type.',
        // },
        // type: 'control'
      },
      CanUpdate: {
        label: '',
        defaultValue: true,
      },
    };
  }
}
