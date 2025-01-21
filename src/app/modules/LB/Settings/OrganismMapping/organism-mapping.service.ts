import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { OrganismMapping, OrganismMappingList } from './organism-mapping';

@Injectable({
  providedIn: 'root',
})
export class OrganismMappingService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<OrganismMapping> {
    return {
      TestID: {
        label: 'Test',
        defaultValue: null,
      },
      OrganismID: {
        label: 'Organism',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Organism List.'
        },
        type: 'control'
      },
      AntibioticID: {
        label: '',
        defaultValue: null,
      },
      OrgMapping: {
        label: '',
        defaultValue: null
      },
      TotalMappedAntibiotic: {
        label: 'Mapped Antibiotic',
        defaultValue: null
      },
    };
  }
  //#endregion

  PopulateList(OrganismID: number, PopulateType: string): Observable<ApiListResponse<OrganismMappingList>> {
    return this.http.post<ApiListResponse<OrganismMappingList>>(`${this.apiUrl}LB/OrganismMaster/PopulateList?OrganismID=${OrganismID}&PopulateType=${PopulateType}`, {});
  }

  UpdateRecord(model: OrganismMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/OrganismMaster/OrganismMapping_Edit`, model);
  }
}
