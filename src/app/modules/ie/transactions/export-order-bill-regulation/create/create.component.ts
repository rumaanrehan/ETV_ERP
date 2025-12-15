import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ExportOrderBillRegulation, ExportOrderBillRegulationRequest, ExportOrderDocumentType } from '../export-order-bill-regulation';
import { ExportOrderBillRegulationService } from '../export-order-bill-regulation.service';

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
  formConfig!: FormConfigType<ExportOrderBillRegulation>;

  constructor(
    private pageService: ExportOrderBillRegulationService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ExportOrderBillRegulation>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: ExportOrderBillRegulation): void {
    try {
      this.pageService.GetBillRegulationRecord(model.ExportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              if (response.Data.SelectedDocuments?.length > 0) {
                const formData: Partial<ExportOrderBillRegulation> = {
                  ExportOrderID: model.ExportOrderID,
                  ExportOrderNo: model.ExportOrderNo,
                  ...this.mapSelectedDocuments(response.Data.SelectedDocuments)
                };

                this.isEditMode = true;
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

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ExportOrderBillRegulation>(this.formConfig, this.form);

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
      
      const form = this.formService.transformFormData(this.form.value);
      const request: ExportOrderBillRegulationRequest = {
        ExportOrderID: form.ExportOrderID,
        SelectedDocuments: this.getSelectedDocuments(form)
      };
      if (this.isEditMode) {
        this.alertService.showConfirmation({
          text: 'Do you really want to update?',
        }).then(result => {
          if (result.isConfirmed) {
            this.updateRecord(request);
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.createRecord(request);
      }
    }
    catch (error) {

    }
  }

  createRecord(model: ExportOrderBillRegulationRequest): void {
    try {
      this.pageService.AddBillRegulationRecord(model)
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

  updateRecord(model: ExportOrderBillRegulationRequest): void {
    try {
      this.pageService.UpdateBillRegulationRecord(model)
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
  
  private getSelectedDocuments(form: ExportOrderBillRegulation): ExportOrderDocumentType[] {
    const documentMap = {
      ShippingBill: ExportOrderDocumentType.ShippingBill,
      AirwayBill: ExportOrderDocumentType.AirwayBill,
      IECCertificate: ExportOrderDocumentType.IECCertificate,
      Invoice: ExportOrderDocumentType.Invoice,
      PackingSlip: ExportOrderDocumentType.PackingSlip,
      CustomerPO: ExportOrderDocumentType.CustomerPO
    } as const;

    const docKeys = Object.keys(documentMap) as (keyof typeof documentMap)[];

    return docKeys
      .filter(key => form[key] === true)
      .map(key => documentMap[key]);
  }
  
  private mapSelectedDocuments(selected: ExportOrderDocumentType[]) {
    const map = {
      ShippingBill: ExportOrderDocumentType.ShippingBill,
      AirwayBill: ExportOrderDocumentType.AirwayBill,
      IECCertificate: ExportOrderDocumentType.IECCertificate,
      Invoice: ExportOrderDocumentType.Invoice,
      PackingSlip: ExportOrderDocumentType.PackingSlip,
      CustomerPO: ExportOrderDocumentType.CustomerPO
    } as const;

    const form: Partial<ExportOrderBillRegulation> = {};

    selected?.forEach(doc => {
      const key = Object.keys(map).find(k => map[k as keyof typeof map] === doc);
      if (key) form[key as keyof typeof map] = true;
    });

    return form;
  }
}

