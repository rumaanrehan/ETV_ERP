import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { DataTableFilterList } from '../../../../../shared/models/select-list';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { Department_IndexTableList, Department_IndexTableFilter, DepartmentMaster } from '../department-master';
import { DepartmentMasterService } from '../department-master.service';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('departmentCodeTemplate', { static: true }) departmentCodeTemplate!: TemplateRef<any>;
  @ViewChild('departmentActiveStatusTemplate', { static: true }) departmentActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<Department_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: DepartmentMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'Admin_DepartmentMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'DepartmentCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<Department_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'DepartmentCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "8%", customTemplate: this.departmentCodeTemplate },
      { data: 'DepartmentName', label: 'Department Name', filterable: true },
      { data: 'ShortCode', label: 'Short Code', orderable: false, width: "10%" },
      { data: 'DepartmentType', label: 'Department Type', filterable: true, width: "10%" },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.departmentActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<DepartmentMaster>());
    }
  }

  onClickEditDetails(departmentID: number, activeStatus: boolean): void {
      try {
        if (this.createSidebar && departmentID) {
          this.pageService.GetDetails(departmentID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.createSidebar.openSidebar(activeStatus, true, response.Data);
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
      const model: DataTableParams<Department_IndexTableFilter> = {
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
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.DepartmentName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          const model: DepartmentMaster = {
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
  }
}
