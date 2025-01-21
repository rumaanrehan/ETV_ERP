import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ServiceMaster, ServiceMasterList } from '../service-master';
import { ServiceMasterService } from '../service-master.service';

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
  @ViewChild('serviceCodeTemplate', { static: true }) serviceCodeTemplate!: TemplateRef<any>;
  @ViewChild('serviceActiveStatusTemplate', { static: true }) serviceActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<ServiceMasterList>;
  tableParameters!: TableLazyLoadEvent;
  constructor(
    private pageService: ServiceMasterService,
    private pageHeaderService: PageHeaderService,
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
      { data: 'ServiceID', visible: false, orderable: false },
      { data: 'ServiceCode', label: 'Code', customTemplate: this.serviceCodeTemplate },
      { data: 'ServiceName', label: 'Service Name' },
      { data: 'TestTypeName', label: 'Test Type' },
      { data: 'ServiceCategoryName', label: 'Category' },
      { data: 'SIUnit', label: 'SI Unit', orderable: false },
      { data: 'ResultTypeName', label: 'Report Type' },
      { data: 'CreatedBy', label: 'Created By', orderable: false },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.serviceActiveStatusTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/LB/ServiceMaster/Create']);
  }

  onClickEditDetails(ServiceID: number) {
    if (ServiceID) {
      this.router.navigate([`LB/ServiceMaster/Edit/${ServiceID}`]);
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
              console.log(response.Data.Items);
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

  onClickDelete(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.ServiceName}</b>"?`,
      }).then(result => {
        if (result.isConfirmed) {
          const model: ServiceMaster = {
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
