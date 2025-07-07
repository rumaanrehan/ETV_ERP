import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { FormService } from '../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { PortMaster, PortMaster_IndexFilter, PortMaster_IndexList } from '../port-master';
import { PortMasterService } from '../port-master.service';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('itemCategoryCodeTemplate', { static: true }) PortCodeTemplate!: TemplateRef<any>;
  @ViewChild('itemCategoryActiveStatusTemplate', { static: true }) itemCategoryActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<PortMaster_IndexList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: PortMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IMS_PortMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'Portcode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<PortMaster_IndexFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false,
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN',  width: "5%", hideVisToggle: true, orderable: false },
      { data: 'PortID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'PortCode', label: 'Code', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.PortCodeTemplate },
      { data: 'PortName', label: 'Port Name', filterable: true },
      { data: 'PortTypeName', label: ' Port Type', filterable: true },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "5%", customTemplate: this.itemCategoryActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false,  cssClass: 'text-center', width: "5%", customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<PortMaster>());
    }
  }

  onClickEditDetails(PortID: number, activeStatus: boolean) {
    console.log(PortID)
    try {
      if (this.createSidebar && PortID) {
        this.pageService
          .GetDetails(PortID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: PortMaster = {
                  ...response.Data,
                };
                this.createSidebar.openSidebar(activeStatus, true, model);
                
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) {}
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }  

  loadData() {
    try {
      const model: DataTableParams<PortMaster_IndexFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value,
      };
      this.pageService
        .PopulateGrid(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.tableDef.data = response.Data.Items;
              this.tableDef.totalRecords = response.Data.TotalRecords;
            } else {
              this.tableDef.data = [];
              this.tableDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.tableDef.loading = false;
          },
        });
    } catch (error) {}
    
  }

  onClickDeleteReactivate(row: any) {
    console.log(row)
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.PortName}</b>"?`,

      })

      .then((result) => {
        if (result.isConfirmed) {
          const model: PortMaster = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value,
          };

          this.pageService.DeleteReactivate(model)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.loadData();
                  this.alertService.showAlert({
                    type: 'success',
                    text: response.Message,
                    timer: 5000,
                  });
                } else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
      });
    } catch (error) {}
  }
}