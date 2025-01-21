import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { DepartmentMaster, DepartmentMasterList } from './department-master';

@Injectable({
  providedIn: 'root',
})
export class DepartmentMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<DepartmentMaster> {
    return {
      DepartmentID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentCode: {
        label: 'Department Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentName: {
        label: 'Department Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Department Name is Required.',
          maxlength: 'Department Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      IsSubDepartment: {
        label: 'IsSubDepartment',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      ShortCode: {
        label: ' ShortCode',
        defaultValue: null,
        validators: [Validators.maxLength(6)],
        validationMessages: {
          maxlength: 'Maximum 6 character allowed.'
        },
        type: 'control'
      },
      DepartmentTypeID: {
        label: 'Department Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Department Type List.',
        },
        type: 'control'
      },
      ParentDepartmentID: {
        label: 'Parent Department',
        defaultValue: null,
        validators: [RequiredIf('IsSubDepartment', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Parent Department Type List.',
        },
        type: 'control'
      },
      IsAllowedForOP: {
        label: 'Is Allowed For OP',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      IsAllowedForIP: {
        label: 'Is Allowed For IP',
        defaultValue: false,
        validators: [],
        validationMessages: {}
      },
      DepartmentLocation: {
        label: 'Location/Room No.',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      NMC_DepartmentCode: {
        label: 'NMC Department',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion

  PopulateList(DepartmentTypeID?: number, PopulateType?: any): Observable<ApiListResponse<DepartmentMasterList>> {
    return this.http.post<ApiListResponse<DepartmentMasterList>>(`${this.apiUrl}Admin/DepartmentMaster/PopulateList?DepartmentTypeID=${DepartmentTypeID}&PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<DepartmentMasterList>> {
    return this.http.post<ApiPagedListResponse<DepartmentMasterList>>(`${this.apiUrl}Admin/DepartmentMaster/PopulateGrid`, tabledata);
  }

  GetDetails(DepartmentID: number): Observable<ApiDataResponse<DepartmentMaster>> {
    return this.http.post<ApiDataResponse<DepartmentMaster>>(`${this.apiUrl}Admin/DepartmentMaster/GetDetails?DepartmentID=${DepartmentID}`, {});
  }

  CreateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Create`, model);
  }

  UpdateRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Edit`, model);
  }

  DeleteRecord(model: DepartmentMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/DepartmentMaster/Delete`, model);
  }
}
