import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { EmployeeRegistration, EmployeeRegistrationIndexTableRequest, EmployeeRegistrationIndexTableResponse } from '../employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';


@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ZDataTable, CommonModule],
  providers: [FormValidationService]
})

export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('employeeCodeTemplate', { static: true }) employeeCodeTemplate!: TemplateRef<any>;
  @ViewChild('canAccessERPTemplate', { static: true }) canAccessERPTemplate!: TemplateRef<any>;
  @ViewChild('employeeTypeActiveStatusTemplate', { static: true }) employeeTypeActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<EmployeeRegistrationIndexTableResponse>;
  tableEvent!: DataTableLazyLoadEvent;

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
      filterForm: this.formService.createFormGroup_DataTableFilter<EmployeeRegistrationIndexTableRequest>(this.pageService.GetFormConfig_DataTableFilter()),
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
      { data: 'EmployeeTypeName', label: 'Employee Type', filterable: true, filterType: 'select', filterKey: 'EmployeeTypeID' ,cssClass: 'text-center' },
      { data: 'DepartmentName', label: 'Department', filterable: true, filterType: 'select', filterKey: 'DepartmentID', cssClass: 'text-center'},
      { data: 'DesignationName', label: 'Designation', filterable: true, filterType: 'select', filterKey: 'DesignationID', cssClass: 'text-center'},
      // { data: 'CanAccessERP', label: 'ERP Access', orderable: false, filterable: true, filterType: 'select', filterKey: 'CanAccessERP', cssClass: 'text-center', customTemplate: this.canAccessERPTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "5%", customTemplate: this.employeeTypeActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "1%", customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  OnClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/EmployeeRegistration/Create']);
  }

  OnClickEditDetails(EmployeeID: number) {
    if (EmployeeID) {
      this.router.navigate([`Admin/EmployeeRegistration/Edit/${EmployeeID}`]);
    }
  }

  OnIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.LoadData();
  }

  LoadData() {
    try {
      const model: DataTableParams<EmployeeRegistrationIndexTableRequest> = {
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

  OnClickDelete(row: any) {
    try {

      const ActionType = "Cancel";
      const inputPlaceholder = "Cancellation Reason";

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the Employee Registration of : "<b>${row.EmployeeName}</b>"? This action cannot be undone.`,
      }).then(result => {
        if (result.isConfirmed) {
          const model: EmployeeRegistration = {
            ...row,
            ActionType: ActionType,
            CancellationReason: result.value
          };

          this.pageService.DeleteRecord(model)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.LoadData();
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
