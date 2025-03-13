import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams, DataTableColumnDef } from '../../../shared/components/z-datatable/z-datatable';
import { Subject, takeUntil } from 'rxjs';
import { ManufacturerMaster, ManufacturerMaster_IndexTableList, ManufacturerMaster_IndexTableFilter } from '../manufacturer-master';
import { ManufacturerMasterService } from '../manufacturer-master.service';
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
  @ViewChild('ManufacturerCodeTemplate', { static: true }) ManufacturerCodeTemplate!: TemplateRef<any>;
  @ViewChild('ManufacturerNameTemplate', { static: true }) ManufacturerNameTemplate!: TemplateRef<any>;
  @ViewChild('isActiveTemplate', { static: true }) isActiveTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ManufacturerMaster_IndexTableList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private router: Router,
    private manufacturerService: ManufacturerMasterService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'Admin_ManufacturerMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ManufacturerName', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ManufacturerMaster_IndexTableFilter>(this.manufacturerService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', orderable: false },
      { data: 'ManufacturerCode', label: 'Manufacturer Code', customTemplate: this.ManufacturerCodeTemplate },
      { data: 'ManufacturerName', label: 'Manufacturer Name', customTemplate: this.ManufacturerNameTemplate },
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ManufacturerMaster>());
    }
  }
  onClickEditDetails(ManufacturerID: number, ActiveStatus: boolean) {
    // this.router.navigate([`/ManufacturerMaster/Edit/${ManufacturerId}`]);
    try {
      if (this.createSidebar && ManufacturerID) {
        this.manufacturerService.GetDetails(ManufacturerID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ManufacturerMaster = {
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
      const model: DataTableParams<ManufacturerMaster_IndexTableFilter> = {
        first: this.tableParameters.first,
        last: this.tableParameters.last,
        sortField: this.tableParameters.sortField,
        sortOrder: this.tableParameters.sortOrder,
        filters: this.tableDef.filterForm?.value
      };
      this.manufacturerService.PopulateGrid(model)
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
      console.log("Could not load Manufacturer Data!")
    }
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.ManufacturerName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: ManufacturerMaster = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value
            };

            this.manufacturerService.DeleteReactivate(model)
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

