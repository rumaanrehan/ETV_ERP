import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ModuleMaster_SelectList } from '../../ModuleMaster/module-master';
import { ModuleMasterService } from '../../ModuleMaster/module-master.service';
import { RoleMaster_SelectList } from '../../RoleMaster/role-master';
import { RoleMasterService } from '../../RoleMaster/role-master.service';
import { RoleMaster_RolePermission } from '../role-permission';
import { RolePermissionService } from '../role-permission.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, FieldsetModule, TableModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  roleList: RoleMaster_SelectList[] = [];
  moduleList: ModuleMaster_SelectList[] = [];
  RoleMaster_RolePermission!: RoleMaster_RolePermission;
  
  isAllCanReadSelected: boolean = false;
  isAllCanCreateSelected: boolean = false;
  isAllCanUpdateSelected: boolean = false;
  isAllCanDeleteSelected: boolean = false;
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<RoleMaster_RolePermission>;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: RolePermissionService,
    private roleService: RoleMasterService,
    private moduleService: ModuleMasterService,
    private router: Router,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<RoleMaster_RolePermission>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.loadRole();
    this.loadModule();
  }

  get RoleMappingArray(): FormArray {
    return this.form.get('RoleMapping') as FormArray;
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/admin/role-master']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRole(): void {
    try {
      this.roleService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.roleList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors,
              });
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
              this.moduleList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors,
              });
            }
          },
        });
    } catch (error) {

    }
  }

  onRoleChange(event: DropdownChangeEvent): void {
    try {
      const RoleID = this.form.get('RoleID')?.value;
      const ModuleID = this.form.get('ModuleID')?.value;
      if (RoleID && ModuleID) {
        this.loadData(RoleID, ModuleID);
        this.RoleMappingArray.clear();
      } else {
        this.RoleMappingArray.clear();
      }
    } catch (error) {

    }
  }

  onModuleChange(event: DropdownChangeEvent): void {
    try {
      const RoleID = this.form.get('RoleID')?.value;
      const ModuleID = this.form.get('ModuleID')?.value;
      if (ModuleID && RoleID) {
        this.loadData(RoleID, ModuleID);
        this.RoleMappingArray.clear();
      } else {
        this.RoleMappingArray.clear();
      }
    } catch (error) {

    }
  
  }

  loadData(roleID: number, moduleID: number): void {
    this.pageService.GetDetailsRolePermission(roleID, moduleID)         
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (!response.IsSuccess) {
          this.alertService.showServerResponseAlert(response);
          return;
        }

        this.RoleMappingArray.clear();
        response.Data.RoleMapping.forEach(() =>
          this.RoleMappingArray.push(
            this.formService.createFormArrayItem(this.formConfig.RoleMapping.items)
          )
        );
        this.RoleMappingArray.patchValue(response.Data.RoleMapping);
        this.RoleMaster_RolePermission = response.Data;
      },
      error: err => console.error('loadData error', err)
    });
  }

  cbSelectAll(selectAllType: 'CanRead' | 'CanCreate' | 'CanUpdate' | 'CanDelete'): void {
    try {
      const isSelectedKeyMap = {
        CanRead: 'isAllCanReadSelected', CanCreate: 'isAllCanCreateSelected', CanUpdate: 'isAllCanUpdateSelected', CanDelete: 'isAllCanDeleteSelected'
      } as const;
      const isSelectedKey = isSelectedKeyMap[selectAllType];
      this[isSelectedKey] = !this[isSelectedKey];
      this.RoleMappingArray.controls.forEach(control => {
        control.patchValue({ [selectAllType]: this[isSelectedKey] });
      });
    } catch (error) {

    }

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

      this.alertService.showConfirmationWithInput({
        text: 'Do you really want to Update?',
      }).then(result => {
        if (result.isConfirmed) {
          const model: RoleMaster_RolePermission = {
            ...this.formService.transformFormData(this.form.value),
            ReasonToUpdate: result.value
          };
          this.updateRecord(model)
        }
        else {
          this.isSubmitted = false;
        }
      });      
    }
    catch (error) {

    }
  }

  updateRecord(model: RoleMaster_RolePermission): void {
    try {
      this.pageService.UpdateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
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