import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { Holiday_IndexTableFilter, Holiday_IndexTableList, HolidayMaster } from '../holiday-master';
import { HolidayMasterService } from '../holiday-master.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('holidayCodeTemplate', { static: true }) holidayCodeTemplate!: TemplateRef<any>;
  @ViewChild('holidayDateTemplate', { static: true }) holidayDateTemplate!: TemplateRef<any>;
  @ViewChild('holidayActiveStatusTemplate', { static: true }) holidayActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<Holiday_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: HolidayMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'Admin_HolidayMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'HolidayCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<Holiday_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'HolidayCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "7%", customTemplate: this.holidayCodeTemplate },
      { data: 'HolidayName', label: 'Holiday Name', filterable: true, width: "17%"},
      { data: 'HolidayYear', label: 'Holiday Year', filterable: true, width: "15%"},
      { data: 'HolidayTypeName', label: 'Holiday Type', filterable: true,filterType: 'select', filterKey: 'HolidayTypeID', width: "13%", cssClass: 'text-center'},
      { data: 'HolidayDate', label: 'Date', orderable: false, customTemplate: this.holidayDateTemplate },
      { data: 'HolidayDescription', label: 'Description', orderable: false },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.holidayActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<HolidayMaster>());
    }
  }

  onClickEditDetails(holidayID: number, activeStatus: boolean): void {
    try {
      console.log(holidayID);
      if (this.createSidebar && holidayID) {
        this.pageService.GetDetails(holidayID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              const model: HolidayMaster = {
                ...response.Data,
                HolidayDate: DateUtils.toDate(response.Data.HolidayDate)
              };
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
      const model: DataTableParams<Holiday_IndexTableFilter> = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.HolidayName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.HolidayID, result.value)
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
