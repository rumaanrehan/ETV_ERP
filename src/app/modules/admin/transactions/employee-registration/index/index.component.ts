import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { EmployeeRegistration_IndexTableFilter, EmployeeRegistration_IndexTableList } from '../employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ZDataTable, CommonModule, RouterLink],
  providers: []
})

export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('employeeCodeTemplate', { static: true }) employeeCodeTemplate!: TemplateRef<any>;
  @ViewChild('canAccessERPTemplate', { static: true }) canAccessERPTemplate!: TemplateRef<any>;
  @ViewChild('employeeActiveStatusTemplate', { static: true }) employeeActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<EmployeeRegistration_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageService: EmployeeRegistrationService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'Admin_EmployeeRegistration_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'EmployeeCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<EmployeeRegistration_IndexTableFilter>(this.pageService.GetFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false },
      { data: 'EmployeeID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'EmployeeCode', label: 'Code', hideVisToggle: true, filterable: true, width: "5%", customTemplate: this.employeeCodeTemplate },
      { data: 'EmployeeName', label: 'Employee Name', filterable: true },
      { data: 'MobileNo', label: 'Mobile No', orderable: false, filterable: true },
      { data: 'EmployeeTypeName', label: 'Company Type', width: "15%", filterable: true, filterType: 'select', filterKey: 'EmployeeTypeID' },

      // { data: 'DepartmentName', label: 'Department', filterable: true, filterType: 'select', filterKey: 'DepartmentID', cssClass: 'text-center' },
      // { data: 'DesignationName', label: 'Designation', filterable: true, filterType: 'select', filterKey: 'DesignationID', cssClass: 'text-center' },
      // { data: 'CanAccessERP', label: 'ERP Access', orderable: false, filterable: true, filterType: 'select', filterKey: 'CanAccessERP', cssClass: 'text-center', customTemplate: this.canAccessERPTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/admin/employee-registration/create']);
  }

  onClickEditDetails(employeeID: number): void {
    if (employeeID) {
      this.router.navigate([`/admin/employee-registration/edit/${employeeID}`]);
    }
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<EmployeeRegistration_IndexTableFilter> = {
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
}
