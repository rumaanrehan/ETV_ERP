import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ExportOrderShipping } from '../export-order-shipping';
import { ExportOrderShippingService } from '../export-order-shipping.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrderShipping>;

  constructor(
    private pageService: ExportOrderShippingService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ExportOrderShipping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  openSidebar(activeStatus: boolean, isEditMode: boolean, model: ExportOrderShipping): void {
    try {
      this.pageService.GetShippingRecord(model.ExportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response);
              if (response.Data) {
                this.isEditMode = true;
                const formData: ExportOrderShipping = {
                  ...response.Data,
                  ExportOrderID: model.ExportOrderID,
                  ExportOrderNo: model.ExportOrderNo,
                  ShippingBillDate: DateUtils.toDate(response.Data.ShippingBillDate!),
                  AirwayBillDate: DateUtils.toDate(response.Data.AirwayBillDate!),
                };
                this.form.patchValue(formData);
                this.isFormSidebarVisible = true;
              }
            }
            else {
              if(response.Status == 'Info' && response.Message == 'Record not found.'){
                this.form.patchValue(model);
                this.isFormSidebarVisible = true;
              }
              else{
                this.alertService.showServerResponseAlert(response);
              }
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

  // openSidebar(activeStatus: boolean, isEditMode: boolean, model: ExportOrderShipping): void {
  //   console.log(model);
  //   if (isEditMode && model) {
  //     this.isEditMode = isEditMode;
  //   }
  //   this.form.patchValue(model);
  //   this.isFormSidebarVisible = true;
  // }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ExportOrderShipping>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
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

  createRecord(model: ExportOrderShipping): void {
    try {
      this.pageService.AddShippingRecord(model)
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

  updateRecord(model: ExportOrderShipping): void {
    try {
      this.pageService.UpdateShippingRecord(model)
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
