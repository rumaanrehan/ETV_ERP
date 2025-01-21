import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Environment } from '../../../../../environments/environment';
import { ApiListResponse, ApiResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ProfileTestMapping, ProfileTestMappingList } from './profile-test-mapping';

@Injectable({
  providedIn: 'root',
})
export class ProfileTestMappingService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

  //#region Form Configuration
  getFormConfig(): FormConfigType<ProfileTestMapping> {
    return {
      TestMappingID: {
        label: '',
        defaultValue: null,
      },
      ProfileID: {
        label: 'Profile',
        defaultValue: null,
        validators: [Validators.required],
        validationMessages: {
          required: 'Please select an option from the Profile List.'
        },
        type: 'control'
      },
      TestID: {
        label: '',
        defaultValue: null,
      },
      TestMapping: {
        label: '',
        defaultValue: null
      },
      TotalMappedTest: {
        label: 'Total Mapped Test',
        defaultValue: null
      },
    };
  }
  //#endregion

  PopulateList(ProfileID: number, PopulateType: string): Observable<ApiListResponse<ProfileTestMappingList>> {
    return this.http.post<ApiListResponse<ProfileTestMappingList>>(`${this.apiUrl}LB/ProfileTestMapping/PopulateList?ProfileID=${ProfileID}&PopulateType=${PopulateType}`, {});
  }

  UpdateRecord(model: ProfileTestMapping): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}LB/ProfileTestMapping/ProfileTestMapping_Edit`, model);
  }
}
