import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { TableLazyLoadEvent } from 'primeng/table';
import { TaxInvoice, TaxInvoice_IndexTableFilter, TaxInvoice_IndexTableList } from '../tax-invoice';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { TaxInvoiceService } from '../tax-invoice.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';

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
  @ViewChild('taxInvoiceCodeTemplate', { static: true }) taxInvoiceCodeTemplate!: TemplateRef<any>;
  @ViewChild('taxInvoiceDateTemplate', { static: true }) taxInvoiceDateTemplate!: TemplateRef<any>;
  @ViewChild('taxInvoiceStatusTemplate', { static: true }) taxInvoiceStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  
  tableDef!: DataTableDef<TaxInvoice_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: TaxInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IE_TaxInvoice_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'TaxInvoiceNo', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<TaxInvoice_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'TaxInvoiceNo', label: 'Code', hideVisToggle: true, filterable: true, width: "8%", customTemplate: this.taxInvoiceCodeTemplate },
      { data: 'TaxInvoiceDate', label: 'Date', width: "8%", customTemplate: this.taxInvoiceDateTemplate },
      { data: 'BasedOn', label: 'Based On', width: "10%", filterable: true, filterType: 'select', filterKey: 'BasedOn' },
      { data: 'DocumentNo', label: 'EO/PI No', orderable: false, width: "10%" },
      { data: 'CustomerName', label: 'Customer', orderable: false, width: "25%", filterable: true },
      { data: 'SubtotalAmountFC', label: 'Subtotal Amount', orderable: false, width: "12%" },
      { data: 'TaxAmountFC', label: 'Tax Amount', orderable: false, width: "12%" },
      { data: 'NetAmountFC', label: 'Net Amount', width: "12%" },
      { data: 'StatusID', label: 'Status', width: "10%", filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.taxInvoiceStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "6%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['ie/tax-invoice/create']);
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }
  
  loadData(): void {
    try {
      const model: DataTableParams<TaxInvoice_IndexTableFilter> = {
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

  onClickEditDetails(taxInvoiceID: number) {
    if (taxInvoiceID) {
      this.router.navigate([`ie/tax-invoice/edit/${taxInvoiceID}`]);
    }
  }

  onClickDeleteReactivate(row: any): void {
    try {
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: 'Reason To Cancel',
        text: `Do you really want to cancel the "<b>${row.TaxInvoiceNo}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: TaxInvoice = {
              ...row,
              ReasonToUpdate: result.value
            };

            this.pageService.CancelRecord(model)
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