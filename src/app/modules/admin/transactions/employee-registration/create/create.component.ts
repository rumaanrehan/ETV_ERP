import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
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
import { EmployeeRegistration } from '../../employee-registration/employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, TooltipModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})

export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  // isDialogOpen: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<EmployeeRegistration>;
  // fileUpload!: FormGroup;

  countryList: Country_SelectList[] = [];
  stateList: State_SelectList[] = [];
  // defaultCountryID: number | null = null;
  // defaultStateID: number | null = null;

  employeeTypeList: EmployeeType_SelectList[] = [];
  departmentList: Department_SelectList[] = [];
  designationList: Designation_SelectList[] = [];
  signatoryAreaList: StaticList[] = [];
  
  genderList: any[] = [
    { GenderID: 1, GenderName: 'Male' },
    { GenderID: 3, GenderName: 'FeMale' },
    { GenderID: 1, GenderName: 'Other' },
  ]

  bloodGroupList: StaticList[] = [
    { Text: "A+", iValue: 1, cValue: "A+" },
    { Text: "A-", iValue: 2, cValue: "A-" },
    { Text: "B+", iValue: 3, cValue: "B+" },
    { Text: "B-", iValue: 4, cValue: "B-" },
    { Text: "AB+", iValue: 5, cValue: "AB+" },
    { Text: "AB-", iValue: 6, cValue: "AB-" },
    { Text: "O+", iValue: 7, cValue: "O+" },
    { Text: "O-", iValue: 8, cValue: "O-" }
  ];

  prefixList: StaticList[] = [
    { Text: "Mr", iValue: 1, cValue: "Mr" },
    { Text: "Mrs", iValue: 2, cValue: "Mrs" },
    { Text: "Miss", iValue: 3, cValue: "Miss" },
    { Text: "Dr", iValue: 4, cValue: "Dr" },
    { Text: "Prof", iValue: 5, cValue: "Prof" }
  ];

  roleList: StaticList[] = [
    { Text: "Admin", iValue: 1, cValue: "Admin" },
    { Text: "Editor", iValue: 2, cValue: "Editor" },
    { Text: "Viewer", iValue: 3, cValue: "Viewer" },
    { Text: "Contributor", iValue: 4, cValue: "Contributor" }
  ];

  maritalStatusList: StaticList[] = [
    { Text: "Single", iValue: 1, cValue: "Single" },
    { Text: "Married", iValue: 2, cValue: "Married" },
    { Text: "Divorced", iValue: 3, cValue: "Divorced" },
    { Text: "Widowed", iValue: 4, cValue: "Widowed" },
    { Text: "Separated", iValue: 5, cValue: "Separated" }
  ];

  reportingToList: StaticList[] = [
    { Text: "Alice Johnson", iValue: 101, cValue: "Alice Johnson" },
    { Text: "Bob Smith", iValue: 102, cValue: "Bob Smith" },
    { Text: "Carlos Martinez", iValue: 103, cValue: "Carlos Martinez" },
    { Text: "Diana Lee", iValue: 104, cValue: "Diana Lee" }
  ];

  relationshipList: StaticList[] = [
    { Text: "Father", iValue: 1, cValue: "Father" },
    { Text: "Mother", iValue: 2, cValue: "Mother" },
    { Text: "Brother", iValue: 3, cValue: "Brother" },
    { Text: "Sister", iValue: 4, cValue: "Sister" },
    { Text: "Spouse", iValue: 5, cValue: "Spouse" },
    { Text: "Son", iValue: 6, cValue: "Son" },
    { Text: "Daughter", iValue: 7, cValue: "Daughter" },
    { Text: "Friend", iValue: 8, cValue: "Friend" },
    { Text: "Guardian", iValue: 9, cValue: "Guardian" },
    { Text: "Other", iValue: 10, cValue: "Other" }
  ];
  
  constructor(
    private pageService: EmployeeRegistrationService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
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
    this.router.navigate(['/admin/employee-registration']);
  }

  // OnClickPageHeaderBackToListButton(): void {
  //   this.alertService.showConfirmation({
  //     type: "info",
  //     text: `Are you sure want to go back to the Index Page?`,
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       this.router.navigate(['/admin/employee-registration']);
  //     }
  //   });
  // }

  ResetForm(): void {
    this.alertService.showConfirmation({
      type: "info",
      text: `Are you sure you want to reset the page?`,
    }).then(result => {
      if (result.isConfirmed) {
        this.ngOnInit();
      }
    });
  }

  // ShowDialog(type: string): void {
  //   // this.dialogType = type;
  //   this.isDialogOpen = true;
  // }

  // OnClickCancel(): void {
  //   this.isDialogOpen = false;
  //   this.fileUpload.get('File')?.reset();
  // }

  LoadDropdownList(): void {
    this.pageService.GetMasterDropdownLists()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        if (data.employeeTypeList.IsSuccess) {
          this.employeeTypeList = data.employeeTypeList.Data.Items;
        }
        if (data.departmentList.IsSuccess) {
          this.departmentList = data.departmentList.Data.Items;
        }
        if (data.countryList.IsSuccess) {
          this.countryList = data.countryList.Data.Items;
        }
        if (data.stateList.IsSuccess) {
          this.stateList = data.stateList.Data.Items;
        }
        if (data.designationList.IsSuccess) {
          this.designationList = data.designationList.Data.Items;
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
        // this.statePermanentList = [];
        return;
      }
      // this.LoadPermanentState();
    } catch (error) {

    }
  }

  OnChangeCanAccessERP(): void {
    const CanAccessERP = this.form.value.CanAccessERP;
    if (CanAccessERP == false) {
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
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }

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
                this.router.navigate(['/admin/employee-registration']);
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
                console.log(response.Data);
                const model = {
                  ...response.Data,
                  DOB: DateUtils.toDate(response.Data.DOB),
                  DOJ: DateUtils.toDate(response.Data.DOJ)
                };
                this.form.patchValue(model);
                this.LoadDropdownList();
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

  terminateEmployee(): void {
    try {
      this.alertService.showConfirmationWithInput({
        text: 'Do you really want to Terminate?',
      }).then(result => {
        if (result.isConfirmed) {
          const model: EmployeeRegistration = {
            ...this.formService.transformFormData(this.form.value),
            ActionType: "Terminate",
            ReasonForTermination: result.value
          };
          this.pageService.TerminateEmployee(model)
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
                this.router.navigate(['/admin/employee-registration']);
              }, 2000);
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