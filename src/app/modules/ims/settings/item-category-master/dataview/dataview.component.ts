import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ItemCategory_IndexFilter, ItemCategory_IndexList } from '../item-category-master';
import { ItemCategoryMasterService } from '../item-category-master.service';

@Component({
  selector: 'app-item-category-dataview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZDataviewComponent],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class ItemCategoryDataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ itemCategoryID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<ItemCategory_IndexList>();

  dataViewDef!: DataViewDef<ItemCategory_IndexList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  constructor(
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.dataViewDef = {
      tableKey: 'IMS_ItemCategoryMaster_IndexTable',
      defaultSortColumn: { sortField: 'ItemCategoryCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      filterFields: [
        { field: 'ItemCategoryCode', label: 'Code', type: 'text' },
        { field: 'ItemCategoryName', label: 'Item Category Name', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'ItemCategoryCode', label: 'Code', enabled: true, order: 1 },
        { field: 'ItemCategoryName', label: 'Item Category Name', enabled: true, order: 0 },
        { field: 'ActiveStatusID', label: 'Status', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent): void {
    this.dataViewEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      this.dataViewDef.loading = true;
      const model: DataViewParams<ItemCategory_IndexFilter, any> = {
        first: this.dataViewEvent.first,
        last: this.dataViewEvent.rows,
        filters: this.filterForm.value,
        sortings: this.sortingForm.value
      };

      this.pageService.PopulateGrid(this.formService.transformFormData(model) as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.dataViewDef.data = response.Data.Items;
              this.dataViewDef.totalRecords = response.Data.TotalRecords;
            } else {
              this.dataViewDef.data = [];
              this.dataViewDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.dataViewDef.loading = false;
          }
        });
    } catch {
      this.dataViewDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<ItemCategory_IndexFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    } else if (formGroup === this.sortingForm) {
      formGroup.reset({ ItemCategoryCode: 1, ItemCategoryName: 0, ActiveStatusID: 0 });
    }
    this.loadData();
  }

  onClickEditDetails(row: ItemCategory_IndexList): void {
    this.editDetails.emit({ itemCategoryID: row.ItemCategoryID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: ItemCategory_IndexList): void {
    this.deleteReactivate.emit(row);
  }
}
