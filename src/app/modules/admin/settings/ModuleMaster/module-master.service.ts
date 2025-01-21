import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { ModuleMaster, ModuleMasterList } from './module-master';

@Injectable({
  providedIn: 'root',
})
export class ModuleMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ModuleMaster> {
    return {
      ModuleID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      ModuleCode: {
        label: 'Code',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(10)],
        validationMessages: {
          required: 'Module Area Code is Required.',
          maxlength: 'Module Area Code be longer than 10 characters.',
        },
        type: 'control'
      },
      ModuleName: {
        label: 'Module Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Module Name is Required.',
          maxlength: 'Module Name cannot be longer than 50 characters.',
        },
        type: 'control'
      },
      ImagePath: {
        label: 'Image Path',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(100)],
        validationMessages: {
          required: 'Image Path is Required.',
          maxlength: 'Image Path be longer than 100 characters.',
        },
        type: 'control'
      },
      DisplayOrder: {
        label: 'Display Order',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<ModuleMasterList>> {
    return this.http.post<ApiListResponse<ModuleMasterList>>(`${this.apiUrl}Admin/ModuleMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<ModuleMasterList>> {
    return this.http.post<ApiPagedListResponse<ModuleMasterList>>(`${this.apiUrl}Admin/ModuleMaster/PopulateGrid`, tabledata);
  }

  GetDetails(ModuleID: number): Observable<ApiDataResponse<ModuleMaster>> {
    return this.http.post<ApiDataResponse<ModuleMaster>>(`${this.apiUrl}Admin/ModuleMaster/GetDetails?ModuleID=${ModuleID}`, {});
  }

  CreateRecord(model: ModuleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ModuleMaster/Create`, model);
  }

  UpdateRecord(model: ModuleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ModuleMaster/Edit`, model);
  }

  DeleteRecord(model: ModuleMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/ModuleMaster/Delete`, model);
  }
}
