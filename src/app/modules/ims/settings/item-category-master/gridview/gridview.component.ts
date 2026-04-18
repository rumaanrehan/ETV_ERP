import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ItemCategory_IndexFilter, ItemCategory_IndexList } from '../item-category-master';
import { ItemCategoryMasterService } from '../item-category-master.service';

@Component({
  selector: 'app-item-category-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class ItemCategoryGridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ itemCategoryID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<ItemCategory_IndexList>();

  @ViewChild('itemCategoryCodeTemplate', { static: true }) itemCategoryCodeTemplate!: TemplateRef<any>;
  @ViewChild('itemCategoryActiveStatusTemplate', { static: true }) itemCategoryActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ItemCategory_IndexList>;
  tableEvent: any;

  constructor(
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IMS_ItemCategoryMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ItemCategoryCode', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: (row) => this.onClickEditDetails(row)
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', width: '5%', hideVisToggle: true, orderable: false },
      { data: 'ItemCategoryID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'ItemCategoryCode', label: 'Code', hideVisToggle: true, filterable: true, width: '12%', customTemplate: this.itemCategoryCodeTemplate },
      { data: 'ItemCategoryName', label: 'Item Category Name', filterable: true, width: '66%' },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '11%', customTemplate: this.itemCategoryActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, cssClass: 'text-center', width: '6%', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: any): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<ItemCategory_IndexFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value
      };

      this.pageService.PopulateGrid(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.tableDef.data = response.Data.Items;
              this.tableDef.totalRecords = response.Data.TotalRecords;
            } else {
              this.tableDef.data = [];
              this.tableDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.tableDef.loading = false;
          }
        });
    } catch {
      this.tableDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<ItemCategory_IndexFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    }
  }

  onClickEditDetails(row: ItemCategory_IndexList): void {
    this.editDetails.emit({ itemCategoryID: row.ItemCategoryID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: ItemCategory_IndexList): void {
    this.deleteReactivate.emit(row);
  }
}
