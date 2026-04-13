import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaymentTermMaster, PaymentTerm_IndexTableFilter, PaymentTerm_IndexTableList } from '../payment-term-master';
import { PaymentTermMasterService } from '../payment-term-master.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { PaymentTermGridviewComponent } from '../gridview/gridview.component';
import { PaymentTermDataviewComponent } from '../dataview/dataview.component';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CreateComponent, PaymentTermGridviewComponent, PaymentTermDataviewComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})

export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;
  @ViewChild(PaymentTermGridviewComponent, { static: false }) gridview?: PaymentTermGridviewComponent;
  @ViewChild(PaymentTermDataviewComponent, { static: false }) dataview?: PaymentTermDataviewComponent;

  viewType = signal<'card' | 'table'>('table');
  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: PaymentTermMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('paymentTermViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<PaymentTerm_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );

    this.sortingForm = this.formService.createFormGroup_DataTableFilter({
      PaymentTermCode: 1,
      PaymentTermName: 0,
      ActiveStatusID: 0
    });

    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageHeaderService.setTemplate(null);
  }

  toggleView(type: 'card' | 'table'): void {
    this.viewType.set(type);
    localStorage.setItem('paymentTermViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<PaymentTermMaster>());
    }
  }

  onClickEditDetails(payload: { paymentTermID: number; activeStatus: boolean }): void {
    try {
      if (this.createSidebar && payload.paymentTermID) {
        this.pageService.GetDetails(payload.paymentTermID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.createSidebar.openSidebar(payload.activeStatus, true, response.Data);
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

  onCloseSidebar(): void {
    if (this.viewType() === 'card') {
      this.dataview?.loadData();
    } else {
      this.gridview?.loadData();
    }
  }

  onClickDeleteReactivate(row: PaymentTerm_IndexTableList): void {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.PaymentTermName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.PaymentTermID, result.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                if (this.viewType() === 'card') {
                  this.dataview?.loadData();
                } else {
                  this.gridview?.loadData();
                }
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
