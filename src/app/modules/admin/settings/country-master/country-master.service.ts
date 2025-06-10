import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { CountryMaster, CountryMaster_IndexTableFilter, CountryMaster_IndexTableList, CountryMaster_SelectList } from './country-master';


@Injectable({
  providedIn: 'root',
})
export class CountryMasterService {
  private endpoint = 'Admin/CountryMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(populateType: string): Observable<ApiListResponse<CountryMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<CountryMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }

  PopulateGrid(model: DataTableParams<CountryMaster_IndexTableFilter>): Observable<ApiPagedListResponse<CountryMaster_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<CountryMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(countryID: number): Observable<ApiDataResponse<CountryMaster>> {
    return this.apiService.post<ApiDataResponse<CountryMaster>>(`${this.endpoint}/GetDetails?CountryID=${countryID}`, {});
  }

  CreateRecord(model: CountryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: CountryMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: CountryMaster): Observable<ApiResponse> {
    console.log("I'm here in Country", model);
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }
  
  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<CountryMaster_IndexTableFilter> {
    return {
      CountryCode: '',
      CountryName: '',
      ActiveStatusID: 0
    }
  }
  
  getFormConfig(): FormConfigType<CountryMaster> {
    return {
      CountryID: {
        label: '',
        defaultValue: null,
      },
      CountryCode: {
        label: 'Country Code',
        defaultValue: 'NEW'
      },
      CountryName: {
        label: 'Country Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Country Name is Required'
        }
      },
      
      CountryISOCode: {
        label: 'Country ISO Code',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Country ISO Code is Required'
        }
      },
      IsDefault: {
        label: 'Is Default Country',
        defaultValue: false,
      }
    };
  }
  //#endregion
}