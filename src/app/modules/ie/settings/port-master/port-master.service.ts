import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { PortMaster, PortRequest, Port_Details, Port_IndexFilter, Port_IndexList, Port_SelectList } from './port-master';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Country_SelectList, CountryRequest } from '../../../admin/settings/country-master/country-master';
import { CountryMasterService } from '../../../admin/settings/country-master/country-master.service';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';

@Injectable({
  providedIn: 'root',
})
export class PortMasterService {
  private endpoint = 'IE/PortMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService,
    private countryMasterService: CountryMasterService,
  ) { }

  GetMasterDropdownLists(): Observable<{
    countryList: ApiListResponse<Country_SelectList>;
  }> {
    return forkJoin({
      countryList: this.countryMasterService.PopulateList({ PopulateType: 'SelectList' } as CountryRequest),
    });
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  PopulateList(model: PortRequest): Observable<ApiListResponse<Port_SelectList>> {
    return this.apiService.post<ApiListResponse<Port_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Port_IndexFilter>): Observable<ApiPagedListResponse<Port_IndexList>> {
    return this.apiService.post<ApiPagedListResponse<Port_IndexList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(portID: number): Observable<ApiDataResponse<Port_Details>> {
    return this.apiService.post<ApiDataResponse<Port_Details>>(`${this.endpoint}/GetDetails?PortID=${portID}`, {});
  }

  CreateRecord(model: PortMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: PortMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(portID: number , reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?portID=${portID}&${reasonToUpdate}`, {});
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Port_IndexFilter> {
    return {
      PortCode: '',
      PortName: '',
      PortTypeID: 0,
      CountryName: '',
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
        defaultValue: 'NEW'
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
      CountryID: {
        label: 'Country',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Country is required.'
        }
      }
    }
  }
}
