import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { NumberFormat, NumberFormatList, NumberFormatRequest } from './number-format';
import { ModuleMaster_SelectList, ModuleRequest } from '../module-master/module-master';
import { ModuleMasterService } from '../module-master/module-master.service';
import { StaticList, StaticListRequest } from '../../../../shared/models/select-list';
import { SelectListService } from '../../../../shared/services/select-list.service';

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  private endpoint = 'Admin/NumberFormat';

  constructor(
    private apiService: ApiService,
    private moduleService: ModuleMasterService,
    private selectListService: SelectListService
  ) { }

  GetMasterDropdownLists(): Observable<{
    moduleList: ApiListResponse<ModuleMaster_SelectList>;
  }> {
    return forkJoin({
      moduleList: this.moduleService.PopulateList({ PopulateType: 'SelectList' } as ModuleRequest)
    });
  }

  GetStaticList(model: StaticListRequest): Observable<ApiListResponse<StaticList>> {
    return this.selectListService.GetStaticList(model);
  }

  GetDetails(model: NumberFormatRequest): Observable<ApiListResponse<NumberFormatList>> {
    return this.apiService.post<ApiListResponse<NumberFormatList>>(`${this.endpoint}/GetDetails`, model);
  }

  CreateRecord(model: NumberFormat): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  /// Form Config
  getFormConfig(): FormConfigType<NumberFormat> {
    return {
      ModuleCode: {
        label: 'Module',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(40)],
        validationMessages: {
          required: 'Please select an option from the Module List.',
          maxlength: "Module Code cannot be longer than 40 characters."
        }
      },
      FormatFor: {
        label: 'Format For',
        defaultValue: null,
        validators: [Validators.required, Validators.maxLength(50)],
        validationMessages: {
          required: 'Please select an option from the Format For List.',
          maxlength: "Format For cannot be longer than 50 characters."
        }
      },
      StartNumber: {
        label: 'Start Number',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Start Number is Required.'
        }
      },
      WidthOfNumberPart: {
        label: 'Width Of Number Part',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Width of Number Part is Required.'
        }
      },
      PrefillZero: {
        label: 'Prefill Zero',
        defaultValue: false
      },
      PrefixFront: {
        label: 'Prefix Front',
        defaultValue: null,
        validators: [Validators.maxLength(16)],
        validationMessages: {
          maxlength: "Prefix front cannot be longer than 16 characters."
        }
      },
      PrefixRear: {
        label: 'Prefix Rear',
        defaultValue: null,
        validators: [Validators.maxLength(16)],
        validationMessages: {
          maxlength: "Prefix rear cannot be longer than 16 characters."
        }
      },
      Suffix: {
        label: 'Suffix',
        defaultValue: null,
        validators: [Validators.maxLength(16)],
        validationMessages: {
          maxlength: "Suffix cannot be longer than 16 characters."
        }
      },
      EffectiveFromDate: {
        label: 'Effective From Date',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Effective From Date is Required.'
        }
      },
      RestartType: {
        label: 'Restart',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Restart List.'
        }
      }
    }
  }
}