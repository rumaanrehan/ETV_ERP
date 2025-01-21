import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ReportTemplateMaster, ReportTemplateMasterList } from '../report-template';
import { ReportTemplateService } from '../report-template.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('reportTemplateCodeTemplate', { static: true }) reportTemplateCodeTemplate!: TemplateRef<any>;
  @ViewChild('planreportTemplateActiveStatusTemplate', { static: true }) planreportTemplateActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<ReportTemplateMasterList>;
  tableParameters!: TableLazyLoadEvent;
  constructor(
    private pageService: ReportTemplateService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
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
      { data: 'ReportTemplateID', visible: false, orderable: false },
      { data: 'ReportTemplateCode', label: 'Code', customTemplate: this.reportTemplateCodeTemplate },
      { data: 'ReportTemplateName', label: 'Report Template Name' },
      { data: 'ServiceCategoryName', label: 'Service Category Name' },
      { data: 'ServiceName', label: 'Service Name' },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.planreportTemplateActiveStatusTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  onClickEditDetails(ReportTemplateID: number) {
    if (ReportTemplateID) {
      this.router.navigate([`LB/ReportTemplateMaster/Edit/${ReportTemplateID}`]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
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
    this.router.navigate(['/LB/ReportTemplateMaster/Create']);
  }

  onClickDelete(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to <b>${ActionType.toUpperCase()} </b> the "<b>${row.ReportTemplateName}</b>"?`,
      }).then(result => {
        if (result.isConfirmed) {
          const model: ReportTemplateMaster = {
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
