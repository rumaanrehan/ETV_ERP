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
import { EmployeeLoan, EmployeeLoanList } from '../employee-loan';
import { EmployeeLoanService } from '../employee-loan.service';
import { DateUtils } from '../../../../../core/utility/date-utils';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, DatePipe, CommonModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('dtEmployeeLoanDateTemplate', { static: true }) dtEmployeeLoanDateTemplate!: TemplateRef<any>;
  @ViewChild('employeeLoanNoTemplate', { static: true }) employeeLoanNoTemplate!: TemplateRef<any>;
  @ViewChild('statusIDTemplate', { static: true }) statusIDTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;


  tableDef!: IndexTableParams<EmployeeLoanList>;
  tableParameters!: TableLazyLoadEvent;
  constructor(
    private pageService: EmployeeLoanService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
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
      { data: 'EmployeeLoanID', visible: false, orderable: false },
      { data: 'EmployeeLoanNo', label: 'Loan No', customTemplate: this.employeeLoanNoTemplate },
      { data: 'dtEmployeeLoanDate', label: 'Date', customTemplate: this.dtEmployeeLoanDateTemplate },
      { data: 'LoanTypeName', label: 'Loan Type' },
      { data: 'LoanAmount', label: 'Loan Amount', cssClass: 'text-end', orderable: false },
      { data: 'LoanPeriod', label: 'LoanPeriod', cssClass: 'text-center', orderable: false },
      { data: 'EmployeeCode', label: 'EmployeeCode' },
      { data: 'EmployeeName', label: 'Employee Name' },
      { data: 'EmployeeTypeName', label: 'Employee Type' },
      { data: 'DepartmentName', label: 'Department' },
      { data: 'StatusID', label: 'Status', cssClass: 'text-center', customTemplate: this.statusIDTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  onClickEditDetails(EmployeeLoanID: number) {
    if (EmployeeLoanID) {
      this.router.navigate([`HR/EmployeeLoan/Edit/${EmployeeLoanID}`]);
    }
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
              this.tableDef.data = response.Data.Items,
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
    this.router.navigate(['/HR/EmployeeLoan/Create']);
  }

  onClickDelete(row: any) {
    try {
      const ActionType = "Cancel";
      const inputPlaceholder = "Cancellation Reason";

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the Referred By Registration of : "<b>${row.EmployeeName}</b>"? This action cannot be undone.`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: EmployeeLoan = {
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

