import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FinYearMaster, FinYearMasterList } from '../fin-year-master';
import { FinYearMasterService } from '../fin-year-master.service';
import { CreateComponent } from '../create/create.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormService } from '../../../../../shared/services/form.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  providers: [FormValidationService, DatePipe]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('financialYearCodeTemplate', { static: true }) financialYearCodeTemplate!: TemplateRef<any>;
  @ViewChild('finYearStartDateTemplate', { static: true }) finYearStartDateTemplate!: TemplateRef<any>;
  @ViewChild('finYearEndDateTemplate', { static: true }) finYearEndDateTemplate!: TemplateRef<any>;
  @ViewChild('financialYearActiveStatusTemplate', { static: true }) financialYearActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<FinYearMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: FinYearMasterService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  //  private datePipe: DatePipe
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
      { data: 'FinYearID', visible: false, orderable: false },
      { data: 'FinYearCode', label: 'Code', customTemplate: this.financialYearCodeTemplate },
      { data: 'FinYearName', label: 'Financial Year' },
      { data: 'FinYearStartDate', label: 'Start Date', orderable: false, customTemplate: this.finYearStartDateTemplate },
      { data: 'FinYearEndDate', label: 'End Date', orderable: false, customTemplate: this.finYearEndDateTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.financialYearActiveStatusTemplate },
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
    } catch (error) {

    }
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<FinYearMaster>());
    }
  }

  onClickEditDetails(FinYearID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && FinYearID) {
        this.pageService.GetDetails(FinYearID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: FinYearMaster = {
                  ...response.Data,
                  FinYearStartDate: DateUtils.toDate(response.Data.FinYearStartDate),
                  FinYearEndDate: DateUtils.toDate(response.Data.FinYearEndDate)
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
        text: `Do you really want to ${ActionType} the "<b>${row.FinYearName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: FinYearMaster = {
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
