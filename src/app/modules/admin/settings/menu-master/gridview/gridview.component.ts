import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { MenuMaster_IndexTableFilter, MenuMaster_IndexTableList } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';

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

  @Output() editDetails = new EventEmitter<{ menuID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<MenuMaster_IndexTableList>();

  @ViewChild('menuNameTemplate', { static: true }) menuNameTemplate!: TemplateRef<any>;
  @ViewChild('isDeveloperOnlyTemplate', { static: true }) isDeveloperOnlyTemplate!: TemplateRef<any>;
  @ViewChild('menuActiveStatusTemplate', { static: true }) menuActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<MenuMaster_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: MenuMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'Admin_MenuMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'MenuType', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'MenuType', label: 'Menu Type', enabled: true, order: -1 },
        { field: 'MenuName', label: 'Menu Name', enabled: true, order: 0 },
        { field: 'ModuleName', label: 'Module', enabled: true, order: 0 }
      ],
      rowClick: (row) => this.onClickEditDetails(row.MenuID, row.ActiveStatus),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'MenuID', label: 'Menu ID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'ModuleName', label: 'Module', filterable: true },
      { data: 'MenuTypeName', label: 'Menu Type', filterable: true },
      { data: 'MenuName', label: 'Menu Name', filterable: true, customTemplate: this.menuNameTemplate },
      { data: 'ParentMenuName', label: 'Parent', filterable: true },
      { data: 'ControllerName', label: 'Controller', filterable: true, orderable: false },
      { data: 'ActionName', label: 'Action', orderable: false },
      { data: 'DisplayOrder', label: 'Display Order' },
      { data: 'IsDeveloperOnly', label: 'IsDeveloper', orderable: false, customTemplate: this.isDeveloperOnlyTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '10%', customTemplate: this.menuActiveStatusTemplate },
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

    const model: DataTableParams<MenuMaster_IndexTableFilter> & { sortings?: any } = {
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

  onClickEditDetails(menuID: number | null, activeStatus: boolean | null): void {
    if (!menuID) return;
    this.editDetails.emit({ menuID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(row: MenuMaster_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
