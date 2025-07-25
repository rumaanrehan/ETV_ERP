import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ImportOrderPayment, ImportOrderPayment_IndexTableFilter, ImportOrderPayment_IndexTableList } from '../import-order-payment';
import { ImportOrderPaymentService } from '../import-order-payment.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('paymentNoTemplate', { static: true }) paymentNoTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
    @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<ImportOrderPayment_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ImportOrderPaymentService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'IMS_ImportOrderPayment_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'PaymentNo', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ImportOrderPayment_IndexTableFilter>(
        this.pageService.getFormConfig_DataTableFilter()
      ),
      data: [],
      totalRecords: 0,
      loading: false,
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'PaymentNo', label: 'Payment No', filterable: true, width: '10%', customTemplate: this.paymentNoTemplate },
      { data: 'PaymentRefNo', label: 'Reference No', filterable: true },
      { data: 'PaymentAmountFC', label: 'Amount (FC)', filterable: false },
      { data: 'PaymentDate', label: 'Payment Date', filterable: false },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', customTemplate: this.statusTemplate, width: '10%' },
      { data: '', hideVisToggle: true, orderable: false, width: '3%', customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ImportOrderPayment>());
    }
  }

  onClickEditDetails(paymentID: number, isCanceled: boolean): void {
    try {
      if (this.createSidebar && paymentID) {
        this.pageService.GetDetails(paymentID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.createSidebar.openSidebar(!isCanceled, true, response.Data);
              }
               else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) {}
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<ImportOrderPayment_IndexTableFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value,
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
          },
        });
    } catch (error) {}
  }

  onClickDeleteReactivate(row: any): void {
    try {
      const actionType = row.IsCanceled ? 'reactivate' : 'delete';
      const inputPlaceholder = row.IsCanceled ? 'Reason to Reactivate' : 'Reason to Delete';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to ${actionType} the payment "<b>${row.PaymentNo}</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ImportOrderPayment = {
              ...row,
              ActionType: actionType,
              ReasonToUpdate: result.value,
            };

            this.pageService.DeleteReactivate(model)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  if (response.IsSuccess) {
                    this.loadData();
                    this.alertService.showAlert({
                      type: 'success',
                      text: response.Message,
                      timer: 5000,
                    });
                  } else {
                    this.alertService.showServerResponseAlert(response);
                  }
                },
              });
          }
        });
    } catch (error) {}
  }
}