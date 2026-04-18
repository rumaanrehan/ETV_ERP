import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { Currency_IndexTableFilter, Currency_IndexTableList } from '../currency-master';
import { CurrencyMasterService } from '../currency-master.service';

@Component({
  selector: 'app-currency-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class CurrencyGridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ currencyID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<Currency_IndexTableList>();

  @ViewChild('currencyCodeTemplate', { static: true }) currencyCodeTemplate!: TemplateRef<any>;
  @ViewChild('currencyActiveStatusTemplate', { static: true }) currencyActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<Currency_IndexTableList>;
  tableEvent: any;

  constructor(
    private pageService: CurrencyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'Admin_CurrencyMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'CurrencyCode', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: (row) => this.onClickEditDetails(row)
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'CurrencyCode', label: 'Code', hideVisToggle: true, filterable: true, width: '10%', customTemplate: this.currencyCodeTemplate },
      { data: 'CountryName', label: 'Country Name', filterable: true, width: '18%' },
      { data: 'CurrencyName', label: 'Currency Name', filterable: true, width: '20%' },
      { data: 'CurrencyISOCode', label: 'Currency ISO Code', width: '14%' },
      { data: 'CurrencySymbol', label: 'Currency Symbol', filterable: true, orderable: false, width: '12%' },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '12%', customTemplate: this.currencyActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '6%', customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: any): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<Currency_IndexTableFilter> = {
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
      this.formService.resetFormValue<Currency_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    }
  }

  onClickEditDetails(row: Currency_IndexTableList): void {
    this.editDetails.emit({ currencyID: row.CurrencyID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: Currency_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
