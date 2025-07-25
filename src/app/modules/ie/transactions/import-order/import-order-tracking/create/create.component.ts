import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormSidebarComponent } from '../../../../../../shared/components/form-sidebar/form-sidebar.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ZFormControlsModule } from '../../../../../../shared/components/z-form-controls/z-form-controls.module';
import { Subject, takeUntil } from 'rxjs';
import { FormConfigType } from '../../../../../../shared/models/form.model';
import { AutoCompleteDef } from '../../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ImportOrderTracking } from '../import-order-tracking';
import { ImportOrder_SelectList, ImportOrderRequest } from '../../import-order';
import { StaticList } from '../../../../../../shared/models/select-list';
import { FormService } from '../../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../../shared/services/alert-notification.service';
import { ImportOrderTrackingService } from '../import-order-tracking.service';

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
  formConfig!: FormConfigType<ImportOrderTracking>;

  importOrderAutoCompleteDef!: AutoCompleteDef<ImportOrder_SelectList>;

  containerTypeList: StaticList[] = [
    { iValue: 1, cValue: '20ft', Text: '20ft' },
    { iValue: 2, cValue: '40ft', Text: '40ft' },
    { iValue: 3, cValue: '40ft HC', Text: '40ft HC' },
    { iValue: 4, cValue: '45ft', Text: '45ft' }
  ]
  
  constructor(
    private pageService: ImportOrderTrackingService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ImportOrderTracking>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    
    this.importOrderAutoCompleteDef = this.pageService.getImportOrderAutoCompleteDef(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activestatus: boolean, isEditMode: boolean, model: ImportOrderTracking): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
    }
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ImportOrderTracking>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }
  
  loadImportOrder(event: string): void {
    try {
      const dto: ImportOrderRequest = {
        ImportOrderNo: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetImportOrderList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.importOrderAutoCompleteDef.options = response.Data.Items;
            } else {
              this.importOrderAutoCompleteDef.options = [];
              if (response.Message != "Record not found.") {
                this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {

    }
  }
  
  onSelectImportOrder(event: ImportOrder_SelectList): void {
    this.form.patchValue({
      ImportOrderID: event.ImportOrderID,
      ImportOrderNo: event.ImportOrderNo
    });
  }

  onClearImportOrder(): void {
    this.form.patchValue({
      ImportOrderID: null,
      ImportOrderNo: null
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
            const model: ImportOrderTracking = {
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
  
  createRecord(model: ImportOrderTracking): void {
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
  
  updateRecord(model: ImportOrderTracking): void {
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