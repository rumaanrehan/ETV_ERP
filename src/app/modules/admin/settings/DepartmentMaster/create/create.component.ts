import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { DepartmentTypeMasterList } from '../../DepartmentTypeMaster/department-type-master';
import { DepartmentTypeMasterService } from '../../DepartmentTypeMaster/department-type-master.service';
import { DepartmentMaster, DepartmentMasterList } from '../department-master';
import { DepartmentMasterService } from '../department-master.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';


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
  IsSubDepartment: boolean = true;
  ActiveStatus: boolean = false; //for button disabled.
  form!: FormGroup;
  formConfig!: FormConfigType<DepartmentMaster>;
  ParentDepartmentList: DepartmentMasterList[] = [];
  DepartmentTypeList: DepartmentTypeMasterList[] = [];
  NMCDepartmentCodeList: SelectList[] = [];

  constructor(
    private pageService: DepartmentMasterService,
    private departmentTypeService: DepartmentTypeMasterService,
    private selectListService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<DepartmentMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadDepartmentType();
    this.loadNMCDepartmentCode('NMC_DepartmentCode');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartmentType(): void {
    try {
      this.departmentTypeService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.DepartmentTypeList = response.Data.Items;
          }
          else {
            this.DepartmentTypeList = [];
          }
        },
      });
    }
    catch (error) {

    }
  }

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: DepartmentMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }
    if (this.isEditMode && model.DepartmentTypeID) {
      this.loadParentDepartment(model.DepartmentTypeID);
    }
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<DepartmentMaster>(this.formConfig, this.form);
    this.ParentDepartmentList = [];
    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onDepartmentChange(event: DropdownChangeEvent): void {
    const DepartmentTypeID = this.form.get('DepartmentTypeID')?.value;
    if (DepartmentTypeID) {
      this.loadParentDepartment(DepartmentTypeID);
    }
  }

  loadParentDepartment(DepartmentTypeID: number): void {
    try {
      this.pageService.PopulateList(DepartmentTypeID, 'MainDepartment').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.ParentDepartmentList = response.Data.Items;
          }
          else {
            this.ParentDepartmentList = [];
          }
        },
      });
    }
    catch (error) {

    }
  }

  loadNMCDepartmentCode(FieldName: string): void {
    try {
      this.selectListService.PopulateList('Admin','DepartMentMaster',FieldName).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.NMCDepartmentCodeList = response.Data.Items;
          }
          else {
            this.NMCDepartmentCodeList = [];
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    }
    catch (error) {

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
            const model: DepartmentMaster = {
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

  createRecord(model: DepartmentMaster): void {
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

  updateRecord(model: DepartmentMaster): void {
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
