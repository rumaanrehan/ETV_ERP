import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { Environment } from '../../../../../../environments/environment';
import { ZDialogComponent } from '../../../../../shared/components/z-dialog/z-dialog.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
// // import { CountryMasterSelectListResponse } from '../../../settings/country-master/country-master';
// import { DepartmentMasterSelectListResponse } from '../../../settings/department-master/department-master';
// import { DesignationMasterSelectListResponse } from '../../../settings/designation-master/designation-master';
// import { EmployeeTypeMasterSelectListResponse } from '../../../settings/employee-type-master/employee-type-master';
// import { PrefixMasterSelectListResponse } from '../../../settings/prefix-master/prefix-master';
// import { RelationshipMasterSelectListResponse } from '../../../settings/relationship-master/relationship-master';
// import { RoleMasterSelectListResponse } from '../../../settings/role-master/role-master';
// import { StateMasterSelectListResponse } from '../../../settings/state-master/state-master';
// import { EmployeeRegistration, EmployeeRegistrationSelectListRequest, EmployeeRegistrationFileUpload } from '../../employee-registration/employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { EmployeeRegistration, EmployeeRegistrationFileUpload, EmployeeRegistrationSelectListRequest } from '../employee-registration';
import { CountryMaster } from '../../country-master/country-master';
import { State_SelectList } from '../../StateMaster/state-master';
import { EmployeeTypeMaster_SelectList } from '../../EmployeeTypeMaster/employee-type-master';
import { DepartmentMaster_SelectList } from '../../DepartmentMaster/department-master';
import { DesignationMaster_SelectList } from '../../DesignationMaster/designation-master';
// import { WithPagePermissions } from '../../../../../core/base/with-page-permissions';


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

  isDialogOpen: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;

  /** file upload */
  fileUpload!: FormGroup;
  formConfig!: FormConfigType<EmployeeRegistration>;

  /** page list */
  countryList: CountryMaster[] = [];
  stateList: State_SelectList[] = [];
  defaultCountryID: number | null = null;
  defaultStateID: number | null = null;
  countryPermanentList: CountryMaster[] = [];
  statePermanentList: State_SelectList[] = [];
  defaultPermanentCountryID: number | null = null;
  defaultPermanentStateID: number | null = null;
  relationshipList: any[] = [];
  employeeTypeList: EmployeeTypeMaster_SelectList[] = [];
  departmentList: DepartmentMaster_SelectList[] = [];
  designationList: DesignationMaster_SelectList[] = [];
  // roleList: any[] = [];
  // reportingToList: EmployeeRegistrationSelectListRequest[] = [];

  /** selectlist */
  // genderList: StaticList[] = [];
  // maritalStatusList: StaticList[] = [];
  // bloodGroupList: StaticList[] = [];
  // categoryList: StaticList[] = [];
  signatoryAreaList: StaticList[] = [];
  
  genderList: any[] = [
    { GenderID: 1, GenderName: 'Male' },
    { GenderID: 3, GenderName: 'FeMale' },
    { GenderID: 1, GenderName: 'Other' },
  ];
  
  bloodGroupList: any[] = [
    { BloodGroupID: 'A+', BloodGroupName: 'A+' },
    { BloodGroupID: 'A-', BloodGroupName: 'A-' },
    { BloodGroupID: 'B+', BloodGroupName: 'B+' },
    { BloodGroupID: 'B-', BloodGroupName: 'B-' },
  ];
  prefixList: any[] = [
   { PrefixID: 'Mr', PrefixName: 'Mr' },
   { PrefixID: 'Mrs', PrefixName: 'Mrs' },
   { PrefixID: 'Miss', PrefixName: 'Miss' },
   { PrefixID: 'Dr', PrefixName: 'Dr' },
   { PrefixID: 'Prof', PrefixName: 'Prof' },
  ];
categoryList: any[] = [
  { CategoryID: 1, CategoryName: 'Electronics' },
  { CategoryID: 2, CategoryName: 'Books' },
  { CategoryID: 3, CategoryName: 'Clothing' },
  { CategoryID: 4, CategoryName: 'Home & Kitchen' },
];
roleList: any[] = [
  { RoleID: 1, RoleName: 'Admin' },
  { RoleID: 2, RoleName: 'Editor' },
  { RoleID: 3, RoleName: 'Viewer' },
  { RoleID: 4, RoleName: 'Contributor' },
];
maritalStatusList: any[] = [
  { MaritalStatusID: 1, MaritalStatusName: 'Single' },
  { MaritalStatusID: 2, MaritalStatusName: 'Married' },
  { MaritalStatusID: 3, MaritalStatusName: 'Divorced' },
  { MaritalStatusID: 4, MaritalStatusName: 'Widowed' },
  { MaritalStatusID: 5, MaritalStatusName: 'Separated' },
];

reportingToList: any[] = [
  { EmployeeID: 101, EmployeeName: 'Alice Johnson' },
  { EmployeeID: 102, EmployeeName: 'Bob Smith' },
  { EmployeeID: 103, EmployeeName: 'Carlos Martinez' },
  { EmployeeID: 104, EmployeeName: 'Diana Lee' },
];

  
  
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

  OnClickPageHeaderBackToListButton(): void {
    this.alertService.showConfirmation({
      type: "info",
      text: `Are you sure want to go back to the Index Page?`,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/Admin/EmployeeRegistration']);
      }
    });
  }

  ResetForm(): void {
    this.alertService.showConfirmation({
      type: "info",
      text: `Are you sure you want to reset the page?`,
    }).then(result => {
      if (result.isConfirmed) {
        this.ngOnInit();
        // this.formService.resetFormValue<EmployeeRegistration>(this.formConfig, this.form);
        this.form.patchValue({
          EmployeeCountryID: this.defaultCountryID,
          PermanentCountryID: this.defaultPermanentCountryID,
        });
        // this.LoadState();
        // this.LoadPermanentState();
      }
    });
  }

  ShowDialog(type: string): void {
    // this.dialogType = type;
    this.isDialogOpen = true;
  }

  OnClickCancel(): void {
    this.isDialogOpen = false;
    this.fileUpload.get('File')?.reset();
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
          if (data.CountryList.IsSuccess) {
            this.countryList = data.CountryList.Data.Items;
          }
          if (data.StateList.IsSuccess) {
            this.stateList = data.StateList.Data.Items;
          }
          if (data.DesignationList.IsSuccess) {
            this.designationList = data.DesignationList.Data.Items;
          }
        },
      });
  }

  OnChangeCountry(): void {
    try {
      const selectedCountryID = this.form.value.EmployeeCountryID
      if (!selectedCountryID) {
        this.stateList = [];
        return;
      }
      // this.LoadState();
    } catch (error) {
    }
  }

  OnChangeCountryPermanent(): void {
    try {
      const selectedCountryID = this.form.value.PermanentCountryID
      if (!selectedCountryID) {
        this.statePermanentList = [];
        return;
      }
      // this.LoadPermanentState();
    } catch (error) {

    }
  }

  OnChangeCanAccessERP(): void {
    const CanAccessERP = this.form.value.CanAccessERP;
    if (!CanAccessERP) {
      this.form.get('RoleID')?.setValue(null);
      this.form.get('RoleID')?.disable();
    }
    else {
      this.form.get('RoleID')?.enable();
    }
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
                this.router.navigate(['/Admin/EmployeeRegistration']);
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
      const EmployeeID = +params['id'];
      if (EmployeeID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(EmployeeID).subscribe(
            response => {
              if (response.IsSuccess) {
                const model = {
                  ...response.Data,
                  DOB: DateUtils.toDate(response.Data.DOB),
                  DOJ: DateUtils.toDate(response.Data.DOJ)
                };
                this.form.patchValue(model);
                this.LoadDropdownList();
                if (model.DifferentPermanentAddress) {
                  this.LoadDropdownList();
                }
              } else {
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
