import { ProductMaster, UpdateProductList } from './../product-master';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CategoryMaster } from '../../CategoryMaster/category-master';
import { CategoryMasterService } from '../../CategoryMaster/category-master.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { FormService } from '../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ProductMasterService } from '../product-master.service';
import { StaticList } from '../../../../shared/models/select-list';
import { GenericItem_SelectList } from '../../GenericItemMaster/generic-item-master';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ProductMaster>;

  purTaxOnList: StaticList[] = [];
  taxSlabIDList: StaticList[] = [];

  categoryList: CategoryMaster[] = [];
  genericList: GenericItem_SelectList[] = [];
  manufacturerList: 
  UOMList:

  defaultCategoryID?: number | null = null;

  constructor(
    private pageService: ProductMasterService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.loadCategory();

    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    // this.isFormSidebarVisible = true;
    this.formConfig = this.productService.getFormConfig();
    console.log(this.formConfig);
    this.form = this.formService.createFormGroup<Product>(this.formConfig);
    this.formService.initializeFormValidationMessage(
      this.formConfig,
      this.form
    );
    this.getId();
    if (this.Id) {
      this.getDetails();
      this.isEditMode = true;
    }
  }

  loadCategory(): void {
    try {
      this.categoryService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.CategoryList = response.Data.Items;
            this.defaultCategoryID =
              this.CategoryList.find((Category) => Category.ActiveStatus)
                ?.CategoryID ?? this.CategoryList[0].CategoryID;
            this.form.get('CategoryID')?.setValue(this.defaultCategoryID);
          } else {
            this.CategoryList = [];
          }
        },
      });
    } catch (error) { }
  }

  getDetails() {
    this.productService
      .GetDetails(this.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          if (response.IsSuccess) {
            this.details = response.Data;
            this.patchValues();
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
  }

  patchValues() {
    this.form.patchValue({
      // ...this.details
      // ProductId: this.Id,

      ProductId: this.details.ProductId,
      productCode: this.details.ProductCode,
      productName: this.details.ProductName,
      // productCategory: this.details.CategoryID,
      productDescription: this.details.ProductDescription,
      CategoryID: this.details.CategoryID,
      unit: this.details.Unit,
      manufacturerId: this.details.ManufacturerID,
      hsCode: this.details.HSCode,
      unitPrice: this.details.UnitPrice,
      costPrice: this.details.CostPrice,
      taxSlabId: this.details.TaxSlabID,
      purTaxRate: this.details.PurTaxRate,
      reorderLevel: this.details.ReorderLevel,
      reorderQty: this.details.ReorderQty,
      measurementUnit: this.details.MeasurementUnit,
      netWeight: this.details.NetWeight,
      grossWeight: this.details.GrossWeight,
      Dimension: this.details.Dimension,
      packagingType: this.details.PackagingType,
      isActive: this.details.IsActive,
    });
    console.log(this.details);
  }

  getId() {
    this.route.params.subscribe((params: any) => {
      console.log(params.id);
      if (params.id) {
        this.Id = params.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(
    ActiveStatus: boolean,
    isEditMode: boolean,
    model: Product
  ): void {
    console.log(model.ProductId);
    console.log(this.isFormSidebarVisible, this);
    console.log('opensidebar is working');
    if (isEditMode && model) {
      console.log('im in conditions');
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }

    this.form.patchValue({
      ...model,
      prductId: model.ProductId,
    });
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
    this.cdr.detectChanges();
    // this.router.navigate([`/Admin/ProductMaster/Edit/${model.ProductId}`]);
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<Product>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;

    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.formService.validateFormFields(this.formConfig, this.form);
    //   this.alertService.showValidationAlert();
    //   this.isSubmitted = false;
    //   return;
    // }
    console.log('Form data:', this.form.value);

    if (this.isEditMode) {
      this.alertService
        .showConfirmationWithInput({ text: 'Do you really want to Update?' })
        .then((result) => {
          if (result.isConfirmed) {
            const model: UpdateProductList = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value,
            };
            this.updateRecord(model);
          } else {
            this.isSubmitted = false;
          }
        });
    } else {
      const productData = this.formService.transformFormData(this.form.value);
      console.log('Sending to backend:', productData);
      this.createRecord(productData);
    }
  }

  updateRecord(model: UpdateProductList): void {
    model.ProductId = this.Id;
    console.log('mymodel  ', model);
    this.productService
      .UpdateProduct(model.productCode, model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.IsSuccess) {
          this.router.navigate(['/Admin/ProductMaster/Index']);
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

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/ProductMaster/Index']);
  }

  createRecord(model: Product): void {
    model.productCode = `P0000${model.ProductId}`;
    console.log(model);
    this.productService
      .CreateProduct(model)
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
          console.log(model);
          this.alertService.showServerResponseAlert(response);
        }
        this.isSubmitted = false;
      });
  }

  deleteRecord(id: any): void {
    this.alertService
      .showConfirmation({ text: 'Do you really want to delete this record?' })
      .then((result) => {
        if (result.isConfirmed) {
          this.productService
            .DeleteProduct(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
              if (response.IsSuccess) {
                this.alertService.showAlert({
                  type: 'success',
                  text: 'Product deleted successfully',
                  timer: 5000,
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            });
        }
      });
  }

  resetForm(): void {
    this.formService.resetFormValue<Product>(this.formConfig, this.form);
  }
}
