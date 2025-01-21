import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
import { PlanMaster, PlanMaster_BillTypeMappingList, PlanMaster_IndexTableFilter, PlanMaster_IndexTableList, PlanMaster_SelectList } from './plan-master';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';

@Injectable({
  providedIn: 'root',
})
export class PlanMasterService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }
  
  PopulateList(PopulateType: any): Observable<ApiListResponse<PlanMaster_SelectList>> {
    return this.http.post<ApiListResponse<PlanMaster_SelectList>>(`${this.apiUrl}Admin/PlanMaster/PopulateList?PopulateType=${PopulateType}`, {});
  }

  PopulateGrid(model: DataTableParams<PlanMaster_IndexTableFilter>): Observable<ApiPagedListResponse<PlanMaster_IndexTableList>> {
    return this.http.post<ApiPagedListResponse<PlanMaster_IndexTableList>>(`${this.apiUrl}Admin/PlanMaster/PopulateGrid`, model);
  }

  GetDetails(PlanID: number): Observable<ApiDataResponse<PlanMaster>> {
    return this.http.post<ApiDataResponse<PlanMaster>>(`${this.apiUrl}Admin/PlanMaster/GetDetails?PlanID=${PlanID}`, {});
  }

  GetDetailsBillTypeMapping(PlanID: number | null): Observable<ApiListResponse<PlanMaster_BillTypeMappingList>> {
    return this.http.post<ApiListResponse<PlanMaster_BillTypeMappingList>>(`${this.apiUrl}Admin/PlanMaster/GetDetailsBillTypeMapping${PlanID != null ? `?PlanID=${PlanID}` : ''}`, {});
  }

  CreateRecord(model: PlanMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PlanMaster/Create`, model);
  }

  UpdateRecord(model: PlanMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PlanMaster/Edit`, model);
  }

  DeleteRecord(model: PlanMaster): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}Admin/PlanMaster/Delete`, model);
  }

  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<PlanMaster_IndexTableFilter>{
    return {
      PlanCode: '',
      PlanName: '',
      BillCompanyID: 0,
      PlanTypeID: 0,
      ActiveStatusID: 1,
    }
  }

  getFormConfig(): FormConfigType<PlanMaster> {
    return {
      PlanID: {
        label: '',
        defaultValue: null,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PlanCode: {
        label: 'Plan Code',
        defaultValue: 'New',
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      PlanName: {
        label: 'Plan Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)],
        validationMessages: {
          required: 'Plan Name is Required.',
          maxlength: 'Plan Name cannot be longer than 50 characters.',
        },
        type: 'control'
      },
      PlanTypeID: {
        label: 'Plan Type',
        defaultValue: 1,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Plan Type List.',
        },
        type: 'control'
      },
      BillCompanyID: {
        label: 'Bill Company',
        defaultValue: null,
        validators: [RequiredIf('PlanTypeID', Operator.EqualTo, '3')],
        validationMessages: {
          requiredIf: 'Please select an option from the Bill Company List.',
        },
        type: 'control'
      },
      IsCopyRate: {
        label: '',
        defaultValue: false,
        validators: [],
        validationMessages: {},
        type: 'control'
      },
      CopyRateID: {
        label: 'Copy Rate',
        defaultValue: null,
        disabled: true,
        validators: [RequiredIf('IsCopyRate', Operator.EqualTo, true)],
        validationMessages: {
          requiredIf: 'Please select an option from the Copy Rate List.'
        },
        type: 'control'
      },
      IsAllowedForOP: {
        label: 'OP Registration',
        defaultValue: false,
        type: 'control'
      },
      IsAllowedForIP: {
        label: 'IP Registration',
        defaultValue: false,
        type: 'control'
      },
      IsPreAuthorizationRequired: {
        label: 'Is Pre Authorization Required',
        defaultValue: false,
        type: 'control'
      },
      IsPharmacyIndentApprovalRequired: {
        label: 'Is Pharmacy Indent Approval Required',
        defaultValue: false,
        type: 'control'
      },
      IsAllowedPHCreditAdjustmentInIPB: {
        label: 'IP Bill',
        defaultValue: false,
        type: 'control'
      },
      IsAllowedPHCreditAdjustmentInOPB: {
        label: 'OP Bill',
        defaultValue: false,
        type: 'control'
      },
      IsDefault: {
        label: 'Is Default Plan',
        defaultValue: false,
        type: 'control'
      },
      BillTypeMapping: {
        type: 'array',
        items: {
          BillingSection: {
            label: 'Billing Section',
            defaultValue: null,
            validators: [],
            validationMessages: {},
            type: 'control'
          },
          BillingSectionText: {
            label: 'Billing Section Text',
            defaultValue: null,
            validators: [],
            validationMessages: {},
            type: 'control'
          },
          DefaultBillType: {
            label: 'Default Bill Type',
            defaultValue: 1,
            validators: [Validators.required],
            validationMessages: {
              required: 'Please select an option from the Default Bill Type List.',
            },
            type: 'control'
          },
          IsAllowedCreditBillForOP: {
            label: 'Credit Bill',
            defaultValue: false,
            type: 'control'
          },
          IsAllowedFreeBillForOP: {
            label: 'Free Bill',
            defaultValue: false,
            type: 'control'
          },
          OP_BillingAllowed_Days: {
            label: 'Billing Allowed',
            defaultValue: 0,
            validators: [Validators.required, NotOnlyWhitespaceValidator()],
            validationMessages: {
              required: 'OP Billing Allowed Days is Required.',
            },
            type: 'control'
          },
          OP_ReturnAllowed_BasedOn: {
            label: 'Return Allowed',
            defaultValue: 1,
            validators: [Validators.required],
            validationMessages: {
              required: 'Please select an option from the OP Return Allowed Based On List.',
            },
            type: 'control'
          },
          OP_ReturnAllowed_BasedOn_Days: {
            label: '',
            defaultValue: 0,
            validators: [Validators.required, NotOnlyWhitespaceValidator()],
            validationMessages: {
              required: 'OP Return Allowed Days is Required.',
            },
            type: 'control'
          },
          IsAllowedCreditBillForIP: {
            label: 'Credit Bill',
            defaultValue: false,
            type: 'control'
          },
          IsAllowedFreeBillForIP: {
            label: 'Free Bill',
            defaultValue: true,
            type: 'control'
          },
          IP_BillingAllowed_BasedOn: {
            label: 'Billing Allowed',
            defaultValue: 1,
            validators: [Validators.required],
            validationMessages: {
              required: 'Please select an option from the IP Billing Allowed Based On List.',
            },
            type: 'control'
          },
          IP_BillingAllowed_BasedOn_Days: {
            label: 'Days',
            defaultValue: null,
            validators: [RequiredIf('IP_BillingAllowed_BasedOn', Operator.GreaterThan, 2)],
            validationMessages: {
              requiredIf: 'IP Billing Allowed Days is Required.'
            },
            type: 'control'
          },
          IP_ReturnAllowed_BasedOn: {
            label: 'Return Allowed',
            defaultValue: 2,
            validators: [Validators.required],
            validationMessages: {
              required: 'Please select an option from the IP Return Allowed Based On List.',
            },
            type: 'control'
          },
          IP_ReturnAllowed_BasedOn_Days: {
            label: 'Days',
            defaultValue: null,
            validators: [RequiredIf('IP_ReturnAllowed_BasedOn', Operator.GreaterThan, 2), NotOnlyWhitespaceValidator()],
            validationMessages: {
              requiredIf: 'IP Return Allowed Days is Required.',
            },
            type: 'control'
          },
        }
      }
    };
  }
  //#endregion
}
