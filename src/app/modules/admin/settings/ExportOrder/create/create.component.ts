import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ExportOrder } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { StaticList } from '../../../../../shared/models/select-list';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrder>;

  currencyList: StaticList[] = [
    { Text: 'USD - US Dollar', iValue: 1, cValue: 'USD - US Dollar' },
    { Text: 'EUR - Euro', iValue: 2, cValue: 'EUR - Euro' },
    { Text: 'JPY - Japanese Yen', iValue: 3, cValue: 'JPY - Japanese Yen' },
    { Text: 'GBP - British Pound', iValue: 4, cValue: 'GBP - British Pound' },
    { Text: 'INR - Indian Rupee', iValue: 5, cValue: 'INR - Indian Rupee' }
  ];
  incotermList: StaticList[] = [
    { Text: 'FOB (Free On Board)', iValue: 1, cValue: 'FOB (Free On Board)' },
    { Text: 'CIF (Cost, Insurance, Freight)', iValue: 2, cValue: 'CIF (Cost, Insurance, Freight)' },
    { Text: 'EXW (Ex-Works)', iValue: 3, cValue: 'EXW (Ex-Works)' }
  ];
  shipmentModes = [
    { label: 'Air', value: 'Air' },
    { label: 'Sea', value: 'Sea' }
  ];
  statusList: StaticList[] = [
    { Text: 'processing', iValue: 1, cValue: 'Processing' },
    { Text: 'ready_to_ship', iValue: 2, cValue: 'Ready to Ship' }
  ];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ExportOrder>( this.formConfig );
    this.formService.initializeFormValidationMessage( this.formConfig, this.form );

    this.form.addControl('ProductList', this.fb.array([]));
    // this.form.addControl('products', this.fb.array([
    //   this.createProduct('Table', 3, 7800),
    //   this.createProduct('Chair', 5, 4500)
    // ]));
    
    this.getDetails();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/admin/export-order/dataview']);
    } catch (error) {}
  }

  resetForm(): void {
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  addproduct() {
    const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
    this.productListArray.push(productForm);
  }

  removeProduct(index: number) {
    this.productListArray.removeAt(index);
  }

  getAmount(index: number): number {
    const group = this.productListArray.at(index);
    const quantity = group.get('Quantity')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    return quantity * rate;
}

  
  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    try {
      // this.createRecord(this.formService.transformFormData(this.form.value));
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
              const model: ExportOrder = {
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
  
  createRecord(model: ExportOrder): void {
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
  
  updateRecord(model: ExportOrder): void {
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
              this.router.navigate(['/admin/export-order/dataview']);
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
      const ExportOrderID = +params['id'];
      if (ExportOrderID) {
        this.isEditMode = true;
        try {
          this.pageService
          .GetDetails(ExportOrderID)
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
