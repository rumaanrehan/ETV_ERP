import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { ModuleMaster_IndexTableFilter, ModuleMaster_IndexTableList } from '../module-master';
import { ModuleMasterService } from '../module-master.service';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  @Output() editDetails = new EventEmitter<{ moduleID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<ModuleMaster_IndexTableList>();

  @ViewChild('moduleCodeTemplate', { static: true }) moduleCodeTemplate!: TemplateRef<any>;
  @ViewChild('moduleDisplayOrderTemplate', { static: true }) moduleDisplayOrderTemplate!: TemplateRef<any>;
  @ViewChild('moduleActiveStatusTemplate', { static: true }) moduleActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ModuleMaster_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: ModuleMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'Admin_ModuleMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ModuleCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'ModuleCode', label: 'Code', enabled: true, order: -1 },
        { field: 'ModuleName', label: 'Module Name', enabled: true, order: 0 }
      ],
      rowClick: (row) => this.onClickEditDetails(row.ModuleID, row.ActiveStatus),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'ModuleCode', label: 'Code', hideVisToggle: true, filterable: true, width: '8%', customTemplate: this.moduleCodeTemplate },
      { data: 'ModuleName', label: 'Module Name', filterable: true },
      { data: 'ImagePath', label: 'Image Path', orderable: false },
      { data: 'DisplayOrder', label: 'Display Order', cssClass: 'text-end', customTemplate: this.moduleDisplayOrderTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '10%', customTemplate: this.moduleActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '3%', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['filterForm'] || changes['sortingForm']) && this.tableDef) {
      this.tableDef.filterForm = this.filterForm;
      this.tableDef.sortingForm = this.sortingForm;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableFilter());
    } else if (formGroup === this.sortingForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableSort());
    }
    this.loadData();
  }

  reload(): void {
    if (this.tableEvent) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.tableEvent) return;

    const model: DataTableParams<ModuleMaster_IndexTableFilter> & { sortings?: any } = {
      first: this.tableEvent.first,
      last: this.tableEvent.last,
      sortField: this.tableEvent.sortField,
      sortOrder: this.tableEvent.sortOrder,
      filters: this.tableDef.filterForm?.value,
      sortings: this.tableDef.sortingForm?.value
    };

    this.tableDef.loading = true;
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
  }

  onClickEditDetails(moduleID: number | null, activeStatus: boolean | null): void {
    if (!moduleID) return;
    this.editDetails.emit({ moduleID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(row: ModuleMaster_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
