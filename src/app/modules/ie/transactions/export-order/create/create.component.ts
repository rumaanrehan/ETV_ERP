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
import { ExportOrder, Port_SelectList } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { StaticList } from '../../../../../shared/models/select-list';
import { ZAutoComplete1Component } from "../../../../../shared/components/z-form-controls/z-auto-complete/z-auto-complete.component";
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { Product_SelectList, ProductMaster, ProductMasterTemp, ProductRequest } from '../../../../ims/product-master/product-master';
import { Company_SelectList, CompanyMaster, CompanyRequest } from '../../../settings/company-master/company-master';
import { DateUtils } from '../../../../../shared/utility/date-utils';

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

  selectedCustomerAddress!: string | null;

  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrder>;

  customerList: Company_SelectList[] = []

  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDefs: AutoCompleteDef<Product_SelectList>[] = [];

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

  shipmentModes: StaticList[] = [
    {iValue: 1, Text: "Air", cValue: ""},
    {iValue: 2, Text: "Sea", cValue: ""},
    {iValue: 3, Text: "Land", cValue: ""}
  ];
  
  statusList: StaticList[] = [
    { Text: 'Processing', iValue: 1, cValue: '' },
    { Text: 'Ready to Ship', iValue: 2, cValue: '' }
  ];

  // productList: ProductMasterTemp[] = [
  //   { ProductID: 1, ProductName: 'Shoes', ProductCode: 'SH001', TaxRate: 5 },
  //   { ProductID: 2, ProductName: 'Slippers', ProductCode: 'SH002', TaxRate: 12 },
  //   { ProductID: 3, ProductName: 'Water', ProductCode: 'SH003', TaxRate: 18  },
  //   { ProductID: 4, ProductName: 'Attar', ProductCode: 'SH004', TaxRate: 18 },
  //   { ProductID: 5, ProductName: 'Perfume', ProductCode: 'SH005', TaxRate: 18 },
  // ];

  portList: Port_SelectList[] = [
    {PortID: 1, PortName: 'Port of Los Angeles'},
    {PortID: 2, PortName: 'Port of Long Beach'},
    {PortID: 3, PortName: 'Port of New York and New Jersey'},
    {PortID: 4, PortName: 'Port of Savannah'},
    {PortID: 5, PortName: 'Port of Seattle'},
    {PortID: 6, PortName: 'Port of Houston'},
    {PortID: 7, PortName: 'Port of Oakland'},
    {PortID: 8, PortName: 'Port of Miami'},
    {PortID: 9, PortName: 'Port of Norfolk'},
    {PortID: 10, PortName: 'Port of Charleston'}
  ]


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

    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    // this.productMasterAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig.ProductList.items, this.form);
    this.getDetails();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/export-order/dataview']);
    } catch (error) {}
  }

  resetForm(): void {
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  addproduct() {
    // const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
    // this.productMasterAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig.ProductList.items, productForm);
    // this.productListArray.push(productForm);
    const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);

  // Push the form to the FormArray
    this.productListArray.push(productForm);

    // Create and push autocomplete def for this specific form group
    const autoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig.ProductList.items, productForm);
    this.productAutoCompleteDefs.push(autoCompleteDef);
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

  loadCompany(event: string): any {
    try {
      const dto: CompanyRequest = {
        CompanyTypeID: 1,
        CompanyName: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetCompanyList(dto)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.companyMasterAutoCompleteDef.options = response.Data.Items;
          } else {
            this.companyMasterAutoCompleteDef.options = [];
            if (response.Message != "Record not found.") {
              this.alertService.showServerResponseAlert(response);
            }
          }
        },
      });
    } catch (error) {

    }
  }

  loadProduct(event: string, index: number): void {
    try {
      const dto: ProductRequest = {
        ProductName: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetProductList(dto)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.productAutoCompleteDefs[index].options = response.Data.Items;
          } else {
            this.productAutoCompleteDefs[index].options = [];
            if (response.Message != "Record not found.") {
              this.alertService.showServerResponseAlert(response);
            }
          }
        },
      });
    } catch (error) {
    }
  }

  OnSelect_Product(event: Product_SelectList, index: number ): void {
    this.productListArray.at(index).patchValue({ProductID: event.ProductID, ProductName: event.ProductName, TaxRate: event.PurTaxRate});
  }

  productCalculation(index: number): void {
    const group = this.productListArray.at(index) as FormGroup;
    const quantity = group.get('Quantity')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const taxRate = group.get('TaxRate')?.value || 0;
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    const taxAmountBC = (rate * taxRate / 100) * quantity;
    const totalAmountBC = quantity * rate;

    group.patchValue({
      TaxAmountBC: (rate * taxRate / 100) * quantity,
      TaxAmountFC: taxAmountBC / exchangeRate,
      RatePerUnitFC: rate / exchangeRate,
      TotalAmountBC: quantity * rate,
      TotalAmountFC: totalAmountBC / exchangeRate
    }, { emitEvent: false });

    this.form.patchValue({
      SubtotalAmountBC: this.getproductTotalAmountBC(),
      TaxAmountBC: this.getproductTaxAmountBCSum(),
      SubtotalAmountFC: this.getproductTotalAmountBC() * (this.form.get('ExchangeRateToBC')?.value || 1),
      TaxAmountFC: this.getproductTaxAmountBCSum() * (this.form.get('ExchangeRateToBC')?.value || 1)
    });
  }

  getproductTotalAmountBC(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TotalAmountBC')?.value || 0;
      return sum + value;
    }, 0);
  }

  getproductTaxAmountBCSum(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxAmountBC')?.value || 0;
      return sum + value;
    }, 0);
  }

  // loadProduct(event: string): any {
  //   try {
  //     const filterValue = event.toLowerCase();
  //     this.productMasterAutoCompleteDef.options = this.productList.filter(product =>
  //       product.ProductName.toLowerCase().includes(filterValue)
  //     );

  //     console.log(this.productMasterAutoCompleteDef.options);
  //     // const dto: SkillListRequest = {
  //     //   SkillTitle: event,
  //     //   PopulateType: 'AutoSuggest'
  //     // }
  //     // this.pageService.GetSkillList(dto)
  //     //   .pipe(takeUntil(this.destroy$)).subscribe({
  //     //     next: (response) => {
  //     //       if (response.IsSuccess) {
  //     //         this.skillMasterAutoCompleteDef.options = response.Data.Items;
  //     //       } else {
  //     //         this.skillMasterAutoCompleteDef.options = [];
  //     //         if (response.Message != "Record not found.") {
  //     //           this.alertService.showServerResponseAlert(response);
  //     //         }
  //     //       }
  //     //     },
  //     //   });
  //   } catch (error) {

  //   }
  // }

  OnCustomerSelect(event: Company_SelectList): void {
    this.form.patchValue({CustomerID: event.CompanyID, CustomerName: event.CompanyName});
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    console.log(this.form.value);
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
                this.GetOrderItemDetails(response.Data)
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

  GetOrderItemDetails(model: ExportOrder){
    this.route.params.subscribe((params) => {
      const ExportOrderID = +params['id'];
      this.pageService.GetOrderItemDetails(ExportOrderID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            response.Data.Items.forEach(item => {
              const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
              this.productAutoCompleteDefs.push(this.pageService.getProductMasterAutoCompleteDef(this.formConfig.ProductList.items, productForm));
              productForm.patchValue(item);
              this.productListArray.push(productForm);
            });
            const patchedModel = {
              ...model,
              ReferenceDate: DateUtils.toDate(model.ReferenceDate),
              ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate)
            };
            this.form.patchValue(patchedModel);
          }
          else {
            // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
          }
        },
      });
    });
  }
}
