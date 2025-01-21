import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { HolidayMaster } from '../../HolidayMaster/holiday-master';
import { HolidayMasterList } from '../../HolidayMaster/holiday-master';
import { HolidayMasterService } from '../../HolidayMaster/holiday-master.service';
import { CreateComponent } from '../create/create.component';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  providers: [FormValidationService, DatePipe]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('holidayCodeTemplate', { static: true }) holidayCodeTemplate!: TemplateRef<any>;
  @ViewChild('holidayDateTemplate', { static: true }) holidayDateTemplate!: TemplateRef<any>;
  @ViewChild('holidayActiveStatusTemplate', { static: true }) holidayActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<HolidayMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private holidayService: HolidayMasterService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'HolidayID', visible: false, orderable: false },
      { data: 'HolidayCode', label: 'Code', customTemplate: this.holidayCodeTemplate },
      { data: 'HolidayName', label: 'Holiday Name' },
      { data: 'HolidayYear', label: 'Year', orderable: false },
      { data: 'HolidayTypeName', label: 'Holiday Type', orderable: false },
      { data: 'HolidayDate', label: 'Date', orderable: false, customTemplate: this.holidayDateTemplate },
      { data: 'HolidayDescriptions', label: 'Descriptions', orderable: false },
      { data: 'ActiveStatus', label: 'Status', orderable: false, cssClass: 'text-center', customTemplate: this.holidayActiveStatusTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadData(this.tableParameters);
  }

  loadData(event: TableLazyLoadEvent) {
    this.holidayService.PopulateGrid(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          }
          else {
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        }
      });
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      // this.createSidebar.openSidebar(false);
    }
  }

  onClickEditDetails(HolidayID: number) {
    if (this.createSidebar) {
      // this.createSidebar.openSidebar(true);
    }
    if (HolidayID) {
      this.holidayService.GetDetails(HolidayID).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            // this.createSidebar.openSidebar(true, response.Data);
          }
        },
      });
    }
  }

  onCloseSidebar(): void {
    this.loadData(this.tableParameters);
  }

  onClickDelete(row: HolidayMasterList) {
    const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
    const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

    // this.alertService.showConfirmationWithInput({
    //   inputPlaceholder: inputPlaceholder,
    //   text: `Do you really want to ${ActionType} the "<b>${row.HolidayName}</b>"?`,
    // }).then(result => {
    //   if (result.isConfirmed) {
    //     const model: HolidayMaster = {
    //       ...row,
    //       ActionType: ActionType,
    //       ReasonToUpdate: result.value
    //     };
    //     this.holidayService.DeleteRecord(model)
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe({
    //         next: (response) => {
    //           if (response.IsSuccess) {
    //             this.loadData(this.tableParameters);
    //             this.alertService.showAlert({
    //               type: "success",
    //               text: response.Message,
    //               timer: 5000
    //             });
    //           }
    //           else {
    //             this.alertService.showServerResponseAlert({
    //               Status: response.Status,
    //               Message: response.Message,
    //               ValidationErrors: response.ValidationErrors
    //             });
    //           }
    //         }
    //       });
    //   }
    // });
  }
}
