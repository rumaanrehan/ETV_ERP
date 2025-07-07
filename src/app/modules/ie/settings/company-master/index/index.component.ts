import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { Company_IndexTableFilter, Company_IndexTableList, CompanyMaster } from '../company-master';
import { TableLazyLoadEvent } from 'primeng/table';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CompanyMasterService } from '../company-master.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('companyCodeTemplate', { static: true }) companyCodeTemplate!: TemplateRef<any>;
  @ViewChild('companyTypeTemplate', { static: true }) companyTypeTemplate!: TemplateRef<any>;
  @ViewChild('companyActiveStatusTemplate', { static: true }) companyActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<Company_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: CompanyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IE_CompanyMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'CompanyCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<Company_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'CompanyCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.companyCodeTemplate },
      { data: 'CompanyName', label: 'Company Name', width: "15%", filterable: true },
      { data: 'CompanyTypeName', label: 'Company Type', width: "15%", filterable: true, filterType: 'select', filterKey: 'CompanyTypeID', customTemplate: this.companyTypeTemplate },
      { data: 'CompanyEmailID', label: 'EmailID', width: "20%" },
      { data: 'ImportLicenseNo', label: 'Import License No', width: "20%" },
      { data: 'ActiveStatus', label: 'Status', width: "10%", filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.companyActiveStatusTemplate},
      { data: '', hideVisToggle: true, orderable: false, width: "6%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<CompanyMaster>());
    }
  }

  onClickEditDetails(companyID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && companyID) {
        this.pageService.GetDetails(companyID)
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
      const model: DataTableParams<Company_IndexTableFilter> = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.CompanyName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          const model: CompanyMaster = {
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
