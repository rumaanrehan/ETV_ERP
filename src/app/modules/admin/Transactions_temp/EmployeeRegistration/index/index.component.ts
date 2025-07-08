import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { EmployeeRegistration, EmployeeRegistrationList } from '../employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';


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
  @ViewChild('employeeCodeTemplate', { static: true }) employeeCodeTemplate!: TemplateRef<any>;
  @ViewChild('employeeTypeNameTemplate', { static: true }) employeeTypeNameTemplate!: TemplateRef<any>;
  @ViewChild('departmentNameTemplate', { static: true }) departmentNameTemplate!: TemplateRef<any>;
  @ViewChild('designationNameTemplate', { static: true }) designationNameTemplate!: TemplateRef<any>;
  @ViewChild('canAccessERPTemplate', { static: true }) canAccessERPTemplate!: TemplateRef<any>;
  @ViewChild('employeeActiveStatusTemplate', { static: true }) employeeActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<EmployeeRegistrationList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: EmployeeRegistrationService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
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
      { data: 'EmployeeID', visible: false, orderable: false },
      { data: 'EmployeeCode', label: 'Code', customTemplate: this.employeeCodeTemplate },
      { data: 'EmployeeName', label: 'Employee Name' },    
      { data: 'MobileNo', label: 'Mobile No' },
      { data: 'EmployeeTypeName', label: 'Employee Type', cssClass: 'text-center', customTemplate: this.employeeTypeNameTemplate },
      { data: 'DepartmentName', label: 'Department Name', cssClass: 'text-center', customTemplate: this.departmentNameTemplate},
      { data: 'DesignationName', label: 'Designation Name', cssClass: 'text-center', customTemplate: this.designationNameTemplate },
      { data: 'CanAccessERP', label: 'ERP Access', cssClass: 'text-center', customTemplate: this.canAccessERPTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.employeeActiveStatusTemplate },
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
    try {
      this.pageService.PopulateGrid(event)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.tableDef.data = response.Data.Items;
              this.tableDef.totalRecords = response.Data.TotalRecords;
            }
            else {
              this.alertService.showServerResponseAlert(response);
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

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/EmployeeRegistration/Create']);
  }

  onClickEditDetails(EmployeeID: number) {
    if (EmployeeID) {
      this.router.navigate([`Admin/EmployeeRegistration/Edit/${EmployeeID}`]);
    }
  }


  onClickDelete(row: any) {
    try {
      const ActionType = "Cancel";
      const inputPlaceholder = "Cancellation Reason";

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the Employee Registration of : "<b>${row.EmployeeName}</b>"? This action cannot be undone.`,
      })
        .then(result => {
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
                    this.loadData(this.tableParameters);
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

