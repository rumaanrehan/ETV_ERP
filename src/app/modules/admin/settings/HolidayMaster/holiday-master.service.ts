import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Holiday_IndexTableFilter, Holiday_IndexTableList, Holiday_SelectList, HolidayMaster, HolidayRequest } from './holiday-master';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayMasterService {
  private endpoint = 'Admin/HolidayMaster';

  constructor(
    private apiService: ApiService,
    private selectListService: SelectListService
  ) { }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);

  }

  PopulateList(model: HolidayRequest): Observable<ApiListResponse<Holiday_SelectList>> {

    return this.apiService.post<ApiListResponse<Holiday_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<Holiday_IndexTableFilter>): Observable<ApiPagedListResponse<Holiday_IndexTableList>> {
    return this.apiService.post<ApiPagedListResponse<Holiday_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(holidayID: number): Observable<ApiDataResponse<HolidayMaster>> {
    return this.apiService.post<ApiDataResponse<HolidayMaster>>(`${this.endpoint}/GetDetails?HolidayID=${holidayID}`, {});
  }

  CreateRecord(model: HolidayMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: HolidayMaster): Observable<ApiResponse> {

    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(holidayID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?holidayID=${holidayID}&reasonToUpdate=${reasonToUpdate}`, {});
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<Holiday_IndexTableFilter> {
    return {
      HolidayCode: '',
      HolidayName: '',
      HolidayYear: 0,
      HolidayTypeID: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<HolidayMaster> {
    return {
      HolidayID: {
        label: '',
        defaultValue: null
      },
      HolidayCode: {
        label: 'Holiday Code',
        defaultValue: 'NEW'
      },
      HolidayName: {
        label: 'Holiday Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(100)],
        validationMessages: {
          required: 'Holiday Name is Required.',
          maxlength: 'Holiday Name cannot be longer than 100 characters.'
        }
      },
      HolidayTypeID: {
        label: 'Holiday Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Type is required'
        }
      },
      HolidayDate: {
        label: 'Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Date is Required.'
        }
      },
      HolidayDescription: {
        label: 'Description',
        defaultValue: null,
        validators: [NotOnlyWhitespaceValidator(), Validators.maxLength(150)],
        validationMessages: {
          maxlength: 'Holiday Name cannot be longer than 150 characters.'
        }
      }
    }
  }
}
