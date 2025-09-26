import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ZTableComponent } from '../../../../../shared/components/z-table/z-table.component';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';
import { Product_SelectList, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyRequest } from '../../../settings/company-master/company-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { SalesQuotation, SalesQuotationDetail } from '../sales-quotation';
import { SalesQuotationService } from '../sales-quotation.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZTableComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('quotedQtyColTemplate', { static: true }) quotedQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountBCColTemplate', { static: true }) taxableAmountBCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountBCColTemplate', { static: true }) taxAmountBCColTemplate!: TemplateRef<any>;

  selectedCustomerAddress!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<SalesQuotation>;
  tableDef!: TableDef<SalesQuotationDetail>;

  customerList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];

  incotermList: StaticList[] = [];

  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  currencyList: StaticList[] = [
    { Text: 'USD - US Dollar', iValue: 1, cValue: 'USD - US Dollar' },
    { Text: 'EUR - Euro', iValue: 2, cValue: 'EUR - Euro' },
    { Text: 'JPY - Japanese Yen', iValue: 3, cValue: 'JPY - Japanese Yen' },
    { Text: 'GBP - British Pound', iValue: 4, cValue: 'GBP - British Pound' },
    { Text: 'INR - Indian Rupee', iValue: 5, cValue: 'INR - Indian Rupee' }
  ];

  statusList: StaticList[] = [
    { Text: 'Draft', iValue: 1, cValue: '#6c757d' },
    { Text: 'Sent', iValue: 2, cValue: '#007bff' },
    { Text: 'Accepted', iValue: 3, cValue: '#28a745' },
    { Text: 'Rejected', iValue: 4, cValue: '#dc3545' }
  ];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesQuotationService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<SalesQuotation>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%" },
        { data: "QuotedQty", label: "Quoted Qty", width: "10%", customTemplate: this.quotedQtyColTemplate },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "QuotedTaxRate", label: "Quoted Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountBCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountBCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'Incoterm', targetList: 'incotermList' }
    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.paymentTermList = data.paymentTermList.Data.Items;
          this.taxSlabList = data.taxSlabList.Data.Items;
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'ExportOrder',
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

  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/sales-quotation/dataview']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  onClickRemoveProductItem(index: number): void {
    this.alertService.showConfirmation({
      text: 'Do you really want to remove this product item?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productListArray.removeAt(index);
        this.tableDef.data = this.productListArray.value;
        this.productCalculation();
      }
    });
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('QuotedQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const salesTaxRate = group.get('QuotedTaxRate')?.value || 0;

    return [quantity * rate, quantity * rate * (salesTaxRate / 100)];
  }

  loadCompany(event: string): void {
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

  onClear_Company(): void {
    this.form.get('CompanyID')?.patchValue(null);
    this.form.get('CompanyName')?.patchValue(null);
  }

  onSearch_Product(event: string): void {
    try {
      const dto: ProductRequest = {
        ProductName: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetProductList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.productAutoCompleteDef.options = response.Data.Items;
            } else {
              this.productAutoCompleteDef.options = [];
              if (response.Message != "Record not found.") {
                this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {
    }
  }

  onSelect_Product(event: Product_SelectList): void {
    this.form.get('ProductID')?.patchValue(null);
    this.form.get('ProductName')?.patchValue(null);

    if (this.tableDef.data.some(p => p.ProductID === event.ProductID)) {
      this.alertService.showToast({
        text: "Product already exists in the table"
      });

      return;
    }

    const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
    productItemForm.patchValue({
      ProductID: event.ProductID,
      ProductName: event.ProductName,
      SalesTaxRate: event.PurTaxRate
    });

    // this.productListArray = [...this.productListArray, productItemForm];
    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;

    // const data: ExportOrder_ProductDetail = {
    //   ProductID: event.ProductID, ProductName: event.ProductName, SalesQty: null, RatePerUnitBC: null, TaxRate: event.PurTaxRate
    // }
    // this.tableDef.data.push(data);
  }

  productCalculation(): void {
    let netAmount = 0;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const quantity = group.get('QuotedQty')?.value || 0;
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const taxRate = group.get('TaxRate')?.value || 0;

      const taxableAmountFC = quantity * rate;
      const taxAmountFC = taxableAmountFC * taxRate / 100;
      const quotationAmountFC = Number((taxableAmountFC + taxAmountFC).toFixed(3));

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        QuotationAmountFC: quotationAmountFC
      }, { emitEvent: true });

      netAmount += quotationAmountFC;

    });

    this.form.patchValue({
      NetAmountFC: Number(netAmount.toFixed(3)),
      SubtotalAmountFC: Number(this.getproductTaxableAmountFC().toFixed(3)),
      TaxAmountFC: Number(this.getproductTaxAmountFCSum().toFixed(3)),
    }, { emitEvent: true });
  }

  // productCalculation(): void {
  //   // const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;
  //   var netAmount: number = 0;
  //   this.productListArray.controls.forEach((group: FormGroup) => {
  //     const quantity = group.get('QuotedQty')?.value || 0;
  //     const rate = group.get('RatePerUnitFC')?.value || 0;
  //     const quotedTaxRate = group.get('TaxRate')?.value || 0;

  //     const taxableAmountFC = quantity * rate;
  //     const taxAmountFC = (taxableAmountFC * quotedTaxRate) / 100;
  //     group.patchValue({
  //       TaxRate: quotedTaxRate,
  //       TaxAmountFC: taxAmountFC,
  //       TaxableAmountFC: taxableAmountFC,
  //       SalesAmountFC: taxableAmountFC + taxAmountFC
  //     }, { emitEvent: true });


  //     netAmount += taxableAmountFC + taxAmountFC;
  //   });

  //   this.form.patchValue({ NetAmountFC: netAmount }, { emitEvent: true });
  // }

  convertAmountsToBC(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = Number((group.get('RatePerUnitFC')?.value || 0).toFixed(3));
      const taxableAmountFC = Number((group.get('TaxableAmountFC')?.value || 0).toFixed(3));
      const taxAmountFC = Number((group.get('TaxAmountFC')?.value || 0).toFixed(3));
      const quotedAmountFC = Number((group.get('QuotationAmountFC')?.value || 0).toFixed(3));

      group.patchValue({
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        QuotationAmountBC: Number((quotedAmountFC * exchangeRate).toFixed(3))
      }, { emitEvent: true });
    });

    // After updating all rows, recalc totals
    const subtotalAmountFC = this.getproductTaxableAmountFC();
    const taxAmountFC = this.getproductTaxAmountFCSum();
    const isRoundOff = this.form.get('IsRoundOff')?.value === true;
    const netAmountFC = this.form.get('NetAmountFC')?.value;

    this.form.patchValue({
      SubtotalAmountBC: Number((subtotalAmountFC * exchangeRate).toFixed(3)),
      TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
      NetAmountBC: isRoundOff ? Math.round(netAmountFC * exchangeRate) : (netAmountFC * exchangeRate),
      CoinAdjustment: isRoundOff ? Number(((netAmountFC * exchangeRate) - Math.round(netAmountFC * exchangeRate)).toFixed(3)) : 0
    });
  }

  // convertAmountsToBC(): void {
  //   const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

  //   this.form.patchValue({
  //     SubtotalAmountBC: this.form.get('SubtotalAmountFC')?.value * exchangeRate,
  //     TaxAmountBC: this.form.get('TaxAmountFC')?.value * exchangeRate,
  //     NetAmountBC: this.form.get('NetAmountFC')?.value * exchangeRate
  //   }, { emitEvent: true });

  //   this.productListArray.controls.forEach((group: FormGroup) => {
  //     const ratePerUnitFC = group.get('RatePerUnitFC')?.value || 0;
  //     const taxableAmountFC = group.get('TaxableAmountFC')?.value || 0;
  //     const taxAmountFC = group.get('TaxAmountFC')?.value || 0;
  //     const quotedAmountFC = group.get('QuotationAmountFC')?.value || 0;

  //     group.patchValue({
  //       RatePerUnitBC: ratePerUnitFC * exchangeRate,
  //       TaxableAmountBC: taxableAmountFC * exchangeRate,
  //       TaxAmountBC: taxAmountFC * exchangeRate,
  //       QuotationAmountFC: quotedAmountFC,
  //       QuotationAmountBC: quotedAmountFC * exchangeRate,
  //     }, { emitEvent: true });
  //   });

  //   // After updating all rows, update the totals
  //   const subtotalAmountFC = this.getproductTaxableAmountFC();
  //   const taxAmountFC = this.getproductTaxAmountFCSum();

  //   this.form.patchValue({
  //     SubtotalAmountFC: subtotalAmountFC,
  //     SubtotalAmountBC: subtotalAmountFC * exchangeRate,
  //     TaxAmountFC: taxAmountFC,
  //     TaxAmountBC: taxAmountFC * exchangeRate
  //   });
  // }

  getproductTaxableAmountFC(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxableAmountFC')?.value || 0;
      return sum + value;
    }, 0);
  }

  getproductTaxAmountFCSum(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxAmountFC')?.value || 0;
      return sum + value;
    }, 0);
  }

  OnCustomerSelect(event: Company_SelectList): void {
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    this.convertAmountsToBC();
    console.log(this.form.value);
    try {
      if (this.form.value.ProductList.length === 0) {
        this.alertService.showToast({
          text: 'Please add at least one product item.',
          type: 'warning'
        });
        this.isSubmitted = false;
        return;
      }

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();

        this.logInvalidControls(this.form);
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
              const model: SalesQuotation = {
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

  createRecord(model: SalesQuotation): void {
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

  updateRecord(model: SalesQuotation): void {
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
                this.router.navigate(['/ie/sales-quotation/dataview']);
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
      const quotationID = +params['id'];
      if (quotationID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(quotationID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  console.log(response);
                  this.GetQuotationDetails(response.Data)
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

  GetQuotationDetails(model: SalesQuotation): void {
    this.route.params.subscribe((params) => {
      const QuotationID = +params['id'];
      this.pageService.GetQuotationDetails(QuotationID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              response.Data.Items.forEach(item => {
                const patchedModel = {
                  ...item,
                  ProductName: item.Product!.ProductName,
                };
                const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productForm.patchValue(patchedModel);
                this.productListArray.push(productForm);
              });
              this.tableDef.data = this.productListArray.value;
              this.selectedCustomerAddress = model.Customer?.BillingAddress!;
              console.log(model.Customer)
              const patchedModel = {
                ...model,
                CustomerID: model.Customer?.CompanyID,
                CustomerName: model.Customer?.CompanyName,
                QuotationDate: DateUtils.toDate(model.QuotationDate),
                ValidityDate: DateUtils.toDate(model.ValidityDate)
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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }


  private roundValue(value: number): { rounded: number, coins: number } {
    if (isNaN(value)) {
      return { rounded: value, coins: 0 };
    }

    const factor = Math.pow(10, 3);
    const rounded = Math.round(value * factor) / factor;
    const coins = +(value - rounded).toFixed(3);

    return { rounded: rounded, coins: coins };
  }

  getStatus(statusId: number | null | undefined): StaticList | undefined {
    return this.statusList.find(s => s.iValue === statusId);
  }

  private logInvalidControls(form: FormGroup | FormArray, parentKey: string = ''): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      const controlPath = parentKey ? `${parentKey}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control, controlPath);
      } else if (control && control.invalid) {
        console.warn(
          `❌ Invalid Control: ${controlPath}`,
          control.errors
        );
      }
    });
  }
}
