import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../../shared/components/form-sidebar/form-sidebar.component';
import { AutoCompleteDef } from '../../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFileUploadComponent } from '../../../../../../shared/components/z-form-controls/z-file-upload/z-file-upload.component';
import { ZFormControlsModule } from '../../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../../shared/services/form.service';
import { DocumentType_SelectList } from '../../../../settings/document-type-master/document-type-master';
import { ImportOrder_SelectList, ImportOrderRequest } from '../../import-order';
import { ImportOrderDocument } from '../import-order-document';
import { ImportOrderDocumentService } from '../import-order-document.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule,ZFileUploadComponent, AutoCompleteModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ImportOrderDocument>;
  
  importOrderAutoCompleteDef!: AutoCompleteDef<ImportOrder_SelectList>;

   documentTypeList: DocumentType_SelectList[] = [
    { DocumentTypeID: 1, DocumentTypeName: 'Identity Proof' },
    { DocumentTypeID: 2, DocumentTypeName: 'Address Proof' },
    { DocumentTypeID: 3, DocumentTypeName: 'Tax Document' },
    { DocumentTypeID: 4, DocumentTypeName: 'Educational Certificate' },
    { DocumentTypeID: 5, DocumentTypeName: 'Employment Contract' }
  ];

  constructor(
    private pageService: ImportOrderDocumentService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ImportOrderDocument>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    this.importOrderAutoCompleteDef = this.pageService.getImportOrderAutoCompleteDef(this.formConfig, this.form);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: ImportOrderDocument): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = activeStatus;
    }
    this.ActiveStatus = activeStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ImportOrderDocument>(this.formConfig, this.form);

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

  OnSelect_ImportOrder(event: ImportOrder_SelectList): void {
    this.form.patchValue({
      ImportOrderID: event.ImportOrderID,
      ImportOrderNo: event.ImportOrderNo,
    });
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
      
      const formData = new FormData();
      const transformedData = this.formService.transformFormData(this.form.value);

      for (const key in transformedData) {
        const value = transformedData[key];
        if (Array.isArray(value)) {
          if (value[0] instanceof File) {
            if (this.form.value[key]?.length) {
              this.form.value[key].forEach((file: File) => {
                formData.append(key, file, file.name);
              });
            }
          }
        }
        else {
          if(transformedData[key] != null) {
            formData.append(key, transformedData[key]);
          }
        }
      }

      if (this.isEditMode) {
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            formData.append("ReasonToUpdate", result.value);
            this.updateRecord(transformedData);
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        console.log(formData);
        this.createRecord(formData);
      }
    }
    catch (error) {
    }
  }

  createRecord(model: FormData): void {
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
    }
    catch (error) {
    }
  }

  updateRecord(model: ImportOrderDocument): void {
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
    }
    catch (error) {
    }
  }
}