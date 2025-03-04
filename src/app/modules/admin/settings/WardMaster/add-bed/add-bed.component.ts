import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OnDestroy, OnInit, } from '@angular/core';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { ShowValidationTooltipDirective } from '../../../../../shared/layouts/directives/show-validation-tooltip.directive';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WardMaster_AddWardBed } from '../ward-master';
import { FormConfigType, FormValidationMessages } from '../../../../../shared/models/form.model';
import { FormErrors } from '../../../../../shared/services/form-validation.service';
import { WardMasterService } from '../ward-master.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { TableLazyLoadEvent } from 'primeng/table';


@Component({
  selector: 'app-add-bed',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, ZFormControlsModule],
  providers: [FormService, DatePipe],
  templateUrl: './add-bed.component.html',
  styleUrl: './add-bed.component.scss'
})
export class AddBedComponent {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<WardMaster_AddWardBed>;

  constructor(
    private pageService: WardMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormAddBedConfig();
    this.form = this.formService.createFormGroup<WardMaster_AddWardBed>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(WardBed_WardID: number, model: WardMaster_AddWardBed): void {
    if (model) {
      this.form.patchValue({
        WardBed_WardID: WardBed_WardID
      });
    }
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.formService.resetFormValue<WardMaster_AddWardBed>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
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
            const model: WardMaster_AddWardBed = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.AddWardBedCreateRecordAsync(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  AddWardBedCreateRecordAsync(model: WardMaster_AddWardBed): void {
    try {
      this.pageService.AddWardBedCreateRecordAsync(model)
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
    } catch (error) {

    }
  }
}
