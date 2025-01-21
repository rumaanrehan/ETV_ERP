import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { ConsultantUnitMaster, ConsultantUnitMasterList } from '../consultant-unit-master';
import { ConsultantUnitMasterService } from '../consultant-unit-master.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent, DatePipe, CommonModule],
  providers: [FormValidationService, DatePipe]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('consultantUnitCodeTemplate', { static: true }) consultantUnitCodeTemplate!: TemplateRef<any>;
  @ViewChild('dtEffectiveFromDateTemplate', { static: true }) dtEffectiveFromDateTemplate!: TemplateRef<any>;
  @ViewChild('consultantUnitActiveStatusTemplate', { static: true }) consultantUnitActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;


  tableDef!: IndexTableParams<ConsultantUnitMasterList>;
  tableParameters!: TableLazyLoadEvent;
                           
  constructor(
    private pageService: ConsultantUnitMasterService,
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
      { data: 'ConsultantUnitCode', label: 'Code', customTemplate: this.consultantUnitCodeTemplate },
      { data: 'ConsultantUnitName', label: 'Consultant Unit Name', },
      { data: 'DepartmentName', label: 'Department' },
      { data: 'dtEffectiveFromDate', label: 'Effective From', cssClass: 'text-center', customTemplate: this.dtEffectiveFromDateTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.consultantUnitActiveStatusTemplate },
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ConsultantUnitMaster>());
    }
  }

  onClickEditDetails(ConsultantUnitID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && ConsultantUnitID) {
        this.pageService.GetDetails(ConsultantUnitID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ConsultantUnitMaster = {
                  ...response.Data,
                  dtEffectiveFromDate: DateUtils.toDate(response.Data.dtEffectiveFromDate)
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
        text: `Do you really want to ${ActionType} the "<b>${row.ConsultantUnitName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: ConsultantUnitMaster = {
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
