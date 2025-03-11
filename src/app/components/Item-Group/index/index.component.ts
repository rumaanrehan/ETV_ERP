import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams, DataTableColumnDef } from '../../../shared/components/z-datatable/z-datatable';
import { Subject, takeUntil } from 'rxjs';
import { ItemGroup, ItemGroup_IndexTableList, ItemGroup_IndexTableFilter } from '../item-group';
import { ItemGroupService } from '../item-group.service';
import { IndexTableComponent, IndexTableParams } from '../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { FormService } from '../../../shared/services/form.service';
import { PageHeaderService } from '../../../shared/services/page-header.service';
import { Router } from '@angular/router';
import { CreateComponent } from '../create/create.component';
import { CommonModule } from '@angular/common';
import { ZDataTable } from '../../../shared/components/z-datatable/z-datatable.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, IndexTableComponent, CreateComponent, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService],
})


export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showCreateSidebar = false;
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  // @ViewChild('createSidebar', { static: false }) createSidebar!: CreateComponent;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;
  @ViewChild('ItemGroupCodeTemplate', { static: true }) ItemGroupCodeTemplate!: TemplateRef<any>;
  @ViewChild('ItemGroupNameTemplate', { static: true }) ItemGroupNameTemplate!: TemplateRef<any>;
  @ViewChild('isActiveTemplate', { static: true }) isActiveTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ItemGroup_IndexTableList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private router: Router,
    private itemGroupService: ItemGroupService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'Admin_ItemGroup_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ItemGroupName', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ItemGroup_IndexTableFilter>(this.itemGroupService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', orderable: false },
      { data: 'ItemGroupCode', label: 'Item-Group Code', customTemplate: this.ItemGroupCodeTemplate },
      { data: 'ItemGroupName', label: 'Item-Group Name', customTemplate: this.ItemGroupNameTemplate },
      { data: 'isActive', label: 'Status', cssClass: 'text-center', customTemplate: this.isActiveTemplate, },
      { data: 'actions', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ItemGroup>());
    }
  }
  onClickEditDetails(ItemGroupID: number, ActiveStatus: boolean) {
    // this.router.navigate([`/ManufacturerMaster/Edit/${ManufacturerId}`]);
    try {
      if (this.createSidebar && ItemGroupID) {
        this.itemGroupService.GetDetails(ItemGroupID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ItemGroup = {
                  ...response.Data
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

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadData();
  }

  onCloseSidebar(): void {
    // this.showCreateSidebar = false;
    this.loadData();
  }

  loadData() {
    try {
      const model: DataTableParams<ItemGroup_IndexTableFilter> = {
        first: this.tableParameters.first,
        last: this.tableParameters.last,
        sortField: this.tableParameters.sortField,
        sortOrder: this.tableParameters.sortOrder,
        filters: this.tableDef.filterForm?.value
      };
      this.itemGroupService.PopulateGrid(model)
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
      console.log("Could not load Item-Group Data!")
    }
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.ItemGroupName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: ItemGroup = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value
            };

            this.itemGroupService.DeleteReactivate(model)
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


