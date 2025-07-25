import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormSidebarComponent } from '../../../../../../shared/components/form-sidebar/form-sidebar.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ZFormControlsModule } from '../../../../../../shared/components/z-form-controls/z-form-controls.module';
import { Subject, takeUntil } from 'rxjs';
import { FormConfigType } from '../../../../../../shared/models/form.model';
import { ExportOrderPayment } from '../../../export-order-payment/export-payment';
import { AutoCompleteDef } from '../../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ExportOrder_SelectList } from '../../../export-order/export-order';
import { ImportOrderPayment } from '../import-order-payment';
import { ImportOrder_SelectList } from '../../import-order';
import { ImportOrderPaymentService } from '../import-order-payment.service';
import { FormService } from '../../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../../shared/services/alert-notification.service';

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
  currentDate: Date = new Date();

  form!: FormGroup;
  formConfig!: FormConfigType<ImportOrderPayment>;
  
  importOrderAutoCompleteDef!: AutoCompleteDef<ImportOrder_SelectList>;

  constructor(
    private pageService: ImportOrderPaymentService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ImportOrderPayment>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.importOrderAutoCompleteDef = this.pageService.getImportOrderAutoCompleteDef(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: ImportOrderPayment): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.activeStatus = activeStatus;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ImportOrderPayment>(this.formConfig, this.form);

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
        this.alertService
          .showConfirmation({ text: 'Do you really want to update?' })
          .then((result) => {
            if (result.isConfirmed) {
              this.updateRecord(this.formService.transformFormData(this.form.value));
            } else {
              this.isSubmitted = false;
            }
          });
      } else {
        this.createRecord(this.formService.transformFormData(this.form.value));
      }
    } catch (error) {}
  }

  createRecord(model: ImportOrderPayment): void {
    try {
      this.pageService
        .CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response.IsSuccess) {
            this.closeSidebar();
            this.alertService.showAlert({
              type: 'success',
              text: response.Message,
              timer: 5000
            });
          } else {
            this.alertService.showServerResponseAlert(response);
          }
          this.isSubmitted = false;
        });
    } catch (error) {}
  }

  updateRecord(model: ImportOrderPayment): void {
    try {
      this.pageService.UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeSidebar();
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    } catch (error) {}
  }

  calculateBaseCurrencyAmount(): void {
    const paymentAmountFC = this.form.get('PaymentAmountFC')?.value;
    const exchangeRateToBC = this.form.get('ExchangeRateToBC')?.value;

    if (paymentAmountFC && exchangeRateToBC) {
      const paymentAmountBC = paymentAmountFC * exchangeRateToBC;
      this.form.patchValue({ PaymentAmountBC: paymentAmountBC });
    } else {
      this.form.patchValue({ PaymentAmountBC: null });
    }
  }
}
