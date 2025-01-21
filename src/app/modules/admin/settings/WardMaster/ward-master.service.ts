import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { WardMaster, WardMaster_AddWardBed, WardMaster_WardBedDetails, WardMaster_WardBedDetailsList, WardMaster_WardBedUnitMapping, WardMaster_WardBedUnitMappingList, WardMasterList } from './ward-master';

@Injectable({
  providedIn: 'root'
})
export class WardMasterService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  getFormConfig(): FormConfigType<WardMaster> {
    return {
      WardID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      WardCode: {
        label: 'Ward Code',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      WardName: {
        label: 'Ward Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Ward Name is Required.',
          maxlength: 'Ward Name cannot exceed 50 characters.'
        },
        type: 'control'
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
        validators: [Validators.maxLength(5), NotOnlyWhitespaceValidator()],
        validationMessages: {
          maxlength: 'Maximum 5 character Allowed in Short Code.'
        },
        type: 'control'
      },
      FloorNo: {
        label: 'Floor No',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      BlockName: {
        label: 'Block Name',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      RoomTypeID: {
        label: 'Room Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Room Type List.'
        },
        type: 'control'
      },
      WardType: {
        label: 'Ward Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Ward Type List.'
        },
        type: 'control'
      },
      AllowedForGender: {
        label: 'Allowed For',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Gender is Required.'
        },
        type: 'control'
      },
      TotalBeds: {
        label: 'TotalBeds',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Total Beds is Required.'
        },
        type: 'control'
      },
      EffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.',
        },
        type: 'control'
      },
      TermEndDate: {
        label: 'Term End Date',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      }
    }
  }

  getFormAddBedConfig(): FormConfigType<WardMaster_AddWardBed> {
    return {
      WardBed_WardID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      WardBed_TotalBeds: {
        label: 'Total Beds',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Total Beds is Required.'
        },
        type: 'control'
      },
      WardBed_EffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.'
        },
        type: 'control'
      },
    }
  }

  getFormBedDetailsConfig(): FormConfigType<WardMaster_WardBedDetails> {
    return {
      WardID: {
        label: 'Ward',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      StatusID: {
        label: 'Status',
        defaultValue: 1,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      WardMapping: {
        type: 'array',
        items: {
          WardBedID: {
            label: 'Ward',
            defaultValue: null,
            validators: [],
            validationMessages: {},
            type: 'control'
          },
          BedNo: {
            label: 'Bed No',
            defaultValue: null,
            type: 'control'
          },
          IsIncludedInBOR: {
            label: 'BOR',
            defaultValue: false,
            type: 'control'
          },
          EffectiveFromDate: {
            label: 'Effective From Date',
            defaultValue: null,
            type: 'control'
          },
          TermEndDate: {
            label: 'Term End Date',
            defaultValue: null,
            type: 'control'
          }
        }
      }
    }
  }

  getFormBedUnitMappingDetailsConfig(): FormConfigType<WardMaster_WardBedUnitMapping> {
    return {
      WardID: {
        label: 'Ward',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Ward List.'
        },
        type: 'control'
      },
      DepartmentID: {
        label: 'Department',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Department List.'
        },
        type: 'control'
      },
      ConsultantUnitID: {
        label: 'Consultant Unit',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Unit List.'
        },
        type: 'control'
      },
      FromBedNo: {
        label: 'From Bed No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'From Bed No is Required.'
        },
        type: 'control'
      },
      ToBedNo: {
        label: 'To Bed No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'To Bed No is Required.'
        },
        type: 'control'
      },
      EffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.'
        },
        type: 'control'
      },
      TermEndDate: {
        label: 'Term End Date',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ViewBy: {
        label: 'View By',
        defaultValue: 1,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      StatusID: { 
        label: 'Status ID',
        defaultValue: 1,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      KeepOpenWardBedUnitMappingModal: { 
        label: 'Keep the window open on from submit ?',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      WardBedUnitMapping: {
        type: 'array',
        items: {
          DepartmentName: {
            label: 'Department',
            defaultValue: null,
            validators: [],
            type: 'control'
          },
          ConsultantUnitName: {
            label: 'Unit',
            defaultValue: null,
            type: 'control'
          },
          WardName: {
            label: 'Ward',
            defaultValue: null,
            type: 'control'
          },
          EffectiveFromDate: {
            label: 'Effective From Date',
            defaultValue: null,
            type: 'control'
          },
          TermEndDate: {
            label: 'Term End Date',
            defaultValue: null,
            type: 'control'
          },
          TotalBeds: {
            label: 'Total Beds',
            defaultValue: null,
            type: 'control'
          },
          BedNo: {
            label: 'Bed No',
            defaultValue: null,
            type: 'control'
          }
        }
      }
    }
  }

  PopulateList(PopulateType: any): Observable<ApiListResponse<WardMasterList>> {
    return this.http.post<ApiListResponse<WardMasterList>>(`${this.apiUrl}Admin/WardMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<WardMasterList>> {
    return this.http.post<ApiPagedListResponse<WardMasterList>>(`${this.apiUrl}Admin/WardMaster/PopulateGrid`, tabledata);
  }

  WardMaster_WardBedGetDetailsAsync(WardID: number, StatusID: number): Observable<ApiListResponse<WardMaster_WardBedDetailsList>> {
    return this.http.post<ApiListResponse<WardMaster_WardBedDetailsList>>(`${this.apiUrl}Admin/WardMaster/WardMaster_WardBedGetDetails?WardID=${WardID}&StatusID=${StatusID}`, {});
  }

  WardBedUnitMappingGetDetailsAsync(ViewBy?: number, DepartmentID?: number, ConsultantUnitID?: number, WardID?: number, StatusID?: number): Observable<ApiPagedListResponse<WardMaster_WardBedUnitMappingList>> {
    const model = { ViewBy, DepartmentID, ConsultantUnitID, WardID, StatusID }
    return this.http.post<ApiPagedListResponse<WardMaster_WardBedUnitMappingList>>(`${this.apiUrl}Admin/WardMaster/WardMaster_WardBedUnitMappingGetDetails`, model);
  }

  GetDetails(WardID: number): Observable<ApiDataResponse<WardMaster>> {
    return this.http.post<ApiDataResponse<WardMaster>>(`${this.apiUrl}Admin/WardMaster/GetDetails?WardID=${WardID}`, {});
  }

  CreateRecord(model: WardMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/Create`, model);
  }

  AddWardBedCreateRecordAsync(model: WardMaster_AddWardBed): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/AddWardBedCreate`, model);
  }

  UpdateRecord(model: WardMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/Edit`, model);
  }

  WardMaster_WardBedGetDetailsUpdateRecordAsync(model: WardMaster_WardBedDetails): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/WardMaster_WardBedGetDetailsEdit`, model);
  }

  WardBedUnitMapping_UpdateRecord(model: WardMaster_WardBedUnitMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/WardMaster_WardBedUnitMappingEdit`, model);
  }

  DeleteRecord(model: WardMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/WardMaster/Delete`, model);
  }

}
