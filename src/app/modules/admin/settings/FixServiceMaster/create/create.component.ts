import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowValidationTooltipDirective } from '../../../../../shared/layouts/directives/show-validation-tooltip.directive';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { FormErrors, FormValidationMessages } from '../../../../../shared/models/form.model';
import { FixServiceMaster } from '../fix-service-master';
import { FixServiceMasterService } from '../fix-service-master.service';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ShowValidationTooltipDirective, CommonModule, FloatLabelModule, InputTextModule, InputTextareaModule, InputNumberModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  private destroy$ = new Subject<void>();

  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;

  private model: FixServiceMaster = new FixServiceMaster();
  public mainForm!: FormGroup;
  public formValidationMessages: FormValidationMessages = {};
  public formErrors: FormErrors = {};

  constructor(
    private fixServiceMasterService: FixServiceMasterService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formErrors = {
      FixServiceCode: '',
      FixServiceID: '',
      FixedID: '',
      FixServiceName: '',
      FixServiceRate: '',
    };

    this.formValidationMessages = {
      FixServiceID: {
        required: 'Fix Service ID is Required.',
      },
      FixServiceName: {
        required: 'Fix Service Name is Required.',
        maxlength: 'Fix Service name cannot be longer than 50 characters.',
      },
      FixedID: {
        required: 'Fixed ID is Required.',
        pattern: 'Fixed ID must be a number'
      },

      FixServiceRate: {
        required: 'Service Rate is Required.',
        pattern:  'Service Rate must be a number'
      }
    };

    this.mainForm = this.createFormFromModel(this.model);
    this.formService.setValidationMessages(this.formValidationMessages, this.formErrors, this.mainForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  createFormFromModel(model: FixServiceMaster): FormGroup {
    return this.formBuilder.group({
      FixServiceID: [model.FixServiceID, this.isEditMode ? [Validators.required] : []],
      FixServiceCode: [model.FixServiceCode || 'NEW'],
      FixServiceName: [model.FixServiceName || '', [Validators.required, Validators.maxLength(50)]],
      FixedID: [model.FixedID || null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      FixServiceRate: [model.FixServiceRate, !this.isEditMode ? [Validators.required, Validators.pattern("^[0-9]*$")]:[]],
      ServiceDescription: [model.ServiceDescription ||''],
      ActiveStatus: [model.ActiveStatus]
    });
  }

  openSidebar(isEditMode: boolean, model: FixServiceMaster = this.model): void {
    this.model = model;
    this.isEditMode = isEditMode;
    this.mainForm = this.createFormFromModel(this.model);
    this.formService.setValidationMessages(this.formValidationMessages, this.formErrors, this.mainForm);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.resetForm();

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }


  onSubmit(): void {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      this.formService.validateForm(this.formValidationMessages, this.formErrors, this.mainForm);
      this.alertService.showValidationToast(this.formErrors);
      (document.querySelector('input.ng-invalid, textarea.ng-invalid, select.ng-invalid') as HTMLElement)?.focus();
    } else {
      if (this.isEditMode) {
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            this.model = this.formService.processFormData(this.mainForm.value);
            this.model.ReasonToUpdate = result.value;
            this.updateRecord(this.model);
          }
        });
      } else {
        this.model = this.formService.processFormData(this.mainForm.value);
        this.createRecord(this.model);
      }
    }
  }

  createRecord(model: FixServiceMaster): void {
    this.fixServiceMasterService.CreateRecord(model)
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
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message
            });
          }
        }
      });
  }

  updateRecord(model: FixServiceMaster): void {
    this.fixServiceMasterService.UpdateRecord(model)
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
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message
            });
          }
        },
      });
  }

  resetForm(): void {
    this.mainForm.reset();
    this.model = this.mainForm.value;
  }

}
