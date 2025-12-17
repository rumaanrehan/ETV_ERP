import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ItemCategory_IndexFilter, ItemCategory_IndexList, ItemCategoryMaster } from '../item-category-master';
import { ItemCategoryMasterService } from '../item-category-master.service';

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
  @ViewChild('itemCategoryCodeTemplate', { static: true }) itemCategoryCodeTemplate!: TemplateRef<any>;
  @ViewChild('itemCategoryActiveStatusTemplate', { static: true }) itemCategoryActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<ItemCategory_IndexList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IMS_ItemCategoryMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ItemCategoryCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ItemCategory_IndexFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false,
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN',  width: "5%", hideVisToggle: true, orderable: false },
      { data: 'ItemCategoryID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'ItemCategoryCode', label: 'Code', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.itemCategoryCodeTemplate },
      { data: 'ItemCategoryName', label: 'Item Category Name', filterable: true },
      { data: 'ItemGroupName', label: 'Item Group Name', filterable: true },
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ItemCategoryMaster>());
    }
  }

  onClickEditDetails(itemCategoryID: number, activeStatus: boolean) {
    try {
      if (this.createSidebar && itemCategoryID) {
        this.pageService
          .GetDetails(itemCategoryID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
                console.log(response.Data)
                const model: ItemCategoryMaster = {
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
      const model: DataTableParams<ItemCategory_IndexFilter> = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.ItemCategoryName}</b>"?`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.ItemCategoryID!, result.value)
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
