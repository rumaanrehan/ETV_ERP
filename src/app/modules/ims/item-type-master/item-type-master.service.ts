import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ItemType_SelectList, ItemTypeRequest } from './item-type-master';
import { ApiListResponse } from '../../../shared/models/api-response';
import { Observable } from 'rxjs';

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
