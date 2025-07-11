import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { DesignationMaster } from '../designation-master';
import { DesignationMasterService } from '../designation-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<DesignationMaster>;


  constructor(
    private pageService: DesignationMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<DesignationMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: DesignationMaster): void {
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
    this.formService.resetFormValue<DesignationMaster>(this.formConfig, this.form);

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
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to update?',
        }).then(result => {
          if (result.isConfirmed) {
            const model: DesignationMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(this.formService.transformFormData(model));
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
  
  createRecord(model: DesignationMaster): void {
    try{
    this.pageService.CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.closeSidebar();
            this.alertService.showAlert({
              type: 'success',
              text: response.Message,
              timer: 5000,
            });
          } else {
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
  
  updateRecord(model: DesignationMaster): void {
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
