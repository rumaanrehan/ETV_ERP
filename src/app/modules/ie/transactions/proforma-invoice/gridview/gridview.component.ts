import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DataTableDef, DataTableLazyLoadEvent } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList, ProformaInvoice_IndexTableSort } from '../proforma-invoice';
import { ProformaInvoiceService } from '../proforma-invoice.service';
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
  @Output() selectionChange = new EventEmitter<ProformaInvoice_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('proformaInvoiceCodeTemplate', { static: true }) proformaInvoiceCodeTemplate!: TemplateRef<any>;
  @ViewChild('statusColTemplate', { static: true }) statusColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ProformaInvoice_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: ProformaInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_ProformaInvoice_IndexDataView',
      columnDef: [],
      defaultSortColumn: { sortField: 'ProformaInvoiceNo', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'ProformaInvoiceNo', label: 'Proforma Invoice No', enabled: true, order: 1 },
        { field: 'ProformaInvoiceDate', label: 'Invoice Date', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: (row) => this.onClickEditDetails(row.ProformaInvoiceID),
      filterFields: [
        { field: 'ProformaInvoiceNo', label: 'Proforma Invoice No', type: 'text' },
        { field: 'BasedOn', label: 'Based On', type: 'dropdown', options: [] },
        { field: 'ExportOrderNo', label: 'Export Order No', type: 'text' },
        { field: 'CustomerName', label: 'Customer Name', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown', options: [] }
      ]
    };

    this.tableDef.columnDef = [
      {
        data: '_selected',
        label: '',
        orderable: false,
        width: '50px',
        filterable: false,
        customTemplate: this.selectionColTemplate
      },
      {
        data: 'RowID',
        label: 'SN',
        hideVisToggle: true,
        orderable: false,
        width: '70px'
      },
      {
        data: 'ProformaInvoiceNo',
        label: 'Proforma Invoice No',
        hideVisToggle: true,
        orderable: false,
        width: '180px',
        filterable: true,
        customTemplate: this.proformaInvoiceCodeTemplate
      },
      {
        data: 'ProformaInvoiceDate',
        label: 'Invoice Date',
        orderable: false,
        width: '150px'
      },
      {
        data: 'BasedOn',
        label: 'Based On',
        orderable: false,
        width: '150px'
      },
      {
        data: 'ExportOrderNo',
        label: 'Export Order No',
        orderable: false,
        width: '180px'
      },
      {
        data: 'CustomerName',
        label: 'Customer Name',
        orderable: false,
        width: '220px'
      },
      {
        data: 'SubtotalAmountFC',
        label: 'Subtotal (FC)',
        orderable: false,
        width: '140px'
      },
      {
        data: 'TaxAmountFC',
        label: 'Tax (FC)',
        orderable: false,
        width: '120px'
      },
      {
        data: 'NetAmountFC',
        label: 'Net Amount (FC)',
        orderable: false,
        width: '150px'
      },
      {
        data: 'StatusText',
        label: 'Status',
        orderable: false,
        width: '130px',
        filterable: true,
        customTemplate: this.statusColTemplate
      }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableFilter());
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<ProformaInvoice_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  onClickEditDetails(id: number): void {
    if (id) {
      this.navContextService.clear();
      this.router.navigate([`ie/proforma-invoice/edit/${id}`]);
    }
  }

  toggleSelectAll(checked: boolean) {
    this.tableDef.data.forEach(x => x._selected = checked);
    this.onSelectionChange();
  }
}
