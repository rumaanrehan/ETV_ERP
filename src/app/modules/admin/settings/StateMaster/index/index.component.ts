import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
// import { stateMaster, stateMaster_IndexTableFilter, stateMaster_IndexTableList } from '../employee-type-master';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { StateMaster, StateMaster_IndexTableFilter, StateMaster_IndexTableList } from '../state-master';
import { StateMasterService } from '../state-master.service';
// import { stateMasterService } from '../employee-type-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
    @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
    @ViewChild('stateCodeTemplate', { static: true }) stateCodeTemplate!: TemplateRef<any>;
    @ViewChild('stateIsAllowedOverTimePayTemplate', { static: true }) stateIsAllowedOverTimePayTemplate!: TemplateRef<any>;
    @ViewChild('stateActiveStatusTemplate', { static: true }) stateActiveStatusTemplate!: TemplateRef<any>;
    @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
    @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<StateMaster_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageHeaderService: PageHeaderService,
    private pageService: StateMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'Admin_StateMaster_IndexTable',
      tableKey: 'Admin_StateMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'StateCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<StateMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      defaultSortColumn: { sortField: 'StateCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<StateMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'StateCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "8%", customTemplate: this.stateCodeTemplate },
      { data: 'StateName', label: 'State Name', filterable: true },
      { data: 'CountryName', label: 'Country Name', filterable: true, filterType: 'select', filterKey: 'CountryID', cssClass: 'text-center', width: "10%" },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.stateActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  OnClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(false, this.formService.createNullObject<StateMaster>());
    }
  }

  OnClickEditDetails(StateID: number): void {
    try {
      if (this.createSidebar && StateID) {
        this.pageService.GetDetails(StateID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.createSidebar.openSidebar(true, response.Data);
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
    this.loadData();
  }
  
  onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<StateMaster_IndexTableFilter> = {
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

  onClickDeleteReactivate(row: any): void {
  onClickDeleteReactivate(row: any): void {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.StateName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          const model: StateMaster = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value
          };
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.StateName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          const model: StateMaster = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value
          };

          this.pageService.DeleteReactivate(model)
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
          this.pageService.DeleteReactivate(model)
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