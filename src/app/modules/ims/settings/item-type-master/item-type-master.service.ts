import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { ApiListResponse } from '../../../../shared/models/api-response';
import { ItemTypeRequest, ItemType_SelectList } from './item-type-master';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeMasterService {
  private endpoint = 'IMS/ItemTypeMaster';

  constructor(
    private apiService: ApiService
  ) { }

  PopulateList(model: ItemTypeRequest): Observable<ApiListResponse<ItemType_SelectList>> {
    return this.apiService.post<ApiListResponse<ItemType_SelectList>>(`${this.endpoint}/PopulateList`, model);
  }
}
