import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ServiceCategoryMasterList } from '../../../../admin/settings/ServiceCategoryMaster/service-category-master';
import { ServiceCategoryMasterService } from '../../../../admin/settings/ServiceCategoryMaster/service-category-master.service';
import { ServiceMasterList } from '../../../../LB/Settings/ServiceMaster/service-master';
import { ServiceMasterService } from '../../../../LB/Settings/ServiceMaster/service-master.service';
import { OutSideLabMasterService } from '../../OutSideLabMaster/out-side-lab-master.service';
import { OutsideTestMapping } from '../outside-test-mapping';
import { OutsideTestMappingService } from '../outside-test-mapping.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, ZFormControlsModule],
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
  ActiveStatus: boolean = false; //for button disabled.
  form!: FormGroup;
  formConfig!: FormConfigType<OutsideTestMapping>;

  OutSideLabList: any[] = [];
  ServiceCategoryList: ServiceCategoryMasterList[] = [];
  ServiceList: ServiceMasterList[] = [];

  constructor(
    private pageService: OutsideTestMappingService,
    private outSideLabMaster: OutSideLabMasterService,
    private serviceCategoryMaster: ServiceCategoryMasterService,
    private serviceMasterService: ServiceMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<OutsideTestMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadServiceCategory();
    this.loadOutSideLab();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: OutsideTestMapping): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }
    if (isEditMode) {
      this.loadService(model.ServiceCategoryID);
    }
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<OutsideTestMapping>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  loadOutSideLab(): void {
    try {
      this.serviceCategoryMaster.PopulateList('LB', 'SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ServiceCategoryList = response.Data.Items;
            }
            else {
              this.ServiceCategoryList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadServiceCategory(): void {
    try {
      this.outSideLabMaster.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.OutSideLabList = response.Data.Items;
            }
            else {
              this.OutSideLabList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onServiceCategoryChange(): void {
    const ServiceCategoryID = this.form.get('ServiceCategoryID')?.value;
    this.loadService(ServiceCategoryID);
  }

  loadService(ServiceCategoryID: number): void {
    try {
      this.serviceMasterService.PopulateList(null,ServiceCategoryID,'ServiceCategoryWise')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ServiceList = response.Data.Items;
            }
            else {
              this.ServiceList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
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
            const model: OutsideTestMapping = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(model);
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

  createRecord(model: OutsideTestMapping): void {
    try {
      this.pageService.CreateRecord(model)
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

  updateRecord(model: OutsideTestMapping): void {
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
