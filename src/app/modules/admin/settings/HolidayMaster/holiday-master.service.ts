import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { HolidayMaster, HolidayMasterList } from './holiday-master';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class HolidayMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<HolidayMaster> {
    return {
      HolidayID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      HolidayCode: {
        label: 'Holiday Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      HolidayName: {
        label: 'Holiday Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Holiday Name is Required.',
          maxlength: 'Holiday Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      HolidayTypeID: {
        label: 'Holiday Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option  from Holiday Type List.'
        },
        type: 'control'
      },
      HolidayDate: {
        label: 'Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Date is Required.'
        },
        type: 'control'
      },
      HolidayDescriptions: {
        label: 'Descriptions',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<HolidayMasterList>> {
    return this.http.post<ApiListResponse<HolidayMasterList>>(`${this.apiUrl}Admin/HolidayMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<HolidayMasterList>> {
    return this.http.post<ApiPagedListResponse<HolidayMasterList>>(`${this.apiUrl}Admin/HolidayMaster/PopulateGrid`, tabledata);
  }

  GetDetails(HolidayID: number): Observable<ApiDataResponse<HolidayMaster>> {
    return this.http.post<ApiDataResponse<HolidayMaster>>(`${this.apiUrl}Admin/HolidayMaster/GetDetails?HolidayID=${HolidayID}`, {});
  }

  CreateRecord(model: HolidayMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Create`, model);
  }

  UpdateRecord(model: HolidayMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Edit`, model);
  }

  DeleteRecord(model: HolidayMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Delete`, model);
  }
}
