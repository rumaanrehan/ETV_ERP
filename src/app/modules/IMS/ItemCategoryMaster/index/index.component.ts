import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { FormService } from '../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { CreateComponent } from '../create/create.component';
import { ItemCategoryMasterService } from '../item-category-master.service';
import { ZDataTable } from '../../../../shared/components/z-datatable/z-datatable.component';
import { ItemCategoryMaster_IndexList, ItemCategoryMaster_IndexFilter, ItemCategoryMaster } from '../item-category-master';

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
  @ViewChild('pageHeaderActionTemplate', { static: true })
  pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('itemCategoryCodeTemplate', { static: true }) itemCategoryCodeTemplate!: TemplateRef<any>;
  @ViewChild('itemCategoryActiveStatusTemplate', { static: true }) itemCategoryActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  // CategroyNameTemplate!: TemplateRef<any>;

  // @ViewChild('CategoryTypeTemplate', { static: true })
  // CategoryTypeTemplate!: TemplateRef<any>;
  // @ViewChild('CreatedByDateInTemplate', { static: true })
  // CreatedDateTime!: TemplateRef<any>;

  // @ViewChild('ModifyByDateInTemplate', { static: true })
  // ModifiedDateTime!: TemplateRef<any>;

  // @ViewChild('actionColTemplate', { static: true })
  // actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ItemCategoryMaster_IndexList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IMS_ItemCategoryMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ItemCategoryCode', sortOrder: 1 },
      filterForm:
        this.formService.createFormGroup_DataTableFilter<ItemCategoryMaster_IndexFilter>(
          this.pageService.getFormConfig_DataTableFilter()
        ),
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
      { data: 'ActiveStatus', label: 'Status',filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "5%", customTemplate: this.itemCategoryActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false,  cssClass: 'text-center', width: "5%", customTemplate: this.actionColTemplate }
    ];
     // this.tableDef.columnDef = [
    //   {
    //     data: 'RowID',
    //     label: 'SN',
    //     width: '1%',
    //     hideVisToggle: true,
    //     orderable: false,
    //   },
    //   {
    //     data: 'ItemCategoryID',
    //     visible: false,
    //     hideVisToggle: true,
    //     orderable: false,
    //   },
    //   {
    //     data: 'ItemCategoryCode',
    //     label: 'Code',
    //     hideVisToggle: true,
    //     filterable: true,
    //     width: '5%',
    //     customTemplate: this.itemCategoryCodeTemplate,
    //   },
    //   {
    //     data: 'ItemCategoryName',
    //     label: 'Item Category Name',
    //     filterable: true,
    //   },
    //   { data: 'ItemGroupName', label: 'Item Group Name', filterable: true },
    //   {
    //     data: 'ActiveStatus',
    //     label: 'Status',
    //     filterable: true,
    //     filterType: 'select',
    //     filterKey: 'ActiveStatusID',
    //     cssClass: 'text-center',
    //     width: '5%',
    //     customTemplate: this.itemCategoryActiveStatusTemplate,
    //   },
    //   {
    //     data: '',
    //     hideVisToggle: true,
    //     orderable: false,
    //     cssClass: 'text-center',
    //     width: '1%',
    //     customTemplate: this.actionColTemplate,
    //   },
    // ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(
        false,
        this.formService.createNullObject<ItemCategoryMaster>()
      );
    }
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  loadData() {
    try {
      const model: DataTableParams<ItemCategoryMaster_IndexFilter> = {
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
              console.log(this.tableDef.data);
              console.log(response.Data.Items);
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

  onClickEditDetails(ItemCategoryID: number) {
    try {
      if (this.createSidebar && ItemCategoryID) {
        this.pageService
          .GetDetails(ItemCategoryID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ItemCategoryMaster = {
                  ...response.Data,
                };
                this.createSidebar.openSidebar(true, model);
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) {}
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus
        ? 'Reason To Delete'
        : 'Reason To Reactivate';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to ${ActionType} the "<b>${row.ItemCategoryName}</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ItemCategoryMaster = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.pageService
              .DeleteRecord(model)
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

  // loadCategory(tableParameters: TableLazyLoadEvent) {
  //   // this.tableDef.loading = true;
  //   console.log(tableParameters)
  //   this.componentService
  //     .PopulateGrid(tableParameters)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
  //           this.tableDef.data = response.Data.Items;
  //           this.tableDef.totalRecords = response.Data.TotalRecords;
  //         } else {
  //           this.alertService.showServerResponseAlert(response);
  //         }
  //       },
  //       complete: () => {
  //         this.tableDef.loading = false;
  //       },
  //     });
  // }

  // onIndexTableLazyLoad(event: TableLazyLoadEvent) {
  //   this.tableParameters = event;
  //   this.loadCategory(this.tableParameters);
  // }

  // onClickEditDetails(categoryCode: string, ActiveStatus: boolean) {
  //   this.createSidebar.Id = Number(categoryCode);
  //   console.log(categoryCode, '......edit is clickd');
  //   // this.router.navigate([`/IMS/CategoryMaster/Edit/${categoryCode}`]);
  //   try {
  //     if (this.createSidebar && categoryCode) {
  //       this.componentService
  //         .GetDetails(categoryCode)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe({
  //           next: (response) => {
  //             if (response.IsSuccess) {
  //               const model: CategoryMaster = {
  //                 ...response.Data,
  //               };
  //               this.createSidebar.openSidebar(ActiveStatus, true, model);
  //               console.log('sidebar opened');
  //             } else {
  //               this.alertService.showServerResponseAlert(response);
  //             }
  //           },
  //         });
  //     }
  //   } catch (error) { }
  // }

  // onCloseSidebar(): void {
  //   this.loadCategory(this.tableParameters);
  // }

  // onClickDelete(category: any) {
  //   console.log('I want to delete this: ' + category.CategoryID);
  //   try {
  //     const ActionType = 'Delete';
  //     const inputPlaceholder = 'Reason to Delete';

  //     this.alertService
  //       .showConfirmationWithInput({
  //         inputPlaceholder: inputPlaceholder,
  //         text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${category.CategoryName
  //           }</b>"?`,
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           const model: CategoryMaster = {
  //             ...category,
  //             ActionType: ActionType,
  //             ReasonToUpdate: result.value,
  //           };

  //           this.componentService
  //             .DeleteCategory(category.CategoryID)
  //             .pipe(takeUntil(this.destroy$))
  //             .subscribe({
  //               next: (response) => {
  //                 this.loadCategory(this.tableParameters);
  //                 if (response.IsSuccess) {
  //                   // this.loadCategory();//============
  //                   this.alertService.showAlert({
  //                     type: 'success',
  //                     text: response.Message,
  //                     timer: 5000,
  //                   });
  //                 } else {
  //                   this.alertService.showServerResponseAlert(response);
  //                 }
  //               },
  //               error: (err) => {
  //                 console.error('Error deleting product:', err);
  //                 this.alertService.showAlert({
  //                   type: 'error',
  //                   text: 'Failed to delete product. Please try again later.',
  //                   timer: 5000,
  //                 });
  //               },
  //             });
  //         }
  //       });
  //   } catch (error) {
  //     console.error('Error in onClickDelete:', error);
  //   }
  // }
}
