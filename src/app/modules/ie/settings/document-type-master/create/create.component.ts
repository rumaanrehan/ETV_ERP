import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { DocumentTypeMaster } from '../document-type-master';
import { DocumentTypeMasterService } from '../document-type-master.service';
import { StaticList } from '../../../../../shared/models/select-list';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<DocumentTypeMaster>;

  constructor(
    private pageService: DocumentTypeMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<DocumentTypeMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: DocumentTypeMaster): void {
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
    this.formService.resetFormValue<DocumentTypeMaster>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formService.validateFormFields(this.formConfig, this.form);
      this.alertService.showValidationAlert();
      this.isSubmitted = false;
      return;
    }

    if (this.isEditMode) {
      this.alertService
        .showConfirmationWithInput({
          text: 'Do you really want to update?',
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: DocumentTypeMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value,
            };
            this.updateRecord(model);
          } else {
            this.isSubmitted = false;
          }
        });
    } else {
      this.createRecord(this.formService.transformFormData(this.form.value));
    }
  }

  createRecord(model: DocumentTypeMaster): void {
    this.pageService
      .CreateRecord(model)
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
            setTimeout(() => {
              this.ngOnInit();
            }, 2000);
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.isSubmitted = false;
        },
      });
  }

  updateRecord(model: DocumentTypeMaster): void {
    this.pageService
      .UpdateRecord(model)
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
        },
      });
  }
}
