import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ManufacturerMaster, Manufacturer_IndexTableFilter, Manufacturer_IndexTableList } from '../manufacturer-master';
import { ManufacturerMasterService } from '../manufacturer-master.service';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})

export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('manufacturerCodeTemplate', { static: true }) manufacturerCodeTemplate!: TemplateRef<any>;
  @ViewChild('manufacturerActiveStatusTemplate', { static: true }) manufacturerActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<Manufacturer_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ManufacturerMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'IMS_ManufacturerMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ManufacturerCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<Manufacturer_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'ManufacturerCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.manufacturerCodeTemplate },
      { data: 'ManufacturerName', label: 'Manufacturer Name', width: "50%", filterable: true },
      { data: 'ShortCode', label: 'Short Code', width: "15%", orderable: false },
      { data: 'ActiveStatus', label: 'Status', width: "15%", filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.manufacturerActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate },
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

  onClickEditDetails(manufacturerID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && manufacturerID) {
        this.pageService.GetDetails(manufacturerID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.createSidebar.openSidebar(activeStatus, true, response.Data);
              } else {
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
      const model: DataTableParams<Manufacturer_IndexTableFilter> = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.ManufacturerName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.ManufacturerID!, result.value)
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

