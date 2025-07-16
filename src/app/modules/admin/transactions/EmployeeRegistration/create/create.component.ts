import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ZDialogComponent } from '../../../../../shared/components/z-dialog/z-dialog.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { Country_SelectList } from '../../../settings/country-master/country-master';
import { Department_SelectList } from '../../../settings/department-master/department-master';
import { Designation_SelectList } from '../../../settings/designation-master/designation-master';
import { EmployeeType_SelectList } from '../../../settings/employee-type-master/employee-type-master';
import { State_SelectList } from '../../../settings/state-master/state-master';
import { EmployeeRegistration, EmployeeRegistrationSelectListRequest } from '../../employee-registration/employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZDialogComponent, TooltipModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})

export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<EmployeeRegistration>;

  /** page list */
  countryList: Country_SelectList[] = [];
  stateList: State_SelectList[] = [];
  defaultCountryID: number | null = null;
  defaultStateID: number | null = null;
  countryPermanentList: any[] = [];
  statePermanentList: any[] = [];
  defaultPermanentCountryID: number | null = null;
  defaultPermanentStateID: number | null = null;
  relationshipList: any[] = [];
  employeeTypeList: EmployeeType_SelectList[] = [];
  departmentList: Department_SelectList[] = [];
  designationList: Designation_SelectList[] = [];

  /** selectlist */
  
   prefixList: any[] = [
  { Prefix: 'MR', PrefixName: 'MR' },
  { Prefix: 'MRS', PrefixName: 'MRS' },
  { Prefix: 'Other', PrefixName: 'Other' }
];

  genderList: any[] = [
  { iValue: 1, Text: 'Male' },
  { iValue: 2, Text: 'Female' },
  { iValue: 3, Text: 'Other' }
];
  maritalStatusList: any[] = [
    { iValue: 1, Text: 'Single' },
    { iValue: 2, Text: 'Married' },
    { iValue: 3, Text: 'Divorced' }
  ];
  bloodGroupList: any[] = [
    { TextID: 'A+', Text: 'A+' },
    { TextID: 'B+', Text: 'B+' },
    { TextID: 'Other', Text: 'Other' }
  ];
   categoryList: any[] = [
  { iValue: 1, Text: 'Electronics' },
  { iValue: 2, Text: 'Clothing' },
  { iValue: 3, Text: 'Books' },
  { iValue: 4, Text: 'Home & Kitchen' },
  { iValue: 5, Text: 'Beauty' }
];
 roleList: any[] = [
  { RoleID: 1, RoleName: 'Admin' },
  { RoleID: 2, RoleName: 'Manager' },
  { RoleID: 3, RoleName: 'Employee' },
  { RoleID: 4, RoleName: 'Viewer' },
  { RoleID: 5, RoleName: 'Auditor' }
];
reportingToList: any[] = [
  { EmployeeID: 1, EmployeeName: 'MS Dhoni'},
  { EmployeeID: 2, EmployeeName: 'Virat'},
  { EmployeeID: 1, EmployeeName: 'Rahane'},
]

  signatoryAreaList: any[] = [ ];

  constructor(
    private pageService: EmployeeRegistrationService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.GetFormConfig();
    this.form = this.formService.createFormGroup<EmployeeRegistration>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.GetDetails();
    this.LoadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  OnClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/EmployeeRegistration/Index']);
  }

  ResetForm(): void {
  }

  LoadDropdownList(): void {

    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data.EmployeeTypeList.IsSuccess) {
            this.employeeTypeList = data.EmployeeTypeList.Data.Items;
          }
          if (data.DepartmentList.IsSuccess) {
            this.departmentList = data.DepartmentList.Data.Items;
          }
          if (data.DesignationList.IsSuccess) {
            this.designationList = data.DesignationList.Data.Items;
          }
          if (data.CountryList.IsSuccess) {
            this.countryList = data.CountryList.Data.Items;
          }
          if (data.StateList.IsSuccess) {
            this.stateList = data.StateList.Data.Items;
          }
        },
      });
  }

  OnSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;

    try {
      // Handle invalid form
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }

      // Handle form submission based on editMode
      if (this.isEditMode) {
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            const model: EmployeeRegistration = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.UpdateRecord(model);
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.CreateRecord(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  CreateRecord(model: EmployeeRegistration): void {
    try {
      this.pageService.CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              });
              setTimeout(() => {
                this.ngOnInit();
              }, 2000);
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {

    }
  }

  UpdateRecord(model: EmployeeRegistration): void {
    try {
      this.pageService.UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              });
              setTimeout(() => {
                this.router.navigate(['/Admin/EmployeeRegistration/Index']);
              }, 2000);
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {

    }
  }

  GetDetails(): void {
    this.route.params.subscribe((params) => {
      if (+params['id']) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(+params['id']).subscribe(
            response => {
              if (response.IsSuccess) {
                const model = {
                  ...response.Data,
                  DOB: DateUtils.toDate(response.Data.DOB),
                  DOJ: DateUtils.toDate(response.Data.DOJ)
                };
                this.form.patchValue(model);
              } 
              else {
                this.alertService.showServerResponseToast(response);
              }
            },
          );
        }
        catch (error) {
        }
      }
    });
  }
}
