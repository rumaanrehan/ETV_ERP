import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
import { HsnSacMaster, HsnSacMaster_IndexTableFilter, HsnSacMaster_IndexTableList, HsnSacMaster_SelectList } from './hsn-sac-master';

@Injectable({
  providedIn: 'root'
})
export class HsnSacMasterService {
  private endpoint = 'IMS/HSNCodeMaster';

  constructor(
    private apiService: ApiService,
  ) {}

  PopulateList(populateType: string): Observable<ApiListResponse<HsnSacMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<HsnSacMaster_SelectList>>(`${this.endpoint}/PopulateList?PopulateType=${populateType}`, {});
  }
  
  PopulateGrid(model: DataTableParams<HsnSacMaster_IndexTableFilter>): Observable<ApiPagedListResponse<HsnSacMaster_IndexTableList>> {
    console.log(model);
    return this.apiService.post<ApiPagedListResponse<HsnSacMaster_IndexTableList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(HSNCodeID: number): Observable<ApiDataResponse<HsnSacMaster>> {
    return this.apiService.post<ApiDataResponse<HsnSacMaster>>(`${this.endpoint}/GetDetails?hsnCodeID=${HSNCodeID}`, {});
  }

  CreateRecord(model: HsnSacMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: HsnSacMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Update`, model);
  }

  DeleteReactivate(hsnCodeID: number, reasonToUpdate: string): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete?hsnCodeID=${hsnCodeID}&reasonToUpdate=${reasonToUpdate}`, {});
  }
  
  //#region Form Configuration
  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<HsnSacMaster_IndexTableFilter> {
    return {
      HSNCode: '',
      HSNCodeDescription: '',
      IsServiceAccountCodeID: 0,
      TaxSlabID: 0,
      ActiveStatusID: 0
    }
  }

  getFormConfig(): FormConfigType<HsnSacMaster> {
    return {
      HSNCodeID: {
        label: 'HSN Code ID',
        defaultValue: null
      },
      HSNCode: {
        label: 'HSN Code',
        defaultValue: 'NEW'
      },
      IsServiceAccountCode: {
        label: 'Is Service Account Code',
        defaultValue: null,
      },
      HSNCodeDescription: {
        label: 'Description',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Description is Required'
        }
      },
      SectionName: {
        label: 'Section Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Section Name is Required'
        }
      },
      ChapterName: {
        label: 'Chapter Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Chapter Name is Required'
        }
      },
      HeadingName: {
        label: 'Heading Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Heading Name is Required'
        }
      },
      TaxSlabID: {
        label: 'Tax Slab Name',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {}
      },
    };
  }
  //#endregion
}
