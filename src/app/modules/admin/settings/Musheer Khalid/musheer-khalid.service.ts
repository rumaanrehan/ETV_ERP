import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiResponse, ApiTResponse, TResultPagedList } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { MusheerKhalid, MusheerKhalidList } from './musheer-khalid';

@Injectable({
  providedIn: 'root',
})
export class MusheerKhalidService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<MusheerKhalid> {
    return {
      HolidayID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      HolidayCode: {
        label: 'Holiday Code',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },
      HolidayName: {
        label: 'Holiday Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Holiday Name is Required.',
          maxlength: 'Holiday Name cannot be longer than 50 characters.'
        }
      },
      HolidayTypeID: {
        label: 'Holiday Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Type is Required.'
        }
      },
      HolidayDate: {
        label: 'Holiday Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Date is Required.'
        }
      },
      HolidayDescriptions: {
        label: 'Description',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Holiday Description is Required.'
        }
      },
      selectedCategory: {
        label: 'Selected Category',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Radio is Required.'
        }
      },
      checkbox: {
        label: 'Checkbox',
        defaultValue: false,
        validators: [Validators.required],
        validationMessages: {
          required: 'Checkbox is Required.'
        }
      },
      Switch: {
        label: 'Switch',
        defaultValue: false,
        validators: [Validators.required],
        validationMessages: {
          required: 'Switch is Required.'
        }
      },
      InputNumber: {
        label: 'Input Number',
        defaultValue: null,
        validators: [RequiredIf('Switch',Operator.LessThan, true)],
        validationMessages: {
          required: 'Input Number is Required.'
        }
      }
    };
  }
  //#endregion

  PopulateGrid(tabledata: any): Observable<ApiTResponse<TResultPagedList<MusheerKhalidList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<MusheerKhalidList>>>(`${this.apiUrl}Admin/HolidayMaster/PopulateGrid`, tabledata);
  }

  PopulateList(PopulateType: any): Observable<ApiTResponse<TResultPagedList<MusheerKhalidList>>> {
    return this.http.post<ApiTResponse<TResultPagedList<MusheerKhalidList>>>(`${this.apiUrl}Admin/HolidayMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  GetDetails(HolidayID: number): Observable<ApiTResponse<MusheerKhalid>> {
    return this.http.post<ApiTResponse<MusheerKhalid>>(`${this.apiUrl}Admin/HolidayMaster/GetDetails?HolidayID=${HolidayID}`, {});
  }

  CreateRecord(model: MusheerKhalid): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Create`, model);
  }

  UpdateRecord(model: MusheerKhalid): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Edit`, model);
  }

  DeleteRecord(model: MusheerKhalid): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/HolidayMaster/Delete`, model);
  }
}
