import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../shared/services/form.service';
import { ItemCategory_SelectList, ItemCategoryRequest } from '../../item-category-master/item-category-master';
import { ItemGroup_SelectList, ItemGroupRequest } from '../../item-group-master/item-group-master';
import { ItemType_SelectList } from '../../item-type-master/item-type-master';
import { GenericMaster } from '../generic-master';
import { GenericMasterService } from '../generic-master.service';

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
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<GenericMaster>;

  itemTypeList: ItemType_SelectList[] = [];
  itemGroupList: ItemGroup_SelectList[] = [];
  itemCategoryList: ItemCategory_SelectList[] = [];

  constructor(
    private pageService: GenericMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<GenericMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if(data.itemTypeMasterList.IsSuccess) {
            this.itemTypeList = data.itemTypeMasterList.Data.Items;
          }
        }
    });
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: GenericMaster): void {
    if (isEditMode && model) {
      this.loadItemGroup(model.ItemCategory?.ItemGroup?.ItemType?.ItemTypeID!);
      this.loadItemCategory(model.ItemCategory?.ItemGroup?.ItemGroupID!);
      this.isEditMode = isEditMode;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    this.form.patchValue({ItemTypeID: model.ItemCategory?.ItemGroup?.ItemType?.ItemTypeID, ItemGroupID: model.ItemCategory?.ItemGroup?.ItemGroupID});
    this.isFormSidebarVisible = true;
  }
  
  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<GenericMaster>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onChange_ItemType(): void{
    this.itemGroupList = [];
    this.itemCategoryList = [];
    this.loadItemGroup(this.form.value.ItemTypeID);
  }

  loadItemGroup(itemTypeID: number): void {
    if (itemTypeID) {
      const dto: ItemGroupRequest = {
        ItemTypeID: itemTypeID,
        PopulateType: "SelectList",
      }
      this.pageService.LoadItemGroup(dto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.itemGroupList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    } else {
      this.itemGroupList = [];
    }
  }

  onChange_ItemGroup(): void {
    this.itemCategoryList = [];
    this.loadItemCategory(this.form.value.ItemGroupID);
  }

  loadItemCategory(itemGroupID: number): void {
    if (itemGroupID) {
      const dto: ItemCategoryRequest = {
        ItemGroupID: itemGroupID,
        PopulateType: "SelectList",
      }
      this.pageService.LoadItemCategory(dto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.itemCategoryList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    } else {
      this.itemCategoryList = [];
    }
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
            const model: GenericMaster = {
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
  
  createRecord(model: GenericMaster): void {
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
  
  updateRecord(model: GenericMaster): void {
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
