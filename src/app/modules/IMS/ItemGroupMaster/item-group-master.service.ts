import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../../shared/models/api-response';
import { ItemGroupMaster_SelectList } from './item-group-master';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupMasterService {
private endpoint = 'IMS/ItemGroupMaster';

  constructor(
    private apiService: ApiService,
  ) { }

  PopulateList(PopulateType: any): Observable<ApiListResponse<ItemGroupMaster_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemGroupMaster_SelectList>>( `${this.endpoint}/PopulateList?PopulateType=${PopulateType}`, {} );
  }
}
