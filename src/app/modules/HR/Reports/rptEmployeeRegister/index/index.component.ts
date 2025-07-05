import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from "../../../../../shared/components/index-table/index-table.component";
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ZFormControlsModule } from "../../../../../shared/components/z-form-controls/z-form-controls.module";
import { FormConfigType } from "../../../../../shared/models/form.model";
import { AlertNotificationService } from "../../../../../shared/services/alert-notification.service";
import { FormService } from "../../../../../shared/services/form.service";
import { PageHeaderService } from "../../../../../shared/services/page-header.service";
import { EmployeeRegistrationList } from "../../../../admin/Transactions/EmployeeRegistration/employee-registration";
import { EmployeeRegistrationService } from "../../../../admin/Transactions/EmployeeRegistration/employee-registration.service";
// import { DepartmentMasterList } from "../../../../admin/settings/DepartmentMaster/department-master";
import { DepartmentMasterService } from "../../../../admin/settings/DepartmentMaster/department-master.service";
import { DesignationMaster_SelectList } from "../../../../admin/settings/DesignationMaster/designation-master";
import { DesignationMasterService } from "../../../../admin/settings/DesignationMaster/designation-master.service";
import { SelectList } from "../../../../admin/settings/SelectList/select-list";
import { SelectListService } from "../../../../admin/settings/SelectList/select-list.service";
import { rptEmployeeRegister, rptEmployeeRegisterDetails } from "../rpt-employee-register";
import { rptEmployeeRegisterService } from "../rpt-employee-register.service";
import { EmployeeTypeMasterService } from "../../../../admin/settings/EmployeeTypeMaster/employee-type-master.service";
import { EmployeeTypeMaster_SelectList } from "../../../../admin/settings/EmployeeTypeMaster/employee-type-master";
import { DepartmentMaster_SelectList } from "../../../../admin/settings/DepartmentMaster/department-master";

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, DatePipe, CommonModule, ReactiveFormsModule, ZFormControlsModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('employeeCodeTemplate', { static: true }) employeeCodeTemplate!: TemplateRef<any>;
  @ViewChild('genderTemplate', { static: true }) genderTemplate!: TemplateRef<any>;
  @ViewChild('statusTextTemplate', { static: true }) statusTextTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<rptEmployeeRegisterDetails>;
  tableParameters!: TableLazyLoadEvent;

  form!: FormGroup;
  formConfig!: FormConfigType<rptEmployeeRegister>;
  EmployeeTypeList: EmployeeTypeMaster_SelectList[] = []; 
  DepartmentList: DepartmentMaster_SelectList[] = []; 
  DesignationList: DesignationMaster_SelectList[] = []; 
  DateRangeList: SelectList[] = []; 
  GroupByList: SelectList[] = []; 
  StatusTextList: SelectList[] = []; 
  constructor(
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private pageService: rptEmployeeRegisterService,
    private formBuilder: FormBuilder,
    private SearchByService: rptEmployeeRegisterService,
    private employeeTypeMasterService: EmployeeTypeMasterService, 
    private departmentMasterService: DepartmentMasterService, 
    private designationMasterService: DesignationMasterService, 
    private selectListService: SelectListService, 
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<rptEmployeeRegister>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadGroupBy('GroupBy'); 
    this.loadEmployeeType(); 
    this.loadDepartment(); 
    this.loadDesignation(); 
    this.loadDateRange('DateRange_SearchBy'); 
    this.loadStatusText('StatusText'); 

    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'EmployeeTypeID', visible: false, orderable: false },
      { data: 'EmployeeCode', label: 'Code', customTemplate: this.employeeCodeTemplate },
      { data: 'EmployeeName', label: 'Name' },
      { data: 'Gender', label: 'Gender', orderable: false, customTemplate: this.genderTemplate },
      { data: 'DOB', label: 'DOB', orderable: false },
      { data: 'MobileNo', label: 'Mobile No', orderable: false },
      { data: 'EmployeePANNo', label: 'PAN No', orderable: false },
      { data: 'DOJ', label: 'DOJ', orderable: false, cssClass: 'text-center' },
      { data: 'Duration', label: 'Duration', orderable: false, cssClass: 'text-center' },
      { data: 'EmployeeTypeName', label: 'Employee Type' },
      { data: 'DepartmentName', label: 'Department' },
      { data: 'DesignationName', label: 'Designation' },
      { data: 'BiometricID', label: 'BiometricID', orderable: false },
      { data: 'GrossPay', label: 'GrossPay', orderable: false, cssClass: 'text-center' },
      { data: 'StatusText', label: 'Status', cssClass: 'text-center', customTemplate: this.statusTextTemplate },

    ];
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

  loadGroupBy(FieldName: string) {
    try {
      this.selectListService.PopulateList('HR', 'rptEmployeeRegister', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.GroupByList = response.Data.Items;
            }
            console.log(this.GroupByList);
          },
        });
    }
    catch (error) {
    }
  }

  loadEmployeeType(): void {
    try {
      this.employeeTypeMasterService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.EmployeeTypeList = response.Data.Items;
          }
          else {
            this.EmployeeTypeList = [];
          }
        },
      });
    }
    catch (error) {
    }
  }

  loadDepartment(): void {
    try {
      this.departmentMasterService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.DepartmentList = response.Data.Items;
          }
          else {
            this.DepartmentList = [];
          }
        },
      });
    }
    catch (error) {
    }
  }

  loadDesignation(): void {
    try {
      this.designationMasterService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.DesignationList = response.Data.Items;
          }
          else {
            this.DesignationList = [];
          }
        },
      });
    }
    catch (error) {
    }
  }

  loadDateRange(FieldName: string) {
    try {
      this.selectListService.PopulateList('HR', 'rptEmployeeRegister', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.DateRangeList = response.Data.Items;
            }
            console.log(this.DateRangeList);
          },
        });
    }
    catch (error) {
    }
  }
  loadStatusText(FieldName: string) {
    try {
      this.selectListService.PopulateList('HR', 'rptEmployeeRegister', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StatusTextList = response.Data.Items;
            }
            console.log(this.StatusTextList);
          },
        });
    }
    catch (error) {
    }
  }

}

