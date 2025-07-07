import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../shared/services/form.service';
import { TaxSlab_SelectList, TaxSlabRequest } from '../../../admin/settings/TaxSlabMaster/tax-slab-master';
import { TaxSlabMasterService } from '../../../admin/settings/TaxSlabMaster/tax-slab-master.service';
import { HsnSacMaster } from '../hsn-sac-master';
import { HsnSacMasterService } from '../hsn-sac-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<HsnSacMaster>;

  taxSlabList: TaxSlab_SelectList[] = [];

  constructor(
    private pageService: HsnSacMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private taxSlabService: TaxSlabMasterService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<HsnSacMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadTaxSlab();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTaxSlab(): void {
    try {
      const dto: TaxSlabRequest = {
        PopulateType: "SelectList"
      }
      this.taxSlabService.PopulateList(dto).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.taxSlabList = response.Data.Items;
            console.log(response.Data.Items);
          } else {
            this.taxSlabList = [];
          }
        },
      });
    } catch (error) {}
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: HsnSacMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model)
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<HsnSacMaster>(this.formConfig, this.form);

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
            const model: HsnSacMaster = {
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
  
  createRecord(model: HsnSacMaster): void {
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
  
  updateRecord(model: HsnSacMaster): void {
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
