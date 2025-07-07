import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { CompanyMaster, State_SelectList } from '../company-master';
import { CompanyMasterService } from '../company-master.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { SelectList } from '../../../../admin/settings/SelectList/select-list';
import { StaticList } from '../../../../../shared/models/select-list';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<CompanyMaster>;

  companyTypeList: StaticList[] = [
    { iValue: 1, Text: "Client", cValue: "" },
    { iValue: 2, Text: "Vendor", cValue: "" }
  ]

  stateList: State_SelectList[] = [
    { StateID: 1, StateName: "Delhi"},
    { StateID: 2, StateName: "Bihar"},
    { StateID: 3, StateName: "Karnataka"},
    { StateID: 4, StateName: "Maharastra"},
    { StateID: 5, StateName: "Uttar Pradesh"}
  ]

  constructor(
    private pageService: CompanyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<CompanyMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: CompanyMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<CompanyMaster>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    try{
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }
      if (this.isEditMode) {
        this.alertService.showConfirmation({
          text: 'Do you really want to update?',
        }).then(result => {
          if (result.isConfirmed) {
            this.updateRecord(this.formService.transformFormData(this.form.value));
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

  createRecord(model: CompanyMaster): void {
    try{
    this.pageService.CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.closeSidebar();
            this.alertService.showAlert({
              type: "success",
              text: response.Message,
              timer: 5000
            });
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

  updateRecord(model: CompanyMaster): void {
    try {
      this.pageService.UpdateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.closeSidebar();
            this.alertService.showAlert({
              type: "success",
              text: response.Message,
              timer: 5000
            });
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
}
