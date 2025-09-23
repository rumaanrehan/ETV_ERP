import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { Product_SelectList, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyRequest } from '../../../settings/company-master/company-master';
import { ExportOrder, ExportOrder_SelectList, ExportOrderRequest } from '../../export-order/export-order';
import { ProformaInvoice, ProformaInvoiceDetail } from '../proforma-invoice';
import { ProformaInvoiceService } from '../proforma-invoice.service';
import { ZTableComponent } from '../../../../../shared/components/z-table/z-table.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { CommonModule } from '@angular/common';
import { Currency_SelectList } from '../../../../admin/settings/currency-master/currency-master';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZTableComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('salesQtyColTemplate', { static: true }) salesQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;

  selectedCustomerAddress: string = '';
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ProformaInvoice>;
  tableDef!: TableDef<ProformaInvoiceDetail>;

  // customerList: Company_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  exportOrderAutoCompleteDef!: AutoCompleteDef<ExportOrder_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  // currencyList: StaticList[] = [
  //   { Text: 'USD - US Dollar', iValue: 1, cValue: 'USD - US Dollar' },
  //   { Text: 'EUR - Euro', iValue: 2, cValue: 'EUR - Euro' },
  //   { Text: 'JPY - Japanese Yen', iValue: 3, cValue: 'JPY - Japanese Yen' },
  //   { Text: 'GBP - British Pound', iValue: 4, cValue: 'GBP - British Pound' },
  //   { Text: 'INR - Indian Rupee', iValue: 5, cValue: 'INR - Indian Rupee' }
  // ];

  basedOnList: StaticList[] = [
    { Text: 'Export Order', iValue: 1, cValue: '' },
    { Text: 'Direct', iValue: 2, cValue: '' }
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProformaInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ProformaInvoice>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.exportOrderAutoCompleteDef = this.pageService.getExportOrderAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%" },
        { data: "SalesQty", label: "Sales Qty", width: "10%", customTemplate: this.salesQtyColTemplate },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    this.getDetails();
  }

  get isBasedOnExportOrder(): boolean {
    return this.form.get('BasedOn')?.value === 1;
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
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
          this.taxSlabList = data.taxSlabList.Data.Items;
          this.currencyList = data.currencyList.Data.Items;
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'ProformaInvoice',
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
      this.router.navigate(['/ie/proforma-invoice/index']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<ProformaInvoice>(this.formConfig, this.form);
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

  onBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<ProformaInvoice>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
  }

  loadExportOrder(event: string): void {
    try {
      const dto: ExportOrderRequest = {
        ExportOrderNo: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetExportOrderList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.exportOrderAutoCompleteDef.options = response.Data.Items;
            } else {
              this.exportOrderAutoCompleteDef.options = [];
              if (response.Message != "Record not found.") {
                this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {
    }
  }

  onSelect_ExportOrder(event: ExportOrder_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    if (event.ExportOrderID) {
      this.GetExportOrderDetails(event.ExportOrderID);
    }
  }

  onClear_ExportOrder(): void {
    this.formService.resetFormValue<ProformaInvoice>(this.formConfig, this.form);
    this.productListArray.clear();
    this.tableDef.data = [];
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

  onSelect_Company(event: Company_SelectList): void {
    if (event.CompanyID) {
      this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
      this.selectedCustomerAddress = event?.BillingAddress || '';
    }
  }

  onClear_Company(): void {
    this.form.get('CustomerID')?.patchValue(null);
    this.form.get('CustomerName')?.patchValue(null);
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

    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;
  }

  productCalculation(): void {
    var subtotalAmount: number = 0;
    var taxAmount: number = 0;
    var netAmount: number = 0;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const quantity = group.get('SalesQty')?.value || 0;
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const salesTaxRate = group.get('SalesTaxRate')?.value || 0;

      const taxableAmountFC = quantity * rate;
      const taxAmountFC = (taxableAmountFC * salesTaxRate) / 100;

      group.patchValue({
        TaxAmountFC: taxAmountFC,
        TaxableAmountFC: taxableAmountFC,
        SalesAmountFC: taxableAmountFC + taxAmountFC
      }, { emitEvent: true });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += (taxableAmountFC + taxAmountFC);
    });

    this.form.patchValue({ NetAmountFC: netAmount, SubtotalAmountFC: subtotalAmount, TaxAmountFC: taxAmount }, { emitEvent: true });
  }

  convertAmountsToBC(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.form.patchValue({
      SubtotalAmountBC: this.form.get('SubtotalAmountFC')?.value * exchangeRate,
      TaxAmountBC: this.form.get('TaxAmountFC')?.value * exchangeRate,
      InsuranceAmountBC: this.form.get('InsuranceAmountFC')?.value * exchangeRate,
      BankChargesBC: this.form.get('BankChargesFC')?.value * exchangeRate,
      FreightChargeBC: this.form.get('FreightChargeFC')?.value * exchangeRate,
      NetAmountBC: this.form.get('NetAmountFC')?.value * exchangeRate
    }, { emitEvent: true });

    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = group.get('RatePerUnitFC')?.value || 0;
      const taxableAmountFC = group.get('TaxableAmountFC')?.value || 0;
      const taxAmountFC = group.get('TaxAmountFC')?.value || 0;
      const salesAmountFC = group.get('SalesAmountFC')?.value || 0;
      // const netAmountFC = group.get('NetAmountFC')?.value || 0;

      group.patchValue({
        RatePerUnitBC: ratePerUnitFC * exchangeRate,
        TaxableAmountBC: taxableAmountFC * exchangeRate,
        TaxAmountBC: taxAmountFC * exchangeRate,
        SalesAmountBC: salesAmountFC * exchangeRate,
      }, { emitEvent: true });
    });

    // After updating all rows, update the totals
    const subtotalAmountFC = this.getproductTaxableAmountFC();
    const taxAmountFC = this.getproductTaxAmountFCSum();

    this.form.patchValue({
      SubtotalAmountFC: subtotalAmountFC,
      SubtotalAmountBC: subtotalAmountFC * exchangeRate,
      TaxAmountFC: taxAmountFC,
      TaxAmountBC: taxAmountFC * exchangeRate
    });
  }

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

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    this.convertAmountsToBC();
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

        // this.logInvalidControls(this.form);
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
              const model: ProformaInvoice = {
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

  createRecord(model: ProformaInvoice): void {
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

  updateRecord(model: ProformaInvoice): void {
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
                this.router.navigate(['/ie/proforma-invoice/index']);
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
      const proformaInvoiceID = +params['id'];
      if (proformaInvoiceID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(proformaInvoiceID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.GetInvoiceItemDetails(response.Data)
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

  GetInvoiceItemDetails(model: ProformaInvoice): void {
    this.pageService.GetInvoiceItemDetails(model.ProformaInvoiceID!)
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
            const patchedModel = {
              ...model,
              ProformaInvoiceDate: DateUtils.toDate(model.ProformaInvoiceDate),
              ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate)
            };
            this.form.patchValue(patchedModel);
          }
          else {
            // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
          }
        },
      });
  }

  GetExportOrderDetails(exportOrderID: number): void {
    try {
      this.pageService.GetExportOrderDetails(exportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response.Data);
              this.GetExportOrderItemDetails(response.Data)
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  GetExportOrderItemDetails(model: ExportOrder): void {
    this.pageService.GetExportOrderItemDetails(model.ExportOrderID!)
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
            const patchedModel = {
              ...model,
              ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate)
            };
            this.form.patchValue({ CustomerID: model.Customer?.CountryID, CustomerName: model.Customer?.CompanyName });
            this.form.patchValue(patchedModel);
          }
          else {
            // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
          }
        },
      });
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }

  // private logInvalidControls(form: FormGroup | FormArray, parentKey: string = ''): void {
  //   Object.keys(form.controls).forEach(key => {
  //     const control = form.get(key);
  //     const controlPath = parentKey ? `${parentKey}.${key}` : key;

  //     if (control instanceof FormGroup || control instanceof FormArray) {
  //       this.logInvalidControls(control, controlPath);
  //     } else if (control && control.invalid) {
  //       console.warn(
  //         `❌ Invalid Control: ${controlPath}`,
  //         control.errors
  //       );
  //     }
  //   });
  // }
}
