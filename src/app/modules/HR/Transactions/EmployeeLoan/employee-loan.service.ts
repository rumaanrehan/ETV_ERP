import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { EmployeeLoan, EmployeeLoanList } from './employee-loan';

@Injectable({
  providedIn: 'root',
})
export class EmployeeLoanService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<EmployeeLoan> {
    return {
      EmployeeLoanID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },

      EmployeeLoanNo: {
        label: 'Loan No.',
        defaultValue: null,
        validationMessages: {}
      },

      dtEmployeeLoanDate: {
        label: 'Date',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },

      /* Employee Details */
      EmployeeID: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },

      EmployeeCode: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {}
      },

      EmployeeName: {
        label: 'Employee',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Employee Name is Required.',
          maxlength: 'Employee Name cannot be longer than 50 characters.'
        },
        type: 'control'
      },

      MobileNo: {
        label: 'Mobile No',
        defaultValue: null,
        validationMessages: {}
      },

      EmployeeTypeName: {
        label: 'Employee Type',
        defaultValue: null,
        validationMessages: {}
      },

      DepartmentName: {
        label: 'Department',
        defaultValue: null,
        validationMessages: {}
      },

      DesignationName: {
        label: 'Designation',
        defaultValue: null,
        validationMessages: {}
      },

      LoanTypeName: {
        label: 'Loan Type',
        defaultValue: null,
        validationMessages: {}
      },

      LoanTypeID: {
        label: 'Loan Type',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Loan Type Name is Required.',
        },
        type: 'control'
      },

      LoanAmount: {
        label: 'Loan Amount',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
        validationMessages: {
          required: 'Loan amount is required.',
          pattern: 'Please enter a valid loan amount.'
        },
        type: 'control'
      },

      LoanPeriod: {
        label: 'Loan Period',
        defaultValue: null,
        validators: [Validators.required, Validators.pattern(/^[0-9]+$/)],
        validationMessages: {
          required: 'Loan period is required.',
          pattern: 'Please enter a valid number of months.'
        },
        type: 'control'
      },

      InterestRate: {
        label: 'Interest Rate',
        defaultValue: null,
        validationMessages: {}
      },

      InterestAmount: {
        label: 'Interest Amount',
        defaultValue: null,
        validationMessages: {}
      },

      InstalmentAmount: {
        label: 'Instalment Amount',
        defaultValue: null,
        validationMessages: {}
      },

      InstalmentStartDate: {
        label: 'Instalment Start Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Instalment start date is required.',
        },
        type: 'control'
      },

      RepaymentMode: {
        label: 'Repayment Mode',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Repayment mode is required.',
        },
        type: 'control'
      },

      StatusID: {
        label: 'Status ID',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Status ID is required.',
        },
        type: 'control'
      },

      Narration: {
        label: 'Narration',
        defaultValue: null,
        validationMessages: {}
      },

      SearchBy: {
        label: 'Search By',
        defaultValue: 1,
        validationMessages: {}
      },

    };
  }
  //#endregion

  PopulateList(searchBy: any, searchValue: any): Observable<ApiListResponse<EmployeeLoanList>> {
    return this.http.post<ApiListResponse<EmployeeLoanList>>(`${this.apiUrl}HR/EmployeeLoan/AutoComplete?searchBy=${searchBy}&searchValue=${searchValue}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<EmployeeLoanList>> {
    return this.http.post<ApiPagedListResponse<EmployeeLoanList>>(`${this.apiUrl}HR/EmployeeLoan/PopulateGrid`, tabledata);
  }

  GetDetails(EmployeeLoanID: number): Observable<ApiDataResponse<EmployeeLoan>> {
    return this.http.post<ApiDataResponse<EmployeeLoan>>(`${this.apiUrl}HR/EmployeeLoan/GetDetails?EmployeeLoanID=${EmployeeLoanID}`, {});
  }

  CreateRecord(model: EmployeeLoan): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/EmployeeLoan/Create`, model);
  }

  UpdateRecord(model: EmployeeLoan): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/EmployeeLoan/Edit`, model);
  }

  DeleteRecord(model: EmployeeLoan): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}HR/EmployeeLoan/Cancel`, model);
  }
}
