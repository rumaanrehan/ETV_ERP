import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { PaymentMode, PaymentModeList } from '../payment-mode';
import { PaymentModeService } from '../payment-mode.service';
import { CreateComponent } from '../create/create.component';
import { FormService } from '../../../../../shared/services/form.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('paymentModeCodeTemplate', { static: true }) paymentModeCodeTemplate!: TemplateRef<any>;
  @ViewChild('paymentModeActiveStatusTemplate', { static: true }) paymentModeActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<PaymentModeList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private componentService: PaymentModeService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {  
    // Send the template to the page header
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'PaymentModeID', visible: false, orderable: false },
      { data: 'PaymentModeCode', label: 'Code', customTemplate: this.paymentModeCodeTemplate },
      { data: 'PaymentModeName', label: 'Payment Mode Name' },
      { data: 'ActiveStatus', label: 'Status', orderable: false, cssClass: 'text-center', customTemplate: this.paymentModeActiveStatusTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadData(this.tableParameters);
  }

  onCloseSidebar(): void {
    this.loadData(this.tableParameters);
  }

  loadData(event: TableLazyLoadEvent) {
    try {
      this.componentService.PopulateGrid(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          }
          else {
            this.alertService.showServerResponseAlert(response);
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

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(false, this.formService.createNullObject<PaymentMode>());
    }
  }

  onClickEditDetails(PaymentModeID: number) {
    try {
      if (this.createSidebar && PaymentModeID) {
        this.componentService.GetDetails(PaymentModeID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              //Get the Mapping List Data
              this.componentService.GetPaymentModeMappingAsync(PaymentModeID)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (detailResponse) => {
                  if (detailResponse.IsSuccess) {
                    const model = {
                      ...response.Data,
                      PaymentModeMapping: detailResponse.Data.Items
                    };
                    this.createSidebar.openSidebar(true, model);
                  }
                  else {
                    this.alertService.showServerResponseAlert(detailResponse);
                  }
                }
              });
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
      }
    }
    catch (error) {
    
    }
  }

  onClickDelete(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to <b>${ActionType.toUpperCase()} </b> the "<b>${row.PaymentModeName}</b>"?`,
      }).then(result => {
        if (result.isConfirmed) {
          const model: PaymentMode = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value
          };

          this.componentService.DeleteRecord(model)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.loadData(this.tableParameters);
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
}