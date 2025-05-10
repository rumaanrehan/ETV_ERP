import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { ApiListResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { StaticList } from '../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { ItemCategoryMaster_SelectList } from '../../ItemCategoryMaster/item-category-master';
import { ManufacturerMaster_SelectList } from '../../Manufacturer-Master/manufacturer-master';
import { UOMMaster_SelectList } from '../../UOMMaster/UOM-master';
import { ProductMasterService } from '../product-master.service';
import { ProductMaster } from './../product-master';
import { ItemGroupMaster_SelectList } from '../../ItemGroupMaster/item-group-master';
import { ItemMaster_SelectList } from '../../GenericItemMaster/item-master';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule],
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

  itemGroupList: ItemGroupMaster_SelectList[] = [];
  itemCategoryList: ItemCategoryMaster_SelectList[] = [];
  itemList: ItemMaster_SelectList[] = [];
  manufacturerList: ManufacturerMaster_SelectList[] = [];
  uOMList: UOMMaster_SelectList[] = [];
  purTaxOnList: StaticList[] = [];
  taxSlabIDList: StaticList[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProductMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ProductMaster>( this.formConfig );
    this.formService.initializeFormValidationMessage( this.formConfig, this.form );

    this.getDetails();
    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList() {
    this.loadStaticLists([
      { fieldName: 'PurTaxOn', targetList: 'purTaxOnList' },
      { fieldName: 'TaxSlabID', targetList: 'taxSlabIDList' },
    ]);

    this.pageService
    .GetMasterDropdownLists()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.itemGroupList = data.itemGroupList.Data.Items;
        this.itemCategoryList = data.itemCategoryList.Data.Items;
        this.itemList = data.itemList.Data.Items;
        this.manufacturerList = data.manufacturerList.Data.Items;
        this.uOMList = data.uOMList.Data.Items;
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

  onClickPageHeaderAddButton(): void {
    try {
      this.router.navigate(['/ims/product-master/index']);
    } catch (error) {}
  }

  resetForm(): void {
    this.formService.resetFormValue<ProductMaster>(this.formConfig, this.form);
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
        this.alertService
          .showConfirmationWithInput({
            text: 'Do you really want to Update?',
          })
          .then((result) => {
            if (result.isConfirmed) {
              const model: ProductMaster = {
                ...this.formService.transformFormData(this.form.value),
                ReasonToUpdate: result.value,
              };
              this.updateRecord(model);
            } else {
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
      this.pageService
      .CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.alertService.showAlert({
              type: 'success',
              text: response.Message,
              timer: 5000,
            });
            setTimeout(() => {
              this.ngOnInit();
            }, 2000);
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.isSubmitted = false;
        },
      });
    }
    catch (error) {

    }
  }

  updateRecord(model: ProductMaster): void {
    try {
      this.pageService
      .UpdateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.alertService.showAlert({
              type: 'success',
              text: response.Message,
              timer: 5000,
            });
            setTimeout(() => {
              this.router.navigate(['/IMS/ProductMaster']);
            }, 2000);
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.isSubmitted = false;
        },
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
          this.pageService
          .GetDetails(ProductID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.form.patchValue(response.Data);
              } else {
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
}