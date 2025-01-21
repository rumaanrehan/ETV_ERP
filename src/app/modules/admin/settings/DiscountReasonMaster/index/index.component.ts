import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { DiscountReasonMaster, DiscountReasonMasterList } from '../discount-reason-master';
import { DiscountReasonMasterService } from '../discount-reason-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent, CommonModule], 
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('discountReasonCodeTemplate', { static: true }) discountReasonCodeTemplate!: TemplateRef<any>;
  @ViewChild('isAllowedAdditionalDescriptionTemplate', { static: true }) isAllowedAdditionalDescriptionTemplate!: TemplateRef<any>;
  @ViewChild('isAdditionalDescriptionRequiredTemplate', { static: true }) isAdditionalDescriptionRequiredTemplate!: TemplateRef<any>;
  @ViewChild('isDiscountApprovalRequiredTemplate', { static: true }) isDiscountApprovalRequiredTemplate!: TemplateRef<any>;
  @ViewChild('discountPercentTemplate', { static: true }) discountPercentTemplate!: TemplateRef<any>;
  @ViewChild('isAllowedForOPRegistrationTemplate', { static: true }) isAllowedForOPRegistrationTemplate!: TemplateRef<any>;
  @ViewChild('isAllowedForBillingTemplate', { static: true }) isAllowedForBillingTemplate!: TemplateRef<any>;
  @ViewChild('isAllowedForPharmacyTemplate', { static: true }) isAllowedForPharmacyTemplate!: TemplateRef<any>;
  @ViewChild('discountReasonActiveStatusTemplate', { static: true }) discountReasonActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<DiscountReasonMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: DiscountReasonMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'DiscountReasonID', visible: false, orderable: false },
      { data: 'DiscountReasonCode', label: 'Code', customTemplate: this.discountReasonCodeTemplate },
      { data: 'DiscountReasonName', label: 'Discount Reason'},
      { data: 'IsAllowedAdditionalDescription', label: 'Is Allowed Additional Description', orderable: false, cssClass: 'text-center', customTemplate: this.isAllowedAdditionalDescriptionTemplate},
      { data: 'IsAdditionalDescriptionRequired', label: 'Is Additional Description Required', orderable: false, cssClass: 'text-center', customTemplate: this.isAdditionalDescriptionRequiredTemplate},
      { data: 'IsDiscountApprovalRequired', label: 'Is Discount Approval Required', orderable: false, cssClass: 'text-center', customTemplate: this.isDiscountApprovalRequiredTemplate },
      { data: 'DiscountPercent', label: 'Default Discount', orderable: false, cssClass: 'text-end', customTemplate: this.discountPercentTemplate },
      { data: 'IsAllowedForOPRegistration', label: 'Is Allowed For OP Registration', orderable: false, cssClass: 'text-center', customTemplate: this.isAllowedForOPRegistrationTemplate },
      { data: 'IsAllowedForBilling', label: 'Is Allowed For Billing', orderable: false, cssClass: 'text-center', customTemplate: this.isAllowedForBillingTemplate },
      { data: 'IsAllowedForPharmacy', label: 'Is Allowed For Pharmacy', orderable: false, cssClass: 'text-center', customTemplate: this.isAllowedForPharmacyTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.discountReasonActiveStatusTemplate },
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
      this.pageService.PopulateGrid(event)
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<DiscountReasonMaster>());
    }
  }

  onClickEditDetails(DiscountReasonID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && DiscountReasonID) {
        this.pageService.GetDetails(DiscountReasonID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: DiscountReasonMaster = {
                  ...response.Data
                };
                this.createSidebar.openSidebar(ActiveStatus, true, model);
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
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.DiscountReasonName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: DiscountReasonMaster = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value
            };

            this.pageService.DeleteRecord(model)
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
