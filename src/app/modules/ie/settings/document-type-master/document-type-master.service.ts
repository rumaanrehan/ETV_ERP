import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DocumentTypeMaster, DocumentTypeRequest, DocumentType_IndexFilter, DocumentType_IndexList, DocumentType_SelectList } from './document-type-master';
import { ApiListResponse, ApiPagedListResponse, ApiDataResponse, ApiResponse } from '../../../../shared/models/api-response';
import { DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeMasterService {
  private endpoint = 'IE/DocumentTypeMaster';

  constructor(
    private apiService: ApiService
  ) { }

  PopulateList(model: DocumentTypeRequest): Observable<ApiListResponse<DocumentType_SelectList>> {
    return this.apiService.post<ApiListResponse<DocumentType_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }

  PopulateGrid(model: DataTableParams<DocumentType_IndexFilter>): Observable<ApiPagedListResponse<DocumentType_IndexList>> {
    return this.apiService.post<ApiPagedListResponse<DocumentType_IndexList>>(`${this.endpoint}/PopulateGrid`, model);
  }

  GetDetails(documentTypeID: number): Observable<ApiDataResponse<DocumentTypeMaster>> {
    return this.apiService.post<ApiDataResponse<DocumentTypeMaster>>(`${this.endpoint}/GetDetails?DocumentTypeID=${documentTypeID}`, {});
  }

  CreateRecord(model: DocumentTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Create`, model);
  }

  UpdateRecord(model: DocumentTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Edit`, model);
  }

  DeleteReactivate(model: DocumentTypeMaster): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`${this.endpoint}/Delete`, model);
  }

  getFormConfig_DataTableFilter(): DataTableFilterFormConfigType<DocumentType_IndexFilter> {
    return {
      DocumentTypeCode: '',
      DocumentTypeName: '',
      ShortCode: '',
      IsApprovalRequired: 0,
      ActiveStatusID: 0
    };
  }

  getFormConfig(): FormConfigType<DocumentTypeMaster> {
    return {
      DocumentTypeID: {
        label: '',
        defaultValue: null
      },
      DocumentTypeCode: {
        label: 'Document Type Code',
        defaultValue: 'NEW'
      },
      DocumentTypeName: {
        label: 'Document Type Name',
        defaultValue: null,
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Document Type Name is required.'
        }
      },
      ShortCode: {
        label: 'Short Code',
        defaultValue: null,
      },
      IsVerificationRequired: {
        label: 'Is Verification Required',
        defaultValue: false,
      },
      Description: {
        label: 'Description',
        defaultValue: null,
      },
    }
  }
}