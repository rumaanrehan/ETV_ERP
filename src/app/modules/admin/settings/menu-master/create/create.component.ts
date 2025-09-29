import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { MenuMaster, MenuMaster_SelectList, MenuMasterRequest } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';
import { ModuleMaster_SelectList, ModuleRequest } from '../../module-master/module-master';
import { ModuleMasterService } from '../../module-master/module-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<MenuMaster>;

  menuTypeList: StaticList[] = [
    { iValue: 1, Text: 'Group Menu', cValue: '' },
    { iValue: 2, Text: 'Menu', cValue: '' }
  ];

  moduleList: ModuleMaster_SelectList[] = [];
  // groupMenuList: MenuMaster_SelectList[] = [];
  parentMenuList: MenuMaster_SelectList[] = [];

  constructor(
    private pageService: MenuMasterService,
    private moduleService: ModuleMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<MenuMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadModule();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadModule(): void {
    try {
      this.moduleService.PopulateList({ PopulateType: 'SelectList' } as ModuleRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.moduleList = response.Data.Items;
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onModuleChange(event: DropdownChangeEvent): void {
    // this.groupMenuList = [];
    this.parentMenuList = [];
    this.form.patchValue({
      GroupMenuID: null,
      ParentMenuID: null
    });
    const moduleID = this.form.get('ModuleID')?.value;
    const menuType = this.form.get('MenuType')?.value;
    if (moduleID > 0 && menuType == 2) {
      this.loadParentMenu(moduleID);
    } else {
      // this.groupMenuList = [];
    }
  }

  loadParentMenu(moduleID: number): void {
    const model: MenuMasterRequest = {
      ModuleID: moduleID,
      MenuType: 1,
      PopulateType: "SelectList"
    }

    try {
      this.pageService.PopulateList(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.parentMenuList = response.Data.Items;
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: MenuMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.activeStatus = activeStatus;
      if (model.MenuType === 2) {
        this.loadParentMenu(model.ModuleID!);
      }
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<MenuMaster>(this.formConfig, this.form);
    this.parentMenuList = [];
    // this.groupMenuList = [];
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
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to update?',
        }).then(result => {
          if (result.isConfirmed) {
            const model: MenuMaster = {
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

  createRecord(model: MenuMaster): void {
    try {
      this.pageService.CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
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
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {

    }
  }

  updateRecord(model: MenuMaster): void {
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
