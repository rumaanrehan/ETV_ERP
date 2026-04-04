import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_IndexTableSort } from '../export-order';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ExportOrderService } from '../export-order.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable, RouterLink, CheckboxModule, FormsModule],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() selectionChange = new EventEmitter<ExportOrder_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('exportOrderCodeTemplate', { static: true }) exportOrderCodeTemplate!: TemplateRef<any>;
  @ViewChild('statusColTemplate', { static: true }) statusColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ExportOrder_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_ExportOrder_IndexDataView',
      columnDef: [],
      defaultSortColumn: { sortField: 'ExportOrderNo', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'ExportOrderNo', label: 'Order No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false,
      filterFields: [
        { field: 'ExportOrderNo', label: 'Order No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown', options: [] }
      ]
    };
    this.tableDef.columnDef = [
      { data: '_selected', label: '', orderable: false, width: "50px", filterable: false, customTemplate: this.selectionColTemplate },
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "70px" },
      { data: 'ExportOrderNo', label: 'Order No', hideVisToggle: true, orderable: false, filterable: true, width: "150px", customTemplate: this.exportOrderCodeTemplate },
      { data: 'CompanyName', label: 'Company', orderable: false, filterable: true },
      { data: 'ExportOrderDate', label: 'Order Date', orderable: false, width: "150px" },
      { data: 'ReferenceNo', label: 'Reference', orderable: false, width: "150px" },
      { data: 'LoadingPortName', label: 'Loading Port', orderable: false },
      { data: 'FinalDestination', label: 'Destination', orderable: false },
      { data: 'NetAmountFC', label: 'Amount', orderable: false, width: "100px" },
      { data: 'StatusText', label: 'Status', orderable: false, width: "130px", filterable: true, customTemplate: this.statusColTemplate },
    ];
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try {
      this.tableDef.loading = true;
      const model: any = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        filters: this.tableDef.filterForm?.value,
        sortings: this.tableDef.sortingForm?.value
      };

      this.pageService.PopulateGrid(this.formService.transformFormData(model))
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
    } catch (error) {
      this.tableDef.loading = false;
    }
  }

  onClickEditDetails(exportOrderID: number) {
    if (exportOrderID) {
      this.navContextService.clear();
      this.router.navigate([`ie/export-order/edit/${exportOrderID}`]);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<ExportOrder_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter(), formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<ExportOrder_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
  }

  toggleSelectAll(checked: boolean) {
    this.tableDef.data.forEach(x => x._selected = checked);
    this.onSelectionChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
