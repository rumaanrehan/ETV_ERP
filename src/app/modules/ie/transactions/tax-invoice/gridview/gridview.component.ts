import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { DataTableDef, DataTableLazyLoadEvent } from '../../../../../shared/components/z-datatable/z-datatable';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { TaxInvoice_IndexTableFilter, TaxInvoice_IndexTableList, TaxInvoice_IndexTableSort } from '../tax-invoice';
import { TaxInvoiceService } from '../tax-invoice.service';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable, RouterLink, CheckboxModule, FormsModule],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() selectionChange = new EventEmitter<TaxInvoice_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('taxInvoiceCodeTemplate', { static: true }) taxInvoiceCodeTemplate!: TemplateRef<any>;
  @ViewChild('taxInvoiceDateTemplate', { static: true }) taxInvoiceDateTemplate!: TemplateRef<any>;
  @ViewChild('subtotalAmountFCTemplate', { static: true }) subtotalAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCTemplate', { static: true }) taxAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('netAmountFCTemplate', { static: true }) netAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('statusColTemplate', { static: true }) statusColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<TaxInvoice_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: TaxInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_TaxInvoice_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'TaxInvoiceNo', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'TaxInvoiceNo', label: 'Tax Invoice No', enabled: true, order: 1 },
        { field: 'TaxInvoiceDate', label: 'Invoice Date', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false,
      filterFields: [
        { field: 'TaxInvoiceNo', label: 'Tax Invoice No', type: 'text' },
        { field: 'BasedOn', label: 'Based On', type: 'dropdown', options: [] },
        { field: 'DocumentNo', label: 'Document No', type: 'text' },
        { field: 'CustomerName', label: 'Customer Name', type: 'text' },
        { field: 'Status', label: 'Status', type: 'dropdown', options: [] }
      ]
    };

    this.tableDef.columnDef = [
      { data: '_selected', label: '', orderable: false, width: '50px', filterable: false, customTemplate: this.selectionColTemplate },
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '70px' },
      { data: 'TaxInvoiceNo', label: 'Invoice No', hideVisToggle: true, orderable: false, width: '160px', filterable: true, customTemplate: this.taxInvoiceCodeTemplate },
      { data: 'TaxInvoiceDate', label: 'Date', orderable: false, width: '130px', customTemplate: this.taxInvoiceDateTemplate },
      { data: 'BasedOn', label: 'Based On', orderable: false, width: '130px' },
      { data: 'DocumentNo', label: 'Document No', orderable: false, width: '150px' },
      { data: 'CustomerName', label: 'Customer', orderable: false, width: '220px' },
      { data: 'SubtotalAmountFC', label: 'Subtotal Amount', orderable: false, width: '150px', customTemplate: this.subtotalAmountFCTemplate },
      { data: 'TaxAmountFC', label: 'Tax Amount', orderable: false, width: '140px', customTemplate: this.taxAmountFCTemplate },
      { data: 'NetAmountFC', label: 'Net Amount', orderable: false, width: '150px', customTemplate: this.netAmountFCTemplate },
      { data: 'StatusText', label: 'Status', orderable: false, width: '130px', filterable: true, customTemplate: this.statusColTemplate },
      { data: 'ActionCol', label: '', hideVisToggle: true, orderable: false, width: '70px', customTemplate: this.actionColTemplate }
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
    } catch {
      this.tableDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableFilter());
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<TaxInvoice_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  toggleSelectAll(checked: boolean) {
    this.tableDef.data.forEach(x => x._selected = checked);
    this.onSelectionChange();
  }

  onClickEditDetails(id: number): void {
    if (id) {
      this.navContextService.clear();
      this.router.navigate([`ie/tax-invoice/edit/${id}`]);
    }
  }

  onClickDeleteReactivate(row: TaxInvoice_IndexTableList): void {
    this.alertService.showConfirmationWithInput({
      inputPlaceholder: 'Reason To Cancel',
      text: `Do you really want to cancel the "<b>${row.TaxInvoiceNo}</b>"?`
    }).then(result => {
      if (result.isConfirmed) {
        const reason = result.Message ?? result.value ?? '';
        this.pageService.CancelRecord(row.TaxInvoiceID, reason)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.loadData();
                this.alertService.showAlert({
                  type: 'success',
                  text: response.Message,
                  timer: 5000
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            }
          });
      }
    });
  }

  formatDate(date: Date): string {
    return DateUtils.formatDate(date);
  }
}
