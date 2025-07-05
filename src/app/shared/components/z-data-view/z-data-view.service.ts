import { Injectable } from '@angular/core';
import { FormConfigType } from '../../models/form.model';
import { SortingForm } from './z-data-view';

@Injectable({
  providedIn: 'root'
})
export class ZDataViewService {

  constructor() { }

  getFormConfig_DataViewSorting(): FormConfigType<SortingForm> {
      return {
        sortField: {
          label: 'Sort Field',
          defaultValue: ''
        },
        sortOrder: {
          label: 'Sort Order',
          defaultValue: ''
        },
      }
    }
}
