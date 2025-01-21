import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { RoomTypeMaster, RoomTypeMasterList } from './room-type-master';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient)
  {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<RoomTypeMaster> {
    return {
      RoomTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      RoomTypeCode: {
        label: 'Room Type Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      RoomTypeName: {
        label: 'Room Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Room Type Name is Required.',
          maxlength: 'Room Type Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      RateTypeID: {
        label: 'Rate Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please Select an option from the Rate Type List.'
        },
        type: 'control'
      },
      RoomRate: {
        label: 'Room Rate',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Room Rate is Required.'
        },
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<RoomTypeMasterList>> {
    return this.http.post<ApiListResponse<RoomTypeMasterList>>(`${this.apiUrl}Admin/RoomTypeMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<RoomTypeMasterList>> {
    return this.http.post<ApiPagedListResponse<RoomTypeMasterList>>(`${this.apiUrl}Admin/RoomTypeMaster/PopulateGrid`, tabledata);
  }

  GetDetails(RoomTypeID: number): Observable<ApiDataResponse<RoomTypeMaster>> {
    return this.http.post<ApiDataResponse<RoomTypeMaster>>(`${this.apiUrl}Admin/RoomTypeMaster/GetDetails?RoomTypeID=${RoomTypeID}`, {});
  }

  CreateRecord(model: RoomTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoomTypeMaster/Create`, model);
  }

  UpdateRecord(model: RoomTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoomTypeMaster/Edit`, model);
  }

  DeleteRecord(model: RoomTypeMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/RoomTypeMaster/Delete`, model);
  }
}
