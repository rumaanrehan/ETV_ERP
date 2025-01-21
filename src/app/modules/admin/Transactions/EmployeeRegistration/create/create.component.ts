import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Environment } from '../../../../../../environments/environment';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { CountryMasterList } from '../../../settings/country-master/country-master';
import { CountryMasterService } from '../../../settings/country-master/country-master.service';
import { DepartmentMasterList } from '../../../settings/DepartmentMaster/department-master';
import { DepartmentMasterService } from '../../../settings/DepartmentMaster/department-master.service';
import { DesignationMasterList } from '../../../settings/DesignationMaster/designation-master';
import { DesignationMasterService } from '../../../settings/DesignationMaster/designation-master.service';
import { EmployeeTypeMasterList } from '../../../settings/EmployeeTypeMaster/employee-type-master';
import { EmployeeTypeMasterService } from '../../../settings/EmployeeTypeMaster/employee-type-master.service';
import { PrefixMasterList } from '../../../settings/PrefixMaster/prefix-master';
import { PrefixMasterService } from '../../../settings/PrefixMaster/prefix-master.service';
import { RelationshipMasterList } from '../../../settings/RelationshipMaster/relationship-master';
import { RelationshipMasterService } from '../../../settings/RelationshipMaster/relationship-master.service';
import { RoleMasterList } from '../../../settings/RoleMaster/role-master';
import { RoleMasterService } from '../../../settings/RoleMaster/role-master.service';
import { SelectList } from '../../../settings/SelectList/select-list';
import { SelectListService } from '../../../settings/SelectList/select-list.service';
import { StateMasterList } from '../../../settings/StateMaster/state-master';
import { StateMasterService } from '../../../settings/StateMaster/state-master.service';
import { EmployeeRegistration, EmployeeRegistrationList, FileUpload } from '../employee-registration';
import { EmployeeRegistrationService } from '../employee-registration.service';

// employee

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CalendarModule, StepperModule, FieldsetModule, ZFormControlsModule, DialogModule, FloatLabelModule, InputTextModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  visible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false; // for button disabled
  form!: FormGroup;
  forms!: FormGroup;
  formConfig!: FormConfigType<EmployeeRegistration>;
  formConfigs!: FormConfigType<FileUpload>;
  PrefixList: PrefixMasterList[] = [];
  GenderList: SelectList[] = [];
  MaritalStatusList: SelectList[] = [];
  BloodGroupList: SelectList[] = [];
  CountryList: CountryMasterList[] = [];
  StateList: StateMasterList[] = [];
  defaultCountryID: number | null = null;
  defaultStateID: number | null = null;
  CountryPermanentList: CountryMasterList[] = [];
  StatePermanentList: StateMasterList[] = [];
  defaultPermanentCountryID: number | null = null;
  defaultPermanentStateID: number | null = null;
  RelationshipList: RelationshipMasterList[] = [];
  CategoryList: SelectList[] = [];
  EmployeeTypeList: EmployeeTypeMasterList[] = [];
  DepartmentList: DepartmentMasterList[] = [];
  DesignationList: DesignationMasterList[] = [];
  SignatoryAreaList: SelectList[] = [];
  RoleList: RoleMasterList[] = [];
  ReportingToList: EmployeeRegistrationList[] = [];
  EmployeeID: number | null = null;
  activeStepIndex: number = 0;
  ImagerUrl: string | null = null;
  img: string = '/assets/SignatureImage/Camera.jpg';
  private apiUrl: string | null = null;

  constructor(
    private pageService: EmployeeRegistrationService,
    private selectListService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private pageHeaderService: PageHeaderService,
    private router: Router,
    private prefixMasterService: PrefixMasterService,
    private stateService: StateMasterService,
    private countryService: CountryMasterService,
    private relationshipService: RelationshipMasterService,
    private employeeTypeService: EmployeeTypeMasterService,
    private departmentService: DepartmentMasterService,
    private designationService: DesignationMasterService,
    private roleService: RoleMasterService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<EmployeeRegistration>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    // file
    this.formConfigs = this.pageService.getFileConfig();
    this.forms = this.formService.createFormGroup<FileUpload>(this.formConfigs);
    this.formService.initializeFormValidationMessage(this.formConfigs, this.forms);
    this.apiUrl = Environment.apiUrl;


    this.loadSelectListData('Gender', 'GenderList');
    this.loadSelectListData('BloodGroup', 'BloodGroupList');
    this.loadSelectListData('MaritalStatus', 'MaritalStatusList');
    this.loadSelectListData('EmployeeCategory', 'CategoryList');
    this.loadSelectListData('SignatoryArea', 'SignatoryAreaList');
    this.loadAllCommanSelectListData();
    this.getDetails();
    this.loadCountry();
    this.loadPermanentCountry();
    this.canAccessERPDisable();
  }

  canAccessERPDisable() {
    this.form.get('CanAccessERP')?.valueChanges.subscribe((isChecked) => {
      this.toggleCanAccessERPDropdown(isChecked);
    });
    const copyRateChecked = this.form.get('CanAccessERP')?.value;
    this.toggleCanAccessERPDropdown(copyRateChecked);
  }

  toggleCanAccessERPDropdown(isChecked: boolean): void {
    const canAccessERPControl = this.form.get('RoleID');
    if (isChecked) {
      canAccessERPControl?.enable();
    } else {
      canAccessERPControl?.disable();
      canAccessERPControl?.reset();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    }

  getCurrentStepControls(): { [key: string]: AbstractControl } {
    switch (this.activeStepIndex) {
      case 0:
        return {
          EmployeePrefix: this.form.get('EmployeePrefix')!,
          EmployeeName: this.form.get('EmployeeName')!,
          Gender: this.form.get('Gender')!,
          DOB: this.form.get('DOB')!,
          MaritalStatus: this.form.get('MaritalStatus')!,
          MobileNo: this.form.get('MobileNo')!,
          AlternateMobileNo: this.form.get('AlternateMobileNo')!,
          EmailID: this.form.get('EmailID')!,
          EmployeeAadhaarNo: this.form.get('EmployeeAadhaarNo')!,
          EmployeePANNo: this.form.get('EmployeePANNo')!,
          EmployeeAddress: this.form.get('EmployeeAddress')!,
          EmployeeCity: this.form.get('EmployeeCity')!,
          EmployeeStateID: this.form.get('EmployeeStateID')!,
          EmployeeCountryID: this.form.get('EmployeeCountryID')!,
          EmployeePinCode: this.form.get('EmployeePinCode')!,
          PermanentAddress: this.form.get('PermanentAddress')!,
          PermanentCity: this.form.get('PermanentCity')!,
          PermanentStateID: this.form.get('PermanentStateID')!,
          PermanentCountryID: this.form.get('PermanentCountryID')!,
          PermanentPinCode: this.form.get('PermanentPinCode')!,
          EmergencyContactName: this.form.get('EmergencyContactName')!,
          EmergencyContactMobileNo: this.form.get('EmergencyContactMobileNo')!,
        };
      case 1:
        return {
          EmployeeCategory: this.form.get('EmployeeCategory')!,
          EmployeeTypeID: this.form.get('EmployeeTypeID')!,
          DOJ: this.form.get('DOJ')!,
          DepartmentID: this.form.get('DepartmentID')!,
          DesignationID: this.form.get('DesignationID')!,
        };
      case 2:
        return {
          RoleID: this.form.get('RoleID')!,
        };
      default:
        return {};
    }
  }

  nextStep(nextCallback: any): void {

    try {

      const currentStepControls = this.getCurrentStepControls();
      const invalidControls = Object.keys(currentStepControls).filter(control => currentStepControls[control].invalid);

      if (invalidControls.length > 0) {

        // Validate based on the active step
        if (this.activeStepIndex === 0) {
          invalidControls.forEach(control => {
            this.form.controls[control].markAsTouched();
          });
          this.formService.validateFormFields(this.formConfig, this.form);
          this.alertService.showValidationAlert();

        } else if (this.activeStepIndex === 1) {
          invalidControls.forEach(control => {
            this.form.controls[control].markAsTouched();
          });
          this.formService.validateFormFields(this.formConfig, this.form);
          this.alertService.showValidationAlert();

        } else if (this.activeStepIndex === 2) {
          invalidControls.forEach(control => {
            this.form.controls[control].markAsTouched();
            this.onSubmit();
          });
          this.formService.validateFormFields(this.formConfig, this.form);
          this.alertService.showValidationAlert();
        }
        return;
      }
      if (this.activeStepIndex === 2) {
       // this.onSubmit();
        return;
      }
      if (nextCallback) {
        nextCallback.emit();
      }
      this.activeStepIndex++;
    } catch (error) {

    }
  
  }

  prevStep(prevCallback: any): void {
    try {
      if (this.activeStepIndex > 0) {
        this.activeStepIndex--;
        prevCallback.emit();
      }
    } catch (error) {

    }

  
  }

  onSubmit(): void {
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
            this.updateRecord(model);
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.createRecord(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  createRecord(model: EmployeeRegistration): void {
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

  updateRecord(model: EmployeeRegistration): void {
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


  getDetails(): void {
    try {
      this.route.params.subscribe(params => {
        this.EmployeeID = +params['id'];
        if (this.EmployeeID) {
          this.isEditMode = true;
          this.defaultCountryID = null;
          this.defaultStateID = null;
          this.defaultPermanentCountryID = null;
          this.defaultPermanentStateID = null;
          this.pageService.GetDetails(this.EmployeeID).subscribe(
            response => {
              if (response.IsSuccess) {
                const model = {
                  ...response.Data,
                  model: response.Data,
                  EmployeeCountryID: response.Data.EmployeeCountryID,
                  EmployeeStateID: response.Data.EmployeeStateID,
                  PermanentCountryID: response.Data.PermanentCountryID,
                  PermanentStateID: response.Data.PermanentStateID,
                  DOB: DateUtils.toDate(response.Data.DOB),
                  DOJ: DateUtils.toDate(response.Data.DOJ)
                };

                // Patch the form with the employee's details
                this.form.patchValue({
                  ...model,
                  EmployeeCountryID: model.EmployeeCountryID,
                  EmployeeStateID: model.EmployeeStateID,
                  PermanentCountryID: model.PermanentCountryID,
                  PermanentStateID: model.PermanentStateID,
                });

                // Set the image URL
                this.ImagerUrl = response.Data.ConsultantSignatureImagePath;
                this.ConsultantSignatureImagePath();
                this.loadState(model.EmployeeCountryID, true, model.EmployeeStateID);
               // this.loadPermanentState(model.PermanentCountryID, model.PermanentStateID);
              } else {
                this.alertService.showServerResponseAlert({
                  Status: response.Status,
                  Message: response.Message,
                  ValidationErrors: response.ValidationErrors,
                });
              }
            },
          );
        }
      });
    } catch (error) {
    }
  }

  ConsultantSignatureImagePath() {
    if (this.ImagerUrl && !this.ImagerUrl.startsWith('https')) {
      const baseUrl = this.apiUrl ? this.apiUrl.replace('/api', '') : '';
      this.ImagerUrl = `${baseUrl}${this.ImagerUrl}?t=${new Date().getTime()}`;
    } else {
      this.ImagerUrl = this.ImagerUrl;
    }
  }

  onFileSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files[0]) {
        const file = input.files[0];

        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImagerUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.forms.get('File')?.setValue(file);
      }
    } catch (error) {

    }
   
  
  }

  onUpload(): void {
    try {
      // Handle invalid form
      if (this.forms.invalid || !this.forms.get('File')?.value) {
        this.forms.markAllAsTouched();
        this.formService.validateFormFields(this.formConfigs, this.forms);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }

      const fileToUpload = this.forms.get('File')?.value;
      const formData = new FormData();
      formData.append('EmployeeID', this.form.get('EmployeeID')?.value);
      formData.append('FileType', this.forms.get('FileType')?.value);
      formData.append('File', fileToUpload, fileToUpload.name);

      this.pageService.uploadFile(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
              // Reset file form control
              this.forms.get('File')?.reset();
              this.visible = false;
            } else {
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors
              });
            }
          },
        });
    }
    catch (error) {

    }
  }

  ResetPassword(): void {
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
      this.alertService.showConfirmation({
        text: `Do you really want to Reset the <b>Login Password</b>?`,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          const model: EmployeeRegistration = {
            ...this.formService.transformFormData(this.form.value),
          };
          this.changePassword(model)
        }
        else {
          this.isSubmitted = false;
        }
      });

    }
    catch (error) {

    }
  }

  changePassword(model: EmployeeRegistration): void {
    try {
      const employeeID = this.form.get('EmployeeID')?.value;
      const userID = this.form.get('UserID')?.value;
      const resetPasswordModel = {
        ...model,
        EmployeeID: employeeID,
        UserID: userID,
        ActionType: 'ResetPassword'
      };
      this.pageService.ResetPassword(resetPasswordModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              });
              this.visible = false;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    } catch (error) {

    }
  }

  loadSelectListData(FieldName: string, targetList: keyof CreateComponent) {
    try {
      this.selectListService.PopulateList('Admin', 'EmployeeRegistration', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              (this[targetList] as SelectList[]) = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors,
              });
            }
          },
        });
    } catch (error) {

    }
  }

  loadAllCommanSelectListData(): void {
    try {
      forkJoin({
        prefix: this.prefixMasterService.PopulateList('SelectList'),
        relationship: this.relationshipService.PopulateList('SelectList'),
        employeeType: this.employeeTypeService.PopulateList('SelectList'),
        department: this.departmentService.PopulateList(0, 'MainDepartment'),
        designation: this.designationService.PopulateList('SelectList'),
        role: this.roleService.PopulateList('SelectList'),
        reportingTo: this.pageService.PopulateList('SelectList'),
        //country: this.countryService.PopulateList('SelectList'),
        //permanentCountry: this.countryService.PopulateList('SelectList'),

      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.prefix.IsSuccess) {
              this.PrefixList = response.prefix.Data.Items;
            }
            if (response.relationship.IsSuccess) {
              this.RelationshipList = response.relationship.Data.Items;
            }
            if (response.employeeType.IsSuccess) {
              this.EmployeeTypeList = response.employeeType.Data.Items;
            }
            if (response.department.IsSuccess) {
              this.DepartmentList = response.department.Data.Items;
            }
            if (response.designation.IsSuccess) {
              this.DesignationList = response.designation.Data.Items;
            }
            if (response.role.IsSuccess) {
              this.RoleList = response.role.Data.Items;
            }
            if (response.reportingTo.IsSuccess) {
              this.ReportingToList = response.reportingTo.Data.Items;
            }
            //if (response.country.IsSuccess) {
            //  this.CountryList = response.country.Data.Items;
            //  this.defaultCountryID = this.CountryList.find(country => country.IsDefault)?.CountryID ?? this.CountryList[0].CountryID;
            //  this.form.get('EmployeeCountryID')?.setValue(this.defaultCountryID);
            //  this.loadState(this.defaultCountryID);
            //}
            //if (response.permanentCountry.IsSuccess) {
            //  this.CountryPermanentList = response.permanentCountry.Data.Items;
            //  this.defaultPermanentCountryID = this.CountryPermanentList.find(country => country.IsDefault)?.CountryID ?? this.CountryPermanentList[0].CountryID;
            //  this.form.get('PermanentCountryID')?.setValue(this.defaultPermanentCountryID);
            //  this.loadState(this.defaultPermanentCountryID);
            //}

            // Additional logic to set other lists from the response
          },

        });
    } catch (error) {

    }

  }

  loadCountry(): void {
    try {
      this.countryService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.CountryList = response.Data.Items;

              this.defaultCountryID = this.isEditMode
                ? this.form.get('EmployeeCountryID')?.value
                : this.CountryList.find(country => country.IsDefault)?.CountryID
                ?? this.CountryList[0].CountryID;

              this.form.get('EmployeeCountryID')?.setValue(this.defaultCountryID);

              this.loadState(this.defaultCountryID, this.isEditMode, this.form.get('EmployeeStateID')?.value);
            } else {
              this.CountryList = [];
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors
              });
            }
          },
        });
    } catch (error) {
    }
  }

  loadState(CountryID: any, isEditMode: boolean = false, selectedStateID: number | null = null): void {
    try {
      this.stateService.PopulateList(CountryID, 'SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StateList = response.Data.Items;

              const defaultStateID = isEditMode
                ? selectedStateID
                : this.StateList.find(state => state.IsDefault)?.StateID
                ?? this.StateList[0]?.StateID;

              this.defaultStateID = defaultStateID;

              if (defaultStateID) {
                this.form.get('EmployeeStateID')?.setValue(defaultStateID);
              }
            } else {
              this.StateList = [];
            }
          },
        });
    } catch (error) {
    }
  }

  onCountryChange(event: DropdownChangeEvent): void {
    const CountryID = this.form.get('EmployeeCountryID')?.value;
    if (CountryID) {
      this.loadState(CountryID);
    } else {
      this.StateList = [];
      this.form.get('EmployeeStateID')?.setValue(null); 
    }
  }

  loadPermanentCountry(): void {
    try {
      this.countryService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.CountryPermanentList = response.Data.Items;

              // Set the default country to the first country in the list if no default is found
              this.defaultPermanentCountryID = this.CountryPermanentList.find(country => country.IsDefault)?.CountryID
                ?? this.CountryPermanentList[0].CountryID;

              this.form.get('PermanentCountryID')?.setValue(this.defaultPermanentCountryID);
              this.loadPermanentState(this.defaultPermanentCountryID);
            } else {
              this.CountryPermanentList = [];
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors
              });
            }
          },
        });
    } catch (error) {
    }
  }

  loadPermanentState(CountryID: any, selectedStateID: number | null = null): void {
    try {
      this.stateService.PopulateList(CountryID, 'SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StatePermanentList = response.Data.Items;

              // Set the default state to the first state in the list if no default is found
              const defaultPermanentStateID = this.StatePermanentList.find(state => state.IsDefault)?.StateID
                ?? this.StatePermanentList[0]?.StateID;

              this.defaultPermanentStateID = defaultPermanentStateID;

              if (defaultPermanentStateID) {
                this.form.get('PermanentStateID')?.setValue(defaultPermanentStateID);
              }
            } else {
              this.StatePermanentList = [];
            }
          },
        });
    } catch (error) {
    }
  }

  onCountryPermanentChange(event: DropdownChangeEvent): void {
    const CountryID = this.form.get('PermanentCountryID')?.value;
    if (CountryID) {
      this.loadPermanentState(CountryID);
    } else {
      this.StatePermanentList = [];
      this.form.get('PermanentStateID')?.setValue(null);
    }
  }

  //loadPermanentCountry(): void {
  //  this.countryService.PopulateList('SelectList')
  //    .pipe(takeUntil(this.destroy$))
  //    .subscribe({
  //      next: (response) => {
  //        if (response.IsSuccess) {
  //          this.CountryPermanentList = response.Data.Items;
  //          this.defaultPermanentCountryID = this.CountryPermanentList.find(country => country.IsDefault)?.CountryID ?? this.CountryPermanentList[0].CountryID;
  //          this.form.get('PermanentCountryID')?.setValue(this.defaultPermanentCountryID);
  //          this.loadPermanentState(this.defaultPermanentCountryID);
  //        }
  //      },
  //    });
  //}

  //loadPermanentState(CountryID: any): void {
  //  this.stateService.PopulateList(CountryID, 'SelectList')
  //    .pipe(takeUntil(this.destroy$))
  //    .subscribe({
  //      next: (response) => {
  //        if (response.IsSuccess) {
  //          this.StatePermanentList = response.Data.Items;
  //          this.defaultPermanentStateID = this.StatePermanentList.find(state => state.IsDefault)?.StateID ?? this.StatePermanentList[0].StateID;
  //          this.form.get('PermanentStateID')?.setValue(this.defaultPermanentStateID);
  //        }
  //      },
  //    });
  //}

  //onCountryPermanentChange(event: DropdownChangeEvent): void {
  //  const CountryID = this.form.get('PermanentCountryID')?.value;
  //  if (CountryID) {
  //    this.loadPermanentState(CountryID);
  //  }
  //}

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/EmployeeRegistration/Index']);
  }

  showDialog() {
    this.visible = true;
    this.forms.get('File')?.reset();

  }

  resetForm(): void {
    this.form.reset();
  
  }

}
