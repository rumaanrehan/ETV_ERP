import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { DepartmentMaster, DepartmentMaster_IndexTableFilter, DepartmentMaster_IndexTableList, DepartmentMaster_SelectList } from '../department-master';
import { DepartmentMasterService } from '../department-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('departmentCodeTemplate', { static: true }) departmentCodeTemplate!: TemplateRef<any>;
  @ViewChild('departmentActiveStatusTemplate', { static: true }) departmentActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<DepartmentMaster_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;
  parentDepartmentList: DepartmentMaster_SelectList[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: DepartmentMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'Admin_DepartmentMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'DepartmentCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<DepartmentMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'DepartmentCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "8%", customTemplate: this.departmentCodeTemplate },
      { data: 'DepartmentName', label: 'Department Name', filterable: true },
      { data: 'ShortCode', label: 'Short Code', orderable: false, cssClass: 'text-center', width: "6%"  },
      { data: 'ParentDepartmentName', label: 'Parent Department Name', filterable: true, width: "15%" },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.departmentActiveStatusTemplate, },
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
  
  onClickEditDetails(departmentID: number, activeStatus: boolean) {
    try {
      if (this.createSidebar && departmentID) {
        this.pageService
          .GetDetails(departmentID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: DepartmentMaster = {
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
      const model: DataTableParams<DepartmentMaster_IndexTableFilter> = {
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
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.DepartmentName}</b>"?`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const model: DepartmentMaster = {
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
