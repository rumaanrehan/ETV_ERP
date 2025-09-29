import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { concat, Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, SortingForm } from './z-data-view';
import { DataView, DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { FormSidebarComponent } from "../form-sidebar/form-sidebar.component";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfigType } from '../../models/form.model';
import { ZDataViewService } from './z-data-view.service';
import { FormService } from '../../services/form.service';
import { ZFormControlsModule } from '../z-form-controls/z-form-controls.module';
import { StaticList } from '../../models/select-list';
import { ApiListResponse } from '../../models/api-response';

@Component({
  selector: 'z-data-view',
  standalone: true,
  imports: [DataViewModule, CommonModule, FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './z-data-view.component.html',
  styleUrl: './z-data-view.component.scss'
})
export class ZDataViewComponent<T> {
  private destroy$ = new Subject<void>();
  @ViewChild('dv') dataView!: DataView;
  /* Declarations */
  @Input() dataViewDef!: DataViewDef<T>;
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() sortFieldList!: any[];

  @Output() lazyLoad: EventEmitter<DataViewLazyLoadEvent> = new EventEmitter();
  @Output() statusList = new EventEmitter<StaticList[]>();

  sortOrderList: any = [
    { value: '1', text: 'ASC' },
    { value: '-1', text: 'DESC' }
  ]

  sortingForm!: FormGroup;
  sortingFormConfig!: FormConfigType<SortingForm>;

  isFilterPanelVisible: boolean = false;
  dataViewLazyLoadEvent!: DataViewLazyLoadEvent;

  constructor(
    private componentService: ZDataViewService,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.sortingFormConfig = this.componentService.getFormConfig_DataViewSorting();
    this.sortingForm = this.formService.createFormGroup(this.sortingFormConfig);
    this.getStatusList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(event: DataViewLazyLoadEvent) {
    this.dataViewLazyLoadEvent = {
      first: (event.first ?? 0) + 1,
      rows: (event.first ?? 0) + (event.rows ?? 25),
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    };

    setTimeout(() => {
      this.dataViewDef.loading = true;

      setTimeout(() => {
        this.lazyLoad.emit(this.dataViewLazyLoadEvent);
      }, 1);
    });
  }

  toggleFilterPanel() {
    this.isFilterPanelVisible = !this.isFilterPanelVisible;
  }

  onClickApplyFilter() {
    this.toggleFilterPanel();
    setTimeout(() => {
      this.lazyLoad.emit(this.dataViewLazyLoadEvent);
    }, 1);
  }

  refreshData() {
    setTimeout(() => {
      this.lazyLoad.emit(this.dataViewLazyLoadEvent);
    }, 1);
  }

  applySorting() {
    this.dataViewLazyLoadEvent.sortField = this.sortingForm.value.sortField;
    this.dataViewLazyLoadEvent.sortOrder = this.sortingForm.value.sortOrder;
    setTimeout(() => {
      this.dataViewDef.loading = true;

      setTimeout(() => {
        this.lazyLoad.emit(this.dataViewLazyLoadEvent);
      }, 1);
    });
  }

  getStatusList(): void {
    const forTable = this.dataViewDef.tableKey.split('_')[0] + '_' + this.dataViewDef.tableKey.split('_')[1];;
    this.componentService.GetStatusList(forTable)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ApiListResponse<StaticList>) => {
          const statusList = res.Data.Items;
          this.statusList.emit(statusList);
        },
        error: (err) => console.error(err)
      });
  }
}
