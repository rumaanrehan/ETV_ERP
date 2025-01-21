import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { ApiDataResponse, ApiListResponse, ApiPagedListResponse, ApiResponse } from '../../../../shared/models/api-response';
// import { DataTableFilterFormConfigType, FormConfigType } from '../../../../shared/models/form.model';
// import { NotOnlyWhitespaceValidator } from '../../../../shared/validators/not-only-whitespace.validator';
// import { Operator, RequiredIf } from '../../../../shared/validators/required-if.validator';
// import { PlanMaster, PlanMaster_BillTypeMappingList, PlanMaster_IndexFilter, PlanMasterList } from './plan-master';
import { Environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZDataTableService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Environment.apiUrl;
  }

//   PopulateList(PopulateType: any): Observable<ApiListResponse<PlanMasterList>> {
//     return this.http.post<ApiListResponse<PlanMasterList>>(`${this.apiUrl}Admin/PlanMaster/PopulateList?PopulateType=${PopulateType}`, {});
//   }

}
