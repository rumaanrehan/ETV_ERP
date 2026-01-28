import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { ProformaInvoiceService } from '../proforma-invoice.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ProformaInvoice, ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList } from '../proforma-invoice';
import { Subject, takeUntil } from 'rxjs';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { CommonModule } from '@angular/common';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('proformaInvoiceCodeTemplate', { static: true }) proformaInvoiceCodeTemplate!: TemplateRef<any>;
  @ViewChild('proformaInvoiceDateTemplate', { static: true }) proformaInvoiceDateTemplate!: TemplateRef<any>;
  @ViewChild('proformaInvoiceStatusTemplate', { static: true }) proformaInvoiceStatusTemplate!: TemplateRef<any>;
  @ViewChild('subtotalAmountFCTemplate', { static: true }) subtotalAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCTemplate', { static: true }) taxAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('netAmountFCTemplate', { static: true }) netAmountFCTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ProformaInvoice_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProformaInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IE_ProformaInvoice_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ProformaInvoiceNo', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ProformaInvoice_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'ProformaInvoiceNo', label: 'Invoice No', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.proformaInvoiceCodeTemplate },
      { data: 'ProformaInvoiceDate', label: 'Date', width: "10%", customTemplate: this.proformaInvoiceDateTemplate },
      { data: 'BasedOn', label: 'Based On', width: "8%", filterable: true, filterType: 'select', filterKey: 'BasedOn' },
      { data: 'ExportOrderNo', label: 'Export Order No', orderable: false, filterable: true, width: "12%" },
      { data: 'CustomerName', label: 'Customer', filterable: true, width: "20%" },
      { data: 'SubtotalAmountFC', label: 'Subtotal Amount', orderable: false, width: "10%", customTemplate: this.subtotalAmountFCTemplate },
      { data: 'TaxAmountFC', label: 'Tax Amount', orderable: false, width: "10%", customTemplate: this.taxAmountFCTemplate },
      { data: 'NetAmountFC', label: 'Net Amount', width: "10%", customTemplate: this.netAmountFCTemplate },
      { data: 'StatusID', label: 'Status', width: "8%", filterable: true, filterType: 'select', filterKey: 'StatusID', cssClass: 'text-center', customTemplate: this.proformaInvoiceStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "4%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    this.navContextService.clear();
    this.router.navigate(['ie/proforma-invoice/create']);
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<ProformaInvoice_IndexTableFilter> = {
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
            }
            else {
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
    catch (error) {

    }
  }

  onClickEditDetails(proformaInvoiceID: number) {
    if (proformaInvoiceID) {
      this.router.navigate([`ie/proforma-invoice/edit/${proformaInvoiceID}`]);
    }
  }

  onClickDeleteReactivate(row: any): void {
    try {
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: 'Reason To Cancel',
        text: `Do you really want to cancel the "<b>${row.ProformaInvoiceNo}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            this.pageService.CancelRecord(row.ProformaInvoiceID, result.value)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  if (response.IsSuccess) {
                    this.loadData();
                    this.alertService.showAlert({
                      type: "success",
                      text: response.Message,
                      timer: 5000
                    });
                  }
                  else {
                    this.alertService.showServerResponseAlert(response);
                  }
                }
              });
          }
        });
    }
    catch (error) {

    }
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}
