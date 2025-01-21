import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { AddDetailList, TestBooking, TestBooking_BookingDetails, TestBooking_ConsultantList, TestBooking_IndexTableFilter, TestBooking_PatientDetails, TestBookingList } from './test-booking';
import { ConsultantUnitMapping } from '../../../admin/Transactions/ConsultantUnitMapping/consultant-unit-mapping';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { TableDef } from '../../../../shared/components/z-table/z-table';
import { CreateComponent } from './create/create.component';

@Injectable({
  providedIn: 'root',
})
export class TestBookingService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  PopulateList(BookingID:Number | null, ServiceCategoryID:number|null,PopulateType: any): Observable<ApiListResponse<TestBookingList>> {
    return this.http.post<ApiListResponse<TestBookingList>>(`${this.apiUrl}LB/TestBooking/PopulateList?${BookingID ? `ServiceID=${BookingID}&` : ''}${ServiceCategoryID ? `ServiceCategoryID=${ServiceCategoryID}&` : ''}PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<TestBookingList>> {
    return this.http.post<ApiPagedListResponse<TestBookingList>>(`${this.apiUrl}LB/TestBooking/PopulateGrid`, tabledata);
  }

  GetPatient(PopulateType: any, RegistrationNo: any): Observable<ApiListResponse<TestBooking_PatientDetails>> {
    return this.http.post<ApiListResponse<TestBooking_PatientDetails>>(`${this.apiUrl}LB/TestBooking/GetPatientDetails?PopulateType=${PopulateType}&RegistrationNo=${RegistrationNo}`, {});
  }

  GetPatientDetails(PopulateType: any, PID: any, RegistrationNo: any): Observable<ApiListResponse<TestBooking>> {
    return this.http.post<ApiListResponse<TestBooking>>(`${this.apiUrl}LB/TestBooking/GetPatientDetails?PopulateType=${PopulateType}&PID=${PID}&RegistrationNo=${RegistrationNo}`, {});
  }

  GetConsultant(PopulateType: string, ConsultantName: string): Observable<ApiListResponse<TestBooking_ConsultantList>> {
    const model = {  PopulateType, ConsultantName } 
    return this.http.post<ApiListResponse<TestBooking_ConsultantList>>(`${this.apiUrl}LB/TestBooking/GetConsultant`, model);
  }

  GetSettings(model: any): Observable<ApiListResponse<TestBookingList>> {
    return this.http.post<ApiListResponse<TestBookingList>>(`${this.apiUrl}LB/TestBooking/GetSettings`, model);
  }

  GetServiceDetails(model: any): Observable<ApiListResponse<TestBooking_BookingDetails>> {
    return this.http.post<ApiListResponse<TestBooking_BookingDetails>>(`${this.apiUrl}LB/TestBooking/GetServiceDetails`, model);
  }

  GetServiceCharge(RegistrationID: number, ServiceDetailID: any): Observable<ApiDataResponse<TestBooking_BookingDetails>> {
    const model = { RegistrationID, ServiceDetailID }
    return this.http.post<ApiDataResponse<TestBooking_BookingDetails>>(`${this.apiUrl}LB/TestBooking/GetServiceCharges`, model);
  }

  GetDetails(BookingID: number): Observable<ApiDataResponse<TestBooking>> {
    return this.http.post<ApiDataResponse<TestBooking>>(`${this.apiUrl}LB/TestBooking/GetDetails?BookingID=${BookingID}`, {});
  }

  GetAddDetailArray(BookingID: number | null): Observable<ApiListResponse<AddDetailList>> {
    return this.http.post<ApiListResponse<AddDetailList>>(`${this.apiUrl}LB/TestBooking/GetDetailItems?BookingID=${BookingID}`, {});
  }

  CreateRecord(model: TestBooking): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestBooking/Create`, model);
  }

  DeleteRecord(model: TestBooking): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestBooking/Cancel`, model);
  }

  CancelTest(BookingDetailID: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/TestBooking/CancelTest?BookingDetailID=${BookingDetailID}`, {});
  } 

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<TestBooking_IndexTableFilter> {
    return {
      BookingNo: '',
      RegistrationNo: '',
      PatientName: '',
      ActiveStatusID: 1,
    }
  }

  getFormConfig(): FormConfigType<TestBooking> {
    return {
      SearchBy: {
        label: '',
        defaultValue: 1,
        validationMessages: {}
      },
      BookingID: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },
      BookingNo: {
        label: 'Booking No',
        defaultValue: 'NEW',
        validationMessages: {}
      },
      BookingDateTimeMode: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },
      BookingDate: {
        label: 'Booking Date',
        defaultValue: null,
        validationMessages: {}
      },
      BookingTime: {
        label: 'Booking Time',
        defaultValue: null,
        validationMessages: {}
      },
      PID: {
        label: '',
        defaultValue: null,
        validationMessages: {}
      },
      RegistrationID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'RegistrationID is Required.'
        },
        type: 'control'
      },
      RegistrationNo: {
        label: 'Registration No',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Registration No is Required.'
        },
        type: 'control'
      },
      PatientType: {
        label: '',
        defaultValue: null
      },
      PatientName: {
        label: 'Name',
        defaultValue: ''
      },
      AgeSex: {
        label: 'Age/Sex',
        defaultValue: ''
      },
      ConsultantID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'ConsultantID is Required.'
        },
        type: 'control'
      },
      ConsultantName: {
        label: 'Consultant Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Consultant Name is Required.'
        },
        type: 'control'
      },
      RegistrationDateTime: {
        label: 'Registration Date & Time',
        defaultValue: ''
      },
      PlanName: {
        label: 'Plan',
        defaultValue: ''
      },
      PatientLocation: {
        label: 'Location',
        defaultValue: ''
      }
    };
  }

  getServiceFormConfig(): FormConfigType<TestBooking_BookingDetails> {
    return {
      BookingDetailID: {
        label: '',
        defaultValue: null
      },
      ServiceDetailID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'ServiceDetailID is Required.'
        },
        type: 'control'
      },
      ServiceID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'ServiceID is Required.'
        },
        type: 'control'
      },
      ServiceCode: {
        label: 'Code',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Code is Required.'
        },
        type: 'control'
      },
      ServiceName: {
        label: 'Service Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Name is Required.'
        },
        type: 'control'
      },      
      ServiceCategoryName: {
        label: 'Service Category Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Category is Required.'
        },
        type: 'control'
      },
      InPackage: {
        label: 'In Package',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Category is Required.'
        },
        type: 'control'
      },
      PackageID: {
        label: '',
        defaultValue: null,
        validators: [RequiredIf('InPackage', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'PackageID is Required.'
        },
        type: 'control'
      },
      PackageName: {
        label: 'Package',
        defaultValue: null,
        validators: [RequiredIf('InPackage', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Package Name is Required.'
        },
        type: 'control'
      },
      IsServiceRateEditable: {
        label: '',
        defaultValue: false,
        validators: [Validators.required],
        validationMessages: {
          required: 'IsServiceRateEditable is Required.'
        },
        type: 'control'
      },
      ServiceRateID: {
        label: '',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'ServiceRateID is Required.'
        },
        type: 'control'
      },
      ServiceRatePerUnit: {
        label: 'Rate',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Rate is Required.'
        },
        type: 'control'
      },
      ServiceDiscountAmount: {
        label: 'Discount',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Discount Amount is Required.'
        },
        type: 'control'
      },
      ServiceAmount: {
        label: 'Amount',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Service Amount is Required.'
        },
        type: 'control'
      },
      StatusText: {
        label: 'Status',
        defaultValue: null
      }
    };
  }

  getPatientAutoCompleteDef(formConfig: FormConfigType<TestBooking>, form: FormGroup): AutoCompleteDef<TestBooking_PatientDetails> {
    return {
      type: 'formControl',
      group: form,
      control: 'RegistrationNo',
      label: formConfig.RegistrationNo.label,
      validationMessage: formConfig.RegistrationNo.error,
      placeholder: 'Search By UHID/IP Number',
      options: [],
      optionLabel: 'RegistrationNo',
      columns: [
        { data: 'RegistrationNo', label: 'Registration No', width: '150px' },
        { data: 'PatientName', label: 'Patient Name', width: '400px' }
      ]
    }
  }

  getConsultantAutoCompleteDef(formConfig: FormConfigType<TestBooking>, form: FormGroup): AutoCompleteDef<TestBooking_ConsultantList> {
    return {
      type: 'formControl',
      group: form,
      control: 'ConsultantName',
      label: formConfig.ConsultantName.label,
      validationMessage: formConfig.ConsultantName.error,
      placeholder: 'Search By Consultant Name',
      options: [],
      optionLabel: 'ConsultantName',
      columns: [
        { data: 'ConsultantCode', label: 'Code', width: '150px' },
        { data: 'ConsultantName', label: 'Consultant', width: '400px' },
        { data: 'DepartmentName', label: 'Department', width: '400px' }
      ]
    }
  }

  getServiceAutoCompleteDef(selectedService: TestBooking_BookingDetails): AutoCompleteDef<TestBooking_BookingDetails> {
    return {
      type: 'suggestions',
      value: selectedService,
      label: 'Service',
      placeholder: 'Search By Service Name',
      options: [],
      optionLabel: 'ServiceName',
      columns: [
        { data: 'ServiceCode', label: 'Code', width: '100px' },
        { data: 'ServiceName', label: 'ServiceName Name', width: '400px' },
        { data: 'ServiceCategoryName', label: 'Category', width: '400px' },
        { data: 'ServiceAmount', label: 'Amount', width: '100px' }
      ]
    }
  }

  getBookingDetailsTableDef(component: CreateComponent): TableDef<TestBooking_BookingDetails>{
    return {
      data: [],
      columnDef: [
        { data: 'ServiceID', label: '', visible: false },
        { data: 'ServiceCode', label: 'Code' },
        { data: 'ServiceName', label: 'Service Name' },
        { data: 'ServiceCategoryName', label: 'Service Category' },
        { data: 'InPackage', label: 'In-Package', cssClass: 'text-center', customTemplate: component.inPackageTemplate },
        { data: 'ServiceRatePerUnit', label: 'Service Rate ₹', cssClass: 'text-end' },
        { data: 'ServiceDiscountAmount', label: 'Discount ₹', cssClass: 'text-end' },
        { data: 'ServiceAmount', label: 'Amount ₹', cssClass: 'text-end' },
        { data: 'StatusText', label: 'Status', visible: component.isEditMode },
        { data: '', label: '', cssClass: 'text-end', customTemplate: component.actionColTemplate }
      ]
    }
  }

  //#endregion
}
