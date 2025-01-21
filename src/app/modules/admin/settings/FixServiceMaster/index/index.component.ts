import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FixServiceMaster, FixServiceMasterList } from '../fix-service-master';
import { FixServiceMasterService } from '../fix-service-master.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('fixServiceCodeTemplate', { static: true }) fixServiceCodeTemplate!: TemplateRef<any>;
  @ViewChild('fixServiceFixedIDTemplate', { static: true }) fixServiceFixedIDTemplate!: TemplateRef<any>;
  @ViewChild('fixServiceName', { static: true }) fixServiceName!: TemplateRef<any>;
  @ViewChild('fixServiceActiveStatusTemplate', { static: true }) fixServiceActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<FixServiceMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private fixServiceMasterService: FixServiceMasterService,
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
      { data: 'FixServiceID', visible: false, orderable: false },
      { data: 'FixServiceCode', label: 'Code', customTemplate: this.fixServiceCodeTemplate },
      { data: 'FixedID', label: 'Fixed ID', cssClass: 'text-end', customTemplate: this.fixServiceFixedIDTemplate },
      { data: 'FixServiceName', label: 'Service Name', customTemplate: this.fixServiceName },
      { data: 'ServiceDescription', label: 'Description', orderable: false },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.fixServiceActiveStatusTemplate },
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

  loadData(event: TableLazyLoadEvent) {
    this.fixServiceMasterService.PopulateGrid(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            console.log(response.Data.Items);
            this.tableDef.totalRecords = response.Data.TotalRecords;
          }
          else {
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        }
      });
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(false);
    }
  }

  onClickEditDetails(FixServiceID: number) {
    if (FixServiceID) {
      this.fixServiceMasterService.GetDetails(FixServiceID).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.createSidebar.openSidebar(true, response.Data);
          } else {
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        },
      });
    }
  }

  onClickDelete(row: FixServiceMasterList) {
    const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
    const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
    this.alertService.showConfirmationWithInput({
      inputPlaceholder: inputPlaceholder,
      text: `Do you really want to ${ActionType} the "<b>${row.FixServiceName}</b>"?`,
    }).then(result => {
      if (result.isConfirmed) {
        const model: FixServiceMaster = {
          ...row,
          ActionType: ActionType,
          ReasonToUpdate: result.value
        };
        this.fixServiceMasterService.DeleteRecord(model)
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
                this.alertService.showServerResponseAlert({
                  Status: response.Status,
                  Message: response.Message,
                  ValidationErrors: response.ValidationErrors
                });
              }
            }
          });
      }
    });
  }

  onCloseSidebar(): void {
    this.loadData(this.tableParameters);
  }
   
}
