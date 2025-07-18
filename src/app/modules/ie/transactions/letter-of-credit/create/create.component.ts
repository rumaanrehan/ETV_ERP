import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ExportOrder_SelectList, ExportOrderRequest } from '../../../../ie/transactions/export-order/export-order';
import { LetterOfCredit } from '../letter-of-credit';
import { LetterOfCreditService } from '../letter-of-credit.service';

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

  form!: FormGroup;
  formConfig!: FormConfigType<LetterOfCredit>;
  
  exportOrderAutoCompleteDef!: AutoCompleteDef<ExportOrder_SelectList>;

  constructor(
    private pageService: LetterOfCreditService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<LetterOfCredit>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    
    this.exportOrderAutoCompleteDef = this.pageService.getExportOrderAutoCompleteDef(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: LetterOfCredit): void {
      if (isEditMode && model) {
        this.isEditMode = isEditMode;
      }
      this.form.patchValue(model);
      this.isFormSidebarVisible = true;
    }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<LetterOfCredit>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }
    
  loadExportOrder(event: string): void {
    try {
      const dto: ExportOrderRequest = {
        ExportOrderNo: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetExportOrderList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.exportOrderAutoCompleteDef.options = response.Data.Items;
            } else {
              this.exportOrderAutoCompleteDef.options = [];
              if (response.Message != "Record not found.") {
                this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {

    }
  }
  
  onSelectExportOrder(event: ExportOrder_SelectList): void {
    this.form.patchValue({
      ExportOrderID: event.ExportOrderID,
      ExportOrderNo: event.ExportOrderNo
    });
  }

  onClearExportOrder(): void {
    this.form.patchValue({
      ExportOrderID: null,
      ExportOrderNo: null
    });
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
            const model: LetterOfCredit = {
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
  
  createRecord(model: LetterOfCredit): void {
    try{
    this.pageService.CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
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
        this.isSubmitted = false;
      });
    }
    catch (error) {

    }
  }
  
  updateRecord(model: LetterOfCredit): void {
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

  calculateBaseCurrencyAmount(): void {
    const lcAmountFC = this.form.get('LCAmountFC')?.value;
    const exchangeRateToBC = this.form.get('ExchangeRateToBC')?.value;

    if (lcAmountFC && exchangeRateToBC) {
      const lcAmountBC = lcAmountFC * exchangeRateToBC;
      this.form.patchValue({ LCAmountBC: lcAmountBC });
    } else {
      this.form.patchValue({ LCAmountBC: null });
    }
  }
}
