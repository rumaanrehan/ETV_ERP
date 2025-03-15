import { ProductMaster } from './../product-master';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { FormService } from '../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../shared/models/form.model';
import { ProductMasterService } from '../product-master.service';
import { StaticList } from '../../../../shared/models/select-list';
import { GenericItem_SelectList } from '../../GenericItemMaster/generic-item-master';
import { ManufacturerMaster_SelectList } from '../../../../components/Manufacturer-Master/manufacturer-master';
import { ApiListResponse } from '../../../../shared/models/api-response';
import { UOMMaster_SelectList } from '../../UOMMaster/UOM-master';
import { ItemCategoryMaster_SelectList } from '../../ItemCategoryMaster/item-category-master';
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
  categoryList: ItemCategoryMaster_SelectList[] = [];
  genericList: GenericItem_SelectList[] = [];
  manufacturerList: ManufacturerMaster_SelectList[] = [];
  uomList: UOMMaster_SelectList[] = [];

  constructor(
    private pageService: ProductMasterService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ProductMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    
    this.loadDropdownList();
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    try {
      this.router.navigate(['/Admin/ProductMaster/Index']);
    }
    catch (error) {

    }
  }

  loadDropdownList(){
    this.loadStaticLists([
      { fieldName: 'PurTaxOn', targetList: 'purTaxOnList' },
      { fieldName: 'TaxSlabID', targetList: 'taxSlabIDList' }
    ]);
    
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if(data.categoryList.IsSuccess) {
            this.categoryList = data.categoryList.Data.Items;
          }
        }
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
        }
      });
  }

  resetForm(): void{
    this.formService.resetFormValue<ProductMaster>(this.formConfig, this.form);
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
            const model: ProductMaster = {
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

  createRecord(model: ProductMaster): void {
    try {
      this.pageService.CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              });
              setTimeout(() => {
                this.ngOnInit();
              }, 2000);
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

  updateRecord(model: ProductMaster): void {
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
              setTimeout(() => {
                this.router.navigate(['/IMS/ProductMaster']);
              }, 2000);
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

  getDetails(): void {
    this.route.params.subscribe((params) => {
      const ProductID = +params['id'];
      if (ProductID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(ProductID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.form.patchValue(response.Data);
                }
                else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
        catch (error) {
        }
      }
    });
  }

  // loadCategory(): void {
  //   try {
  //     this.categoryService.PopulateList('SelectList').subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
  //           this.CategoryList = response.Data.Items;
  //           this.defaultCategoryID =
  //             this.CategoryList.find((Category) => Category.ActiveStatus)
  //               ?.CategoryID ?? this.CategoryList[0].CategoryID;
  //           this.form.get('CategoryID')?.setValue(this.defaultCategoryID);
  //         } else {
  //           this.CategoryList = [];
  //         }
  //       },
  //     });
  //   } catch (error) { }
  // }

  // getDetails() {
  //   this.productService
  //     .GetDetails(this.Id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);

  //         if (response.IsSuccess) {
  //           this.details = response.Data;
  //           this.patchValues();
  //         } else {
  //           this.alertService.showServerResponseAlert(response);
  //         }
  //       },
  //     });
  // }

  // patchValues() {
  //   this.form.patchValue({
  //     // ...this.details
  //     // ProductId: this.Id,

  //     ProductId: this.details.ProductId,
  //     productCode: this.details.ProductCode,
  //     productName: this.details.ProductName,
  //     // productCategory: this.details.CategoryID,
  //     productDescription: this.details.ProductDescription,
  //     CategoryID: this.details.CategoryID,
  //     unit: this.details.Unit,
  //     manufacturerId: this.details.ManufacturerID,
  //     hsCode: this.details.HSCode,
  //     unitPrice: this.details.UnitPrice,
  //     costPrice: this.details.CostPrice,
  //     taxSlabId: this.details.TaxSlabID,
  //     purTaxRate: this.details.PurTaxRate,
  //     reorderLevel: this.details.ReorderLevel,
  //     reorderQty: this.details.ReorderQty,
  //     measurementUnit: this.details.MeasurementUnit,
  //     netWeight: this.details.NetWeight,
  //     grossWeight: this.details.GrossWeight,
  //     Dimension: this.details.Dimension,
  //     packagingType: this.details.PackagingType,
  //     isActive: this.details.IsActive,
  //   });
  //   console.log(this.details);
  // }

  // getId() {
  //   this.route.params.subscribe((params: any) => {
  //     console.log(params.id);
  //     if (params.id) {
  //       this.Id = params.id;
  //     }
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  // openSidebar(
  //   ActiveStatus: boolean,
  //   isEditMode: boolean,
  //   model: Product
  // ): void {
  //   console.log(model.ProductId);
  //   console.log(this.isFormSidebarVisible, this);
  //   console.log('opensidebar is working');
  //   if (isEditMode && model) {
  //     console.log('im in conditions');
  //     this.isEditMode = isEditMode;
  //     this.ActiveStatus = ActiveStatus;
  //   }

  //   this.form.patchValue({
  //     ...model,
  //     prductId: model.ProductId,
  //   });
  //   this.ActiveStatus = ActiveStatus;
  //   this.form.patchValue(model);
  //   this.isFormSidebarVisible = true;
  //   this.cdr.detectChanges();
  //   // this.router.navigate([`/Admin/ProductMaster/Edit/${model.ProductId}`]);
  // }

  // closeSidebar(): void {
  //   this.isFormSidebarVisible = false;
  //   this.isEditMode = false;
  //   this.formService.resetFormValue<Product>(this.formConfig, this.form);

  //   setTimeout(() => {
  //     this.closeSidebarEvent.emit();
  //   }, 1);
  // }

  // onSubmit(): void {
  //   if (this.isSubmitted) return;
  //   this.isSubmitted = true;

  //   // if (this.form.invalid) {
  //   //   this.form.markAllAsTouched();
  //   //   this.formService.validateFormFields(this.formConfig, this.form);
  //   //   this.alertService.showValidationAlert();
  //   //   this.isSubmitted = false;
  //   //   return;
  //   // }
  //   console.log('Form data:', this.form.value);

  //   if (this.isEditMode) {
  //     this.alertService
  //       .showConfirmationWithInput({ text: 'Do you really want to Update?' })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           const model: UpdateProductList = {
  //             ...this.formService.transformFormData(this.form.value),
  //             ReasonToUpdate: result.value,
  //           };
  //           this.updateRecord(model);
  //         } else {
  //           this.isSubmitted = false;
  //         }
  //       });
  //   } else {
  //     const productData = this.formService.transformFormData(this.form.value);
  //     console.log('Sending to backend:', productData);
  //     this.createRecord(productData);
  //   }
  // }

  // updateRecord(model: UpdateProductList): void {
  //   model.ProductId = this.Id;
  //   console.log('mymodel  ', model);
  //   this.productService
  //     .UpdateProduct(model.productCode, model)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((response) => {
  //       if (response.IsSuccess) {
  //         this.router.navigate(['/Admin/ProductMaster/Index']);
  //         this.alertService.showAlert({
  //           type: 'success',
  //           text: response.Message,
  //           timer: 5000,
  //         });
  //       } else {
  //         this.alertService.showServerResponseAlert(response);
  //       }
  //       this.isSubmitted = false;
  //     });
  // }

  // onClickPageHeaderAddButton(): void {
  //   this.router.navigate(['/Admin/ProductMaster/Index']);
  // }

  // createRecord(model: Product): void {
  //   model.productCode = `P0000${model.ProductId}`;
  //   console.log(model);
  //   this.productService
  //     .CreateProduct(model)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((response) => {
  //       if (response.IsSuccess) {
  //         this.closeSidebar();
  //         this.alertService.showAlert({
  //           type: 'success',
  //           text: response.Message,
  //           timer: 5000,
  //         });
  //       } else {
  //         console.log(model);
  //         this.alertService.showServerResponseAlert(response);
  //       }
  //       this.isSubmitted = false;
  //     });
  // }

  // deleteRecord(id: any): void {
  //   this.alertService
  //     .showConfirmation({ text: 'Do you really want to delete this record?' })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         this.productService
  //           .DeleteProduct(id)
  //           .pipe(takeUntil(this.destroy$))
  //           .subscribe((response) => {
  //             if (response.IsSuccess) {
  //               this.alertService.showAlert({
  //                 type: 'success',
  //                 text: 'Product deleted successfully',
  //                 timer: 5000,
  //               });
  //             } else {
  //               this.alertService.showServerResponseAlert(response);
  //             }
  //           });
  //       }
  //     });
  // }

  // resetForm(): void {
  //   this.formService.resetFormValue<Product>(this.formConfig, this.form);
  // }
}
