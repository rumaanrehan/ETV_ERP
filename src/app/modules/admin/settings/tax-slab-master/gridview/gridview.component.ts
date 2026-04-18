import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { TaxSlab_IndexTableFilter, TaxSlab_IndexTableList } from '../tax-slab-master';
import { TaxSlabMasterService } from '../tax-slab-master.service';

@Component({
  selector: 'app-tax-slab-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  @Output() editDetails = new EventEmitter<{ taxSlabID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<TaxSlab_IndexTableList>();

  @ViewChild('taxSlabCodeTemplate', { static: true }) taxSlabCodeTemplate!: TemplateRef<any>;
  @ViewChild('taxSlabActiveStatusTemplate', { static: true }) taxSlabActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<TaxSlab_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: TaxSlabMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'Admin_TaxSlabMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'TaxSlabCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'TaxSlabCode', label: 'Code', enabled: true, order: -1 },
        { field: 'TaxSlabName', label: 'Tax Slab Name', enabled: true, order: 0 },
        { field: 'TaxRate', label: 'Tax Rate', enabled: true, order: 0 }
      ],
      rowClick: (row) => this.onClickEditDetails(row.TaxSlabID, row.ActiveStatus),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'TaxSlabCode', label: 'Code', hideVisToggle: true, filterable: true, width: '8%', customTemplate: this.taxSlabCodeTemplate },
      { data: 'TaxSlabName', label: 'Tax Slab Name', filterable: true },
      { data: 'TaxRate', label: 'Tax Rate', filterType: 'select', filterKey: 'TaxRateID', filterable: true },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '10%', customTemplate: this.taxSlabActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '3%', customTemplate: this.actionColTemplate },
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

    const model: DataTableParams<TaxSlab_IndexTableFilter> & { sortings?: any } = {
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

  onClickEditDetails(taxSlabID: number | null, activeStatus: boolean | null): void {
    if (!taxSlabID) return;
    this.editDetails.emit({ taxSlabID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(row: TaxSlab_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
