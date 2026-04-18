import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { UOM_IndexTableFilter, UOM_IndexTableList } from '../uom-master';
import { UOMMasterService } from '../uom-master.service';

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

  @Output() editDetails = new EventEmitter<{ uomID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<UOM_IndexTableList>();

  @ViewChild('uomCodeTemplate', { static: true }) uomCodeTemplate!: TemplateRef<any>;
  @ViewChild('uomMasterActiveStatusTemplate', { static: true }) uomMasterActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<UOM_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: UOMMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IMS_UOM_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'UOMCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'UOMCode', label: 'Code', enabled: true, order: -1 },
        { field: 'UOMName', label: 'UOM Name', enabled: true, order: 0 }
      ],
      rowClick: (row) => this.onClickEditDetails(row.UOMID, row.ActiveStatus),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'UOMCode', label: 'Code', hideVisToggle: true, filterable: true, width: '10%', customTemplate: this.uomCodeTemplate },
      { data: 'UOMName', label: 'UOM Name', width: '50%', filterable: true },
      { data: 'ShortCode', label: 'Short Code', width: '15%', orderable: false },
      { data: 'ActiveStatus', label: 'Status', width: '15%', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.uomMasterActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '6%', customTemplate: this.actionColTemplate },
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

    const model: DataTableParams<UOM_IndexTableFilter> & { sortings?: any } = {
      first: this.tableEvent.first,
      last: this.tableEvent.last,
      sortField: this.tableEvent.sortField,
      sortOrder: this.tableEvent.sortOrder,
      filters: this.tableDef.filterForm?.value,
      sortings: this.tableDef.sortingForm?.value
    };

    this.tableDef.loading = true;
    this.pageService.PopulateGrid(model as any)
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

  onClickEditDetails(uomID: number | null, activeStatus: boolean | null): void {
    if (!uomID) return;
    this.editDetails.emit({ uomID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(row: UOM_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
