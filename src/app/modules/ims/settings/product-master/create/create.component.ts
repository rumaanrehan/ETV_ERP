import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ItemCategory_SelectList, ItemCategoryRequest } from '../../item-category-master/item-category-master';
import { Manufacturer_SelectList } from '../../manufacturer-master/manufacturer-master';
import { UOM_SelectList } from '../../uom-master/uom-master';
import { ProductMasterService } from '../product-master.service';
import { ProductMaster } from './../product-master';
import { ItemGroup_SelectList, ItemGroupRequest } from '../../item-group-master/item-group-master';
import { Generic_SelectList, GenericRequest } from '../../generic-master/generic-master';
import { ItemType_SelectList } from '../../item-type-master/item-type-master';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, FormSidebarComponent],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ProductMaster>;

  itemTypeList: ItemType_SelectList[] = []
  itemGroupList: ItemGroup_SelectList[] = [];
  itemCategoryList: ItemCategory_SelectList[] = [];
  genericList: Generic_SelectList[] = [];
  manufacturerList: Manufacturer_SelectList[] = [];
  uomList: UOM_SelectList[] = [];

  purTaxOnList: StaticList[] = [];
  
  taxSlabList: TaxSlab_SelectList[] = []

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProductMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ProductMaster>( this.formConfig );
    this.formService.initializeFormValidationMessage( this.formConfig, this.form );

    // this.getDetails();
    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList() {
    this.loadStaticLists([
      { fieldName: 'PurTaxOn', targetList: 'purTaxOnList' },
    ]);

    this.pageService.GetMasterDropdownLists()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.itemTypeList = data.itemTypeList.Data.Items;
        this.manufacturerList = data.manufacturerList.Data.Items;
        this.uomList = data.uomList.Data.Items;
        this.taxSlabList = data.taxSlabList.Data.Items;
      },
    });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IMS',
        ControllerName: 'ProductMaster',
        FieldName: fieldName,
      });
    });

    forkJoin(sources)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        listConfigs.forEach(({ targetList }) => {
          if (response[targetList]?.IsSuccess) {
            (this[targetList] as StaticList[]) = response[targetList].Data.Items || [];
          } else {
            (this[targetList] as StaticList[]) = [];
          }
        });
      },
    });
  }
  
  openSidebar(activeStatus: boolean, isEditMode: boolean, model: ProductMaster): void {
    if (isEditMode && model) {
      // this.loadItemGroup(model.ItemCategory?.ItemGroup?.ItemType?.ItemTypeID!);
      // this.loadItemCategory(model.ItemCategory?.ItemGroup?.ItemGroupID!);
      this.isEditMode = isEditMode;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    // this.form.patchValue({ItemTypeID: model.ItemCategory?.ItemGroup?.ItemType?.ItemTypeID, ItemGroupID: model.ItemCategory?.ItemGroup?.ItemGroupID});
    this.isFormSidebarVisible = true;
  }
  
  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ProductMaster>(this.formConfig, this.form);

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

  onChange_ItemCategory(): void {
    this.genericList = [];
    this.loadGeneric(this.form.value.ItemCategoryID);
  }

  loadGeneric(itemCategoryID: number): void {
    if (itemCategoryID) {
      const dto: GenericRequest = {
        ItemCategoryID: itemCategoryID,
        PopulateType: "SelectList",
      }
      this.pageService.loadGeneric(dto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.genericList = response.Data.Items;
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
            const model: ProductMaster = {
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
    
  createRecord(model: ProductMaster): void {
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
    
  updateRecord(model: ProductMaster): void {
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

  // getDetails(): void {
  //   this.route.params.subscribe((params) => {
  //     const ProductID = +params['id'];
  //     if (ProductID) {
  //       this.isEditMode = true;
  //       try {
  //         this.pageService
  //         .GetDetails(ProductID)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe({
  //           next: (response) => {
  //             if (response.IsSuccess) {
  //               this.form.patchValue(response.Data);
  //             } else {
  //               this.alertService.showServerResponseAlert(response);
  //             }
  //           },
  //         });
  //       }
  //       catch (error) {

  //       }
  //     }
  //   });
  // }
}