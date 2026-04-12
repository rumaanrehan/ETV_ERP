import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { Product_IndexTableFilter, Product_IndexTableList } from '../product-master';
import { ProductMasterService } from '../product-master.service';

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

  @Output() editDetails = new EventEmitter<{ productID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<Product_IndexTableList>();

  @ViewChild('productCodeTemplate', { static: true }) productCodeTemplate!: TemplateRef<any>;
  @ViewChild('productActiveStatusTemplate', { static: true }) productActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<Product_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: ProductMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IMS_ProductMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ProductCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'ProductCode', label: 'Code', enabled: true, order: -1 },
        { field: 'ProductName', label: 'Product Name', enabled: true, order: 0 }
      ],
      rowClick: (row) => this.onClickEditDetails(row.ProductID, row.ActiveStatus),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '5%' },
      { data: 'ProductCode', label: 'Code', hideVisToggle: true, filterable: true, width: '11%', customTemplate: this.productCodeTemplate },
      { data: 'ProductName', label: 'Product Name', width: '27%', filterable: true },
      { data: 'ItemCategoryName', label: 'Item Category', width: '20%', filterable: true },
      { data: 'UOMName', label: 'UOM Name', width: '16%', filterable: true },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '18%', customTemplate: this.productActiveStatusTemplate },
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

    const model: DataTableParams<Product_IndexTableFilter> & { sortings?: any } = {
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

  onClickEditDetails(productID: number | null, activeStatus: boolean | null): void {
    if (!productID) return;
    this.editDetails.emit({ productID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(row: Product_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
