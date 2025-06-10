import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { MenuMaster, MenuMaster_SelectList } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';
import { CreateComponent } from '../create/create.component';
import { CommonModule } from '@angular/common';
import { FormService } from '../../../../../shared/services/form.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  providers: [FormValidationService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('menuNameTemplate', { static: true }) menuNameTemplate!: TemplateRef<any>;
  @ViewChild('isDeveloperOnlyTemplate', { static: true }) isDeveloperOnlyTemplate!: TemplateRef<any>;
  @ViewChild('menuMasterActiveStatusTemplate', { static: true }) menuMasterActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<MenuMaster_SelectList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: MenuMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    // Send the template to the page header
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'MenuID', visible: false, orderable: false },
      { data: 'ModuleName', label: 'Module' },
      { data: 'MenuTypeName', label: 'Menu Type' },
      { data: 'ParentMenuName', label: 'Parent' },
      { data: 'MenuName', label: 'Menu Name', customTemplate: this.menuNameTemplate },
      { data: 'ControllerName', label: 'Controller', orderable: false },
      { data: 'ActionName', label: 'Action', orderable: false },
      { data: 'DisplayOrder', label: 'Display Order'},
      { data: 'IsDeveloperOnly', label: 'IsDeveloper', orderable: false, customTemplate: this.isDeveloperOnlyTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.menuMasterActiveStatusTemplate },
      //{ data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    // this.loadData();
  }

  onCloseSidebar(): void {
    // this.loadData();
  }

  // loadData() {
  //   try {
  //     this.pageService.PopulateGrid(any)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             this.tableDef.data = response.Data.Items;
  //             this.tableDef.totalRecords = response.Data.TotalRecords;
  //           }
  //           else {
  //             this.alertService.showServerResponseAlert(response);
  //           }
  //         },
  //         complete: () => {
  //           this.tableDef.loading = false;
  //         }
  //       });
  //   } catch (error) {

  //   }
  // }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<MenuMaster>());
    }
  }

  onClickEditDetails(MenuID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && MenuID) {
        this.pageService.GetDetails(MenuID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: MenuMaster = {
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

  onClickDelete(row: any) {
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
                    // this.loadData();
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
