import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { rptEmployeeRegister, rptEmployeeRegisterDetails } from './rpt-employee-register';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root',
})
export class rptEmployeeRegisterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<rptEmployeeRegister> {
    return {
      EmployeeTypeID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DepartmentID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      DesignationID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      StatusID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      JoiningMonthID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      FromDate: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      ToDate: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },

      GroupBy: {
        label: 'GroupBy',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
     
      DateRange_SearchBy: {
        label: 'Date Range',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion
  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<rptEmployeeRegisterDetails>> {
    return this.http.post<ApiPagedListResponse<rptEmployeeRegisterDetails>>(`${this.apiUrl}HR/rptEmployeeRegister/PopulateGrid`, tabledata);
  }

  
}
