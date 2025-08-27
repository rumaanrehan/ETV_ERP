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
import { ModuleMaster_SelectList } from '../../ModuleMaster/module-master';
import { ModuleMasterService } from '../../ModuleMaster/module-master.service';
import { MenuMaster, MenuMaster_SelectList, MenuMasterRequest, MenuTypeItem } from '../menu-master';
import { MenuMasterService } from '../menu-master.service';

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

  menuTypeList: MenuTypeItem[] = [
    { value: 1, label: 'Menu' },
    { value: 2, label: 'Access Control Menu' },
    { value: 3, label: 'Group Menu' }
  ];
  moduleList: ModuleMaster_SelectList[] = [];
  groupMenuList: MenuMaster_SelectList[] = [];
  parentMenuList: MenuMaster_SelectList[] = [];

  constructor(
    private pageService: MenuMasterService,
    // private selectListService: SelectListService,
    private moduleService: ModuleMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<MenuMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadModule();
    // this.loadMenuType('MenuType');
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // loadMenuType(FieldName: any) {
  //   try {
  //     this.selectListService.PopulateList('Admin', 'MenuMaster', FieldName)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             console.log(response.Data.Items);
  //             this.menuTypeList = response.Data.Items;
  //           } else {
  //             this.alertService.showServerResponseAlert(response);
  //           }
  //         },
  //       });
  //   } catch (error) {

  //   }
  // }

  loadModule(): void {
    try {
      this.moduleService.PopulateList('SelectList')
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
    this.groupMenuList = [];
    this.parentMenuList = [];
    this.form.patchValue({
      GroupMenuID: null,
      ParentMenuID: null
    });
    const ModuleID = this.form.get('ModuleID')?.value;
    if (ModuleID > 0) {
      this.loadGroupMenu(ModuleID);
      // this.loadMenuType(ModuleID);
    } else {
      this.groupMenuList = [];
    }
  }

  // loadMenuType(ModuleID: number): void {
  //   this.menuTypeList = [];

  //   const model: MenuMasterRequest = {
  //     MenuID: 0,
  //     ModuleID: ModuleID,
  //     MenuType: 0,
  //     GroupMenuID: 0,
  //     ParentMenuName: "",
  //     MenuName: "",
  //     ControllerName: "",
  //     PopulateType: "SelectList"
  //   };

  //   try {
  //     this.pageService.PopulateList(model)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             console.log(response);
  //             this.menuTypeList = response.Data.Items;
  //           }
  //           else {
  //             this.alertService.showServerResponseAlert(response);
  //           }
  //         },
  //       });
  //   } catch (error) {

  //   }
  // }

  loadGroupMenu(ModuleID: number): void {    
    const model: MenuMasterRequest = {
      MenuID: null,
      ModuleID: ModuleID,
      MenuType: 1,
      GroupMenuID: null,
      ParentMenuID: 0,
      MenuName: null,
      ControllerName: null,
      PopulateType: "SelectList"
    };
    try {
      this.pageService.PopulateList(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.groupMenuList = response.Data.Items;
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
    this.parentMenuList = [];
    this.form.patchValue({
      ParentMenuID: null
    });
    const GroupMenuID = this.form.get('GroupMenuID')?.value;
    const ModuleID = this.form.get('ModuleID')?.value;
    const MenuType = this.form.get('MenuType')?.value;
    if (ModuleID > 0 && GroupMenuID > 0 && MenuType === 3) {
      this.loadParentMenu(ModuleID, GroupMenuID);
    } else {
      this.parentMenuList = [];
    }
  }

  loadParentMenu(ModuleID: number, GroupMenuID: number): void {
    
    const model: MenuMasterRequest = {
      MenuID: null,
      ModuleID: ModuleID,
      MenuType: null,
      GroupMenuID: GroupMenuID,
      ParentMenuID: null,
      MenuName: null,
      ControllerName: null,
      PopulateType: "SelectList"
    };
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

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: MenuMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.activeStatus = ActiveStatus;
      if (model.MenuType === 1) {
        this.loadGroupMenu(model.ModuleID as number);
      }
      if (model.MenuType === 3) {
        this.loadGroupMenu(model.ModuleID as number);
        this.loadParentMenu(model.ModuleID as number, model.GroupMenuID as number);
      }
    }
    this.activeStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<MenuMaster>(this.formConfig, this.form);
    this.parentMenuList = [];
    this.groupMenuList = [];
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
    try{
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
