import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ModuleMasterList } from '../../ModuleMaster/module-master';
import { ModuleMasterService } from '../../ModuleMaster/module-master.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { MenuMaster, MenuMasterList } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';
 
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<MenuMaster>;
  MenuTypeList: SelectList[] = [];
  ModuleList: ModuleMasterList[] = [];
  GroupMenuList: MenuMasterList[] = [];              
  ParentMenuList: MenuMasterList[] = [];              

  constructor(
    private pageService: MenuMasterService,
    private selectListService: SelectListService,
    private moduleService: ModuleMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<MenuMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadMenuType('MenuType');
    this.loadModule();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMenuType(FieldName: any) {
    try {
      this.selectListService.PopulateList('Admin', 'MenuMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.MenuTypeList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadModule(): void {
    try {
      this.moduleService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ModuleList = response.Data.Items;
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
    this.GroupMenuList = [];
    this.ParentMenuList = [];
    this.form.patchValue({
      GroupMenuID: null,
      ParentMenuID: null
    });
    const ModuleID = this.form.get('ModuleID')?.value;
    if (ModuleID > 0) {
      this.loadGroupMenu(ModuleID);
    } else {
      this.GroupMenuList = [];
    }
  }

  loadGroupMenu(ModuleID: number): void {
    try {
      this.pageService.PopulateList(0, ModuleID, 0, 0, '', '', '','GroupMenuList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({ 
          next: (response) => {
            if (response.IsSuccess) {
              this.GroupMenuList = response.Data.Items;
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onGroupMenuChange(event: DropdownChangeEvent): void {
    this.ParentMenuList = [];
    this.form.patchValue({
      ParentMenuID: null
    });
    const GroupMenuID = this.form.get('GroupMenuID')?.value;
    const ModuleID = this.form.get('ModuleID')?.value;
    const MenuType = this.form.get('MenuType')?.value;
    if (ModuleID > 0 && GroupMenuID > 0 && MenuType === 3) {
      this.loadParentMenu(ModuleID, GroupMenuID);
    } else {
      this.ParentMenuList = [];
    }
  }

  loadParentMenu(ModuleID: number, GroupMenuID: number): void {
    try {
      this.pageService.PopulateList(0, ModuleID, 0, GroupMenuID, '', '', '', 'ParentMenuList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ParentMenuList = response.Data.Items;
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: MenuMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
      if (model.MenuType === 2) {
        this.loadGroupMenu(model.ModuleID as number);
      }
      if (model.MenuType === 3) {
        this.loadGroupMenu(model.ModuleID as number);
        this.loadParentMenu(model.ModuleID as number, model.GroupMenuID as number);
      }
    }
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<MenuMaster>(this.formConfig, this.form);
    this.ParentMenuList = [];
    this.GroupMenuList = [];
    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
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
            const model: MenuMaster = {
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

  createRecord(model: MenuMaster): void {
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
