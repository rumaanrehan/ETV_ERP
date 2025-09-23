import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { MenuMaster, MenuMaster_IndexTableFilter, MenuMaster_SelectList } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';
import { CreateComponent } from '../create/create.component';
import { FormService } from '../../../../../shared/services/form.service';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  providers: [FormValidationService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('menuNameTemplate', { static: true }) menuNameTemplate!: TemplateRef<any>;
  @ViewChild('isDeveloperOnlyTemplate', { static: true }) isDeveloperOnlyTemplate!: TemplateRef<any>;
  @ViewChild('menuActiveStatusTemplate', { static: true }) menuActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<MenuMaster_SelectList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: MenuMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'Admin_MenuMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'MenuType', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<MenuMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'MenuID', label: 'Menu ID', visible: false, hideVisToggle: true, orderable: false},
      { data: 'ModuleName', label: 'Module', filterable: true },
      { data: 'MenuTypeName', label: 'Menu Type', filterable: true },
      { data: 'MenuName', label: 'Menu Name', filterable: true, customTemplate: this.menuNameTemplate },
      { data: 'ParentMenuName', label: 'Parent', filterable: true },
      { data: 'ControllerName', label: 'Controller', filterable: true, orderable: false },
      { data: 'ActionName', label: 'Action', orderable: false },
      { data: 'DisplayOrder', label: 'Display Order' },
      { data: 'IsDeveloperOnly', label: 'IsDeveloper', orderable: false, customTemplate: this.isDeveloperOnlyTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.menuActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<MenuMaster>());
    }
  }
  
  onClickEditDetails(menuID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && menuID) {
        this.pageService.GetDetails(menuID)
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
      const model: DataTableParams<MenuMaster_IndexTableFilter> = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.MenuName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          const model: MenuMaster = {
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
