import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PaymentTerm_IndexTableFilter, PaymentTerm_IndexTableList } from '../payment-term-master';
import { PaymentTermMasterService } from '../payment-term-master.service';

@Component({
  selector: 'app-payment-term-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class PaymentTermGridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ paymentTermID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<PaymentTerm_IndexTableList>();

  @ViewChild('paymentTermCodeTemplate', { static: true }) paymentTermCodeTemplate!: TemplateRef<any>;
  @ViewChild('paymentTermActiveStatusTemplate', { static: true }) paymentTermActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<PaymentTerm_IndexTableList>;
  tableEvent: any;

  constructor(
    private pageService: PaymentTermMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_PaymentTermMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'PaymentTermCode', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'PaymentTermCode', label: 'Code', hideVisToggle: true, filterable: true, width: '10%', customTemplate: this.paymentTermCodeTemplate },
      { data: 'PaymentTermName', label: 'Payment Term Name', width: '50%', filterable: true },
      { data: 'ActiveStatus', label: 'Status', width: '15%', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.paymentTermActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '3%', customTemplate: this.actionColTemplate }
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
      const model: DataTableParams<PaymentTerm_IndexTableFilter> = {
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
      this.formService.resetFormValue<PaymentTerm_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    }
  }

  onClickEditDetails(row: PaymentTerm_IndexTableList): void {
    this.editDetails.emit({ paymentTermID: row.PaymentTermID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: PaymentTerm_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}

