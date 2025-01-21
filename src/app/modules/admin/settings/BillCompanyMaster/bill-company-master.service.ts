import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { BillCompanyMaster, BillCompanyMasterList } from './bill-company-master';

@Injectable({
  providedIn: 'root',
})
export class BillCompanyMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<BillCompanyMaster> {
    return {
      BillCompanyID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      BillCompanyCode: {
        label: 'Bill Company Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      BillCompanyName: {
        label: 'Bill Company Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Bill Company Name is Required.',
          maxlength: 'Bill Company Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },
      BillCompanyAddress: {
        label: 'Address',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      BillCompanyCity: {
        label: 'City',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      BillCompanyStateID: {
        label: 'State',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      BillCompanyCountryID: {
        label: 'Country',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      BillCompanyPinCode: {
        label: 'Pincode',
        defaultValue: null,
        validators: [Validators.pattern('^[0-9]{6}$')],
        validationMessages: {
          pattern: 'Pincode is not correct.'
        },
        type: 'control'
      },
      BillCompanyPhoneNo: {
        label: 'Phone No.',
        defaultValue: null,
        validators: [Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          pattern: 'Phone No. is not correct.'
        },
        type: 'control'
      },
      BillCompanyFaxNo: {
        label: 'Fax No.',
        defaultValue: null,
        validators: [Validators.pattern('^[0-9]{10,14}$')],
        validationMessages: {
          pattern: 'Fax number is not correct.'
        },
        type: 'control'
      },
      BillCompanyEmailID: {
        label: 'Email ID',
        defaultValue: null,
        validators: [Validators.email],
        validationMessages: {
          email: 'Please enter correct email address.'
        },
        type: 'control'
      },
      BillCompanyGSTIN: {
        label: 'GSTIN',
        defaultValue: null,
        validators: [Validators.minLength(15), Validators.maxLength(15), Validators.pattern('^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[a-zA-Z]{1}[0-9a-zA-Z]{1}$')],
        validationMessages: {
          minlength: 'GSTIN must be 15 characters.',
          maxlength: 'GSTIN must be 15 characters.',
          pattern: 'GSTIN is not valid.'
        },
        type: 'control'
      },
      BillCompanyPAN: {
        label: 'PAN',
        defaultValue: null,
        validators: [Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$')],
        validationMessages: {
          pattern: 'PAN is not valid.'
        },
        type: 'control'
      },
      BillCompanyTAN: {
        label: 'TAN',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      HospitalID: {
        label: 'Hospital ID',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
    };
  }
  //#endregion

  PopulateList(PopulateType: any): Observable<ApiListResponse<BillCompanyMasterList>> {
    return this.http.post<ApiListResponse<BillCompanyMasterList>>(`${this.apiUrl}Admin/BillCompanyMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<BillCompanyMasterList>> {
    return this.http.post<ApiPagedListResponse<BillCompanyMasterList>>(`${this.apiUrl}Admin/BillCompanyMaster/PopulateGrid`, tabledata);
  }

  GetDetails(BillCompanyID: number): Observable<ApiDataResponse<BillCompanyMaster>> {
    return this.http.post<ApiDataResponse<BillCompanyMaster>>(`${this.apiUrl}Admin/BillCompanyMaster/GetDetails?BillCompanyID=${BillCompanyID}`, {});
  }

  CreateRecord(model: BillCompanyMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/BillCompanyMaster/Create`, model);
  }

  UpdateRecord(model: BillCompanyMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/BillCompanyMaster/Edit`, model);
  }

  DeleteRecord(model: BillCompanyMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/BillCompanyMaster/Delete`, model);
  }  
}
