import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { PlanMaster, PlanMaster_IndexTableFilter, PlanMaster_IndexTableList } from '../plan-master';
import { PlanMasterService } from '../plan-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ZDataTable,CommonModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('planCodeTemplate', { static: true }) planCodeTemplate!: TemplateRef<any>;
  @ViewChild('planIsAllowedForOPTemplate', { static: true }) planIsAllowedForOPTemplate!: TemplateRef<any>;
  @ViewChild('planIsAllowedForIPTemplate', { static: true }) planIsAllowedForIPTemplate!: TemplateRef<any>;
  @ViewChild('planIsPreAuthorizationRequiredTemplate', { static: true }) planIsPreAuthorizationRequiredTemplate!: TemplateRef<any>;
  @ViewChild('planIsDefaultTemplate', { static: true }) planIsDefaultTemplate!: TemplateRef<any>;
  @ViewChild('planActiveStatusTemplate', { static: true }) planActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<PlanMaster_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: PlanMasterService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'Admin_PlanMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'PlanCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<PlanMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false },
      { data: 'PlanID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'PlanCode', label: 'Code', hideVisToggle: true, filterable: true, width: "5%", customTemplate: this.planCodeTemplate },
      { data: 'PlanName', label: 'Plan Name', filterable: true },
      { data: 'BillCompanyName', label: 'Bill Company', width: "20%", filterable: true, filterType: 'select', filterKey: 'BillCompanyID' },
      { data: 'PlanTypeName', label: 'Plan Type', width: "10%", filterable: true, filterType: 'select', filterKey: 'PlanTypeID' },
      { data: 'IsAllowedForOP', label: 'OP Registration', groupLabel: 'Allowed For', orderable: false, cssClass: 'text-center', width: "7%", customTemplate: this.planIsAllowedForOPTemplate },
      { data: 'IsAllowedForIP', label: 'IP Registration', groupLabel: 'Allowed For', orderable: false, cssClass: 'text-center', width: "7%", customTemplate: this.planIsAllowedForIPTemplate },
      { data: 'IsPreAuthorizationRequired', label: 'Is Pre-Authorization Required', orderable: false, cssClass: 'text-center', width: "15%", customTemplate: this.planIsPreAuthorizationRequiredTemplate },
      { data: 'IsDefault', label: 'Is Default', orderable: false, cssClass: 'text-center', width: "5%", customTemplate: this.planIsDefaultTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "5%", customTemplate: this.planActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "1%", customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/PlanMaster/Create']);
  }

  onClickEditDetails(PlanID: number) {
    if (PlanID) {
      this.router.navigate([`Admin/PlanMaster/Edit/${PlanID}`]);
    }
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try {
      const model: DataTableParams<PlanMaster_IndexTableFilter> = {
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

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to <b>${ActionType.toUpperCase()} </b> the "<b>${row.PlanName}</b>"?`,
      }).then(result => {
        if (result.isConfirmed) {
          const model: PlanMaster = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value
          };

          this.pageService.DeleteRecord(model)
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
}
