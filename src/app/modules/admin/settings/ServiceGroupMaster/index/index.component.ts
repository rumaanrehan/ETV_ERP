import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ServiceGroupMaster, ServiceGroupMasterList } from '../service-group-master';
import { ServiceGroupMasterService } from '../service-group-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService]
})
export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('serviceGroupCodeTemplate', { static: true }) serviceGroupCodeTemplate!: TemplateRef<any>;
  @ViewChild('serviceGroupShortCodeTemplate', { static: true }) serviceGroupShortCodeTemplate!: TemplateRef<any>;
  @ViewChild('serviceGroupActiveStatusTemplate', { static: true }) serviceGroupActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<ServiceGroupMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: ServiceGroupMasterService,
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
      { data: 'ServiceGroupID', visible: false, orderable: false },
      { data: 'ServiceGroupCode', label: 'Code', customTemplate: this.serviceGroupCodeTemplate },
      { data: 'ServiceGroupName', label: 'Service Group Name' },
      { data: 'ShortCode', label: 'Short Code', cssClass: 'text-center',orderable: false, customTemplate: this.serviceGroupShortCodeTemplate },
      { data: 'ServiceGroupType', label: 'Type' },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.serviceGroupActiveStatusTemplate },
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ServiceGroupMaster>());
    }
  }

  onClickEditDetails(ServiceGroupID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && ServiceGroupID) {
        this.pageService.GetDetails(ServiceGroupID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ServiceGroupMaster = {
                  ...response.Data,
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
        text: `Do you really want to ${ActionType} the "<b>${row.ServiceGroupName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: ServiceGroupMaster = {
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
