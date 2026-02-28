import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { GetExchangeRateRequest } from '../../../../../shared/models/currency';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { CurrencyExchangeService } from '../../../../../shared/services/currency-exchange.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { Currency_SelectList, CurrencyMaster } from '../../../../admin/settings/currency-master/currency-master';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';
import { Product_SelectList, ProductMaster, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyMaster, CompanyRequest } from '../../../settings/company-master/company-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { SalesEnquiry_Detail, SalesEnquiry_SelectList, SalesEnquiryRequest } from '../../sales-enquiry/sales-enquiry';
import { SalesQuotation, SalesQuotationDetail } from '../sales-quotation';
import { SalesQuotationService } from '../sales-quotation.service';

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
  @ViewChild('productAutoCompleteColTemplate', { static: true }) productAutoCompleteColTemplate!: TemplateRef<any>;
  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('quotedQtyColTemplate', { static: true }) quotedQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  selectedCustomerAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isFromSalesEnquiry = false;
  isExportAlreadyExists = false;
  isAddProductBtnLoading: boolean = false;
  disablePrintButton: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<SalesQuotation>;
  tableDef!: TableDef<SalesQuotationDetail>;

  //Master Lists
  customerList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  //Static Lists
  basedOnList: StaticList[] = [];
  incotermList: StaticList[] = [];

  //AutoComplete Definitions
  salesEnquiryAutoCompleteDef!: AutoCompleteDef<SalesEnquiry_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesQuotationService,
    private currencyExchangeService: CurrencyExchangeService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<SalesQuotation>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.salesEnquiryAutoCompleteDef = this.pageService.getSalesEnquiryAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      tableHeader: "Product List",
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "20%", customTemplate: this.productAutoCompleteColTemplate },
        { data: "QuotedQty", label: "Quoted Qty", width: "10%", customTemplate: this.quotedQtyColTemplate },
        { data: "UOM", label: "UOM", width: "8%" },
        { data: "HSCode", label: "HS Code", width: "8%" },
        { data: "RatePerUnitFC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "QuotedTaxRate", label: "Quoted Tax Rate", width: "12%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountFC", label: "Taxable Amount", width: "10%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountFC", label: "Tax Amount", width: "12%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "7%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    };

    this.LoadDropdownList();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const salesQuotationID = Number(paramMap.get('id'));

        if (salesQuotationID) {
          this.GetDetails();
          return;
        }
        else if (this.navContextService.source) {
          this.GetSalesEnquiryDetails(this.navContextService.sourceId!);
          return;
        }

        if (this.productListArray.length === 0) {
          this.AddProductRow();
        }
      });
  }

  get isBasedOnSalesEnquiry(): boolean {
    return this.form.get('BasedOn')?.value === 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  LoadDropdownList(): void {
    this.LoadStaticLists([
      { fieldName: 'IncotermID', targetList: 'incotermList' },
      { fieldName: 'BasedOn', targetList: 'basedOnList' }
    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.paymentTermList = data.paymentTermList.Data?.Items ?? [];
          this.taxSlabList = data.taxSlabList.Data?.Items ?? [];
          this.currencyList = data.currencyList.Data?.Items ?? [];
        },
      });
  }

  LoadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'SalesQuotation',
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

  OnClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/sales-quotation/index']);
    } catch (error) { }
  }

  OnClickNavigateToExportOrder(salesQuotationID: number): void {
    if (salesQuotationID) {
      this.navContextService.set('sales-quotation', salesQuotationID);
      this.router.navigate([`ie/export-order/create`]);
    }
  }

  ResetForm(): void {
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
  }

  OnBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);
    this.productListArray.clear();
    this.tableDef.data = [];
    this.selectedCustomerAddress = null;

    if (basedOnValue === 2) {
      this.AddProductRow();
    }
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  OnClickRemoveProductItem(index: number): void {
    if (this.productListArray.at(index).value.ProductName !== null) {
      this.alertService.showConfirmation({
        text: `Do you really want to remove <b>${this.productListArray.at(index).value.ProductName}<b>?`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.productListArray.removeAt(index);
          this.productAutoCompleteDef.splice(index, 1);
          this.tableDef.data = this.productListArray.value;
          this.ProductCalculation();
          if (this.productListArray.length == 0) {
            this.AddProductRow();
          }
          return
        }
      });
    }
    else {
      this.productListArray.removeAt(index);
      this.productAutoCompleteDef.splice(index, 1);
      this.tableDef.data = this.productListArray.value;
      this.ProductCalculation();
      if (this.productListArray.length == 0) {
        this.AddProductRow();
      }
    }
  }

  LoadSalesEnquiry(event: string): void {
    try {
      const dto: SalesEnquiryRequest = {
        SearchBy: 1,
        SalesEnquiryNo: event,
        PopulateType: 'AutoSuggestForSalesQuotation'
      }
      this.pageService.GetSalesEnquiryList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.salesEnquiryAutoCompleteDef.options = response.Data.Items;
            } else {
              this.salesEnquiryAutoCompleteDef.options = [];
            }
          },
        });
    } catch (error) {
    }
  }

  OnSelect_SalesEnquiry(event: SalesEnquiry_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    if (event.StatusID === 1 || event.StatusID === 2 || event.StatusID === 3) {
      if (event.SalesEnquiryID) {
        this.GetSalesEnquiryDetails(event.SalesEnquiryID);
      }
    }
    else {
      this.alertService.showToast({
        text: "This Sales Enquiry has already been processed. A quotation cannot be created.",
        timer: 5000
      });
      this.form.patchValue({
        SalesEnquiryID: null,
        SalesEnquiryNo: null,
      });
      return;
    }
  }

  OnClear_SalesEnquiry(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
    this.productListArray.clear();
    this.selectedCustomerAddress = null;
    this.tableDef.data = [];
    this.form.get('BasedOn')?.patchValue(basedOnValue);
  }

  GetAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('QuotedQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const salesTaxRate = group.get('TaxRate')?.value || 0;

    return [quantity * rate, quantity * rate * (salesTaxRate / 100)];
  }

  LoadCustomer(event: string): void {
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
            }
          },
        });
    } catch (error) {

    }
  }

  OnSelect_Customer(event: Company_SelectList): void {
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }

  OnClear_Customer(): void {
    this.form.get('CustomerID')?.patchValue(null);
    this.form.get('CustomerName')?.patchValue(null);
    this.selectedCustomerAddress = null;
  }

  OnCurrencyChange(): void {
    const model: GetExchangeRateRequest = {
      ToCurrencyCode: this.currencyExchangeService.BASE_CURRENCY_ISO,
      CurrencyID: this.form.get('FCCurrencyID')?.value
    }
    this.pageService.GetExchangeRate(model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.form.patchValue({ ExchangeRateToBC: response.Data.Conversion_Rate });
          }
        },
      });
  }

  OnSearch_Product(event: string, rowIndex: number): void {
    try {
      const dto: ProductRequest = {
        ProductName: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetProductList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.productAutoCompleteDef[rowIndex].options = response.Data.Items;
            } else {
              this.productAutoCompleteDef[rowIndex].options = [];
            }
          },
        });
    } catch (error) {
    }
  }

  OnSelect_Product(event: Product_SelectList, index: number): void {
    const row = this.productListArray.at(index) as FormGroup;

    // Duplicate check
    if (this.productListArray.controls.some(
      (ctrl, i) => i !== index && ctrl.value.ProductID === event.ProductID
    )) {
      this.alertService.showToast({
        text: 'Product already exists in the table'
      });

      row.patchValue({ ProductName: null, ProductID: null });
      return;
    }

    row.patchValue({
      ProductID: event.ProductID,
      ProductName: event.ProductName,
      UOM: event.UOM,
      HSCode: event.HSCode
    });

    this.tableDef.data = this.productListArray.value
  }

  OnClear_Product(index: number): void {
    const row = this.productListArray.at(index) as FormGroup;
    row.patchValue({ ProductID: null, ProductName: null, UOM: null });

    this.tableDef.data = this.productListArray.value;
  }

  AddProductRow(): void {
    this.isAddProductBtnLoading = true;
    const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);

    this.productListArray.push(productItemForm);
    const index = this.productListArray.length - 1;

    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
    this.tableDef.data = this.productListArray.value;

    this.isAddProductBtnLoading = false;
  }

  ProductCalculation(): void {
    var subtotalAmount: number = 0;
    var taxAmount: number = 0;
    var netAmount: number = 0;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const quantity = group.get('QuotedQty')?.value || 0;
      const taxRate = group.get('TaxRate')?.value || 0;

      const taxableAmountFC = Number((quantity * rate).toFixed(3));
      const taxAmountFC = Number((taxableAmountFC * taxRate / 100).toFixed(3));
      const quotationAmountFC = Number((taxableAmountFC + taxAmountFC).toFixed(3));

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        QuotationAmountFC: quotationAmountFC
      }, { emitEvent: false });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += quotationAmountFC;
    });

    this.form.patchValue({
      SubtotalAmountFC: Number(subtotalAmount.toFixed(3)),
      TaxAmountFC: Number(taxAmount.toFixed(3)),
      NetAmountFC: Number(netAmount.toFixed(3)),
    }, { emitEvent: true });
  }

  ConvertAmountsToBC(): void {
    // 1️⃣ Get Exchange Rate
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = Number((group.get('RatePerUnitFC')?.value || 0).toFixed(3));
      const taxableAmountFC = Number((group.get('TaxableAmountFC')?.value || 0).toFixed(3));
      const taxAmountFC = Number((group.get('TaxAmountFC')?.value || 0).toFixed(3));
      const quotationAmountFC = Number((group.get('QuotationAmountFC')?.value || 0).toFixed(3));

      group.patchValue({
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        QuotationAmountBC: Number((quotationAmountFC * exchangeRate).toFixed(3))
      }, { emitEvent: false });
    });
    
    const subtotalAmountFC = this.form.get('SubtotalAmountFC')?.value || 0;
    const taxAmountFC = this.form.get('TaxAmountFC')?.value || 0;
    const netAmountFC = this.form.get('NetAmountFC')?.value;
    const isRoundOff = this.form.get('IsRoundOff')?.value === true;

    // 4️⃣ Calculate BC Values and Coin Adjustment
    const subtotalAmountBC = subtotalAmountFC * exchangeRate;
    const taxAmountBC = taxAmountFC * exchangeRate;
    const netAmountBC = netAmountFC * exchangeRate;

    const roundedNetBC = Math.round(netAmountBC);
    const coinAdjustment = isRoundOff ? Number((netAmountBC - roundedNetBC).toFixed(3)) : 0;

    // 5️⃣ Patch All Summary Fields (Once)
    this.form.patchValue({
      SubtotalAmountBC: Number(subtotalAmountBC.toFixed(3)),
      TaxAmountBC: Number(taxAmountBC.toFixed(3)),
      NetAmountBC: isRoundOff ? roundedNetBC :  Number(netAmountBC.toFixed(3)),
      CoinAdjustment: coinAdjustment
    }, { emitEvent: false });

    // 6️⃣ Debug Log to Verify Calculations only for development, should be removed in production
    if(this.form.get('ProductList')?.value.reduce((sum: number, item: any) => sum + (item.TaxableAmountBC || 0), 0) !== this.form.get('SubtotalAmountBC')?.value) {
      console.log(
        "Discrepancy in SubtotalAmountBC Calculation!, Backend Should Verify This. Product List total:",
        this.form.get('ProductList')?.value.reduce((sum: number, item: any) => sum + (item.TaxableAmountBC || 0), 0),
        " Patched SubtotalAmountBC:", this.form.get('SubtotalAmountBC')?.value
      );
    }
  }

  // GetproductTaxableAmountFC(): number {
  //   return this.productListArray.controls.reduce((sum, group) => {
  //     const value = group.get('TaxableAmountFC')?.value || 0;
  //     return sum + value;
  //   }, 0);
  // }

  // GetproductTaxAmountFCSum(): number {
  //   return this.productListArray.controls.reduce((sum, group) => {
  //     const value = group.get('TaxAmountFC')?.value || 0;
  //     return sum + value;
  //   }, 0);
  // }

  OnSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    this.ProductCalculation();
    this.ConvertAmountsToBC();
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
        this.alertService.showValidationAlert(this.formService.getValidationMessages(this.formConfig));
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
              this.UpdateRecord(model);
            } else {
              this.isSubmitted = false;
            }
          });
      }
      else {
        this.CreateRecord(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  CreateRecord(model: SalesQuotation): void {
    try {
      this.pageService.CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000,
              });
              this.selectedCustomerAddress = null;
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

  UpdateRecord(model: SalesQuotation): void {
    try {
      this.pageService.UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000,
              });
              this.selectedCustomerAddress = null;
              setTimeout(() => {
                this.router.navigate(['/ie/sales-quotation/index']);
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

  GetDetails(): void {
    this.route.params.subscribe((params) => {
      const salesQuotationID = +params['id'];
      if (salesQuotationID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(salesQuotationID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.selectedCustomerAddress = response.Data.CustomerAddress;
                  this.statusText = response.Data.StatusText;
                  this.statusHex = response.Data.StatusHex;
                  this.isExportAlreadyExists = response.Data.IsExportAlreadyExists;
                  response.Data.ProductList.Items.forEach(item => {
                    const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                    productItemForm.patchValue(item);
                    this.productListArray.push(productItemForm);
                    const index = this.productListArray.length - 1;

                    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
                  });

                  this.tableDef.data = this.productListArray.value;
                  const { ProductList, ...formValues } = response.Data;
                  const data = {
                    ...formValues,
                    SalesQuotationDate: DateUtils.toDate(response.Data.SalesQuotationDate!),
                    ValidityDate: DateUtils.toDate(response.Data.ValidityDate!)
                  }

                  this.form.patchValue(data);
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

  GetSalesEnquiryDetails(salesEnquiryID: number): void {
    this.pageService.GetSalesEnquiryDetails(salesEnquiryID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            const model: SalesEnquiry_Detail = response.Data;

            this.selectedCustomerAddress = model.CustomerAddress,
              this.form.patchValue({
                BasedOn: 1,
                SalesEnquiryID: model.SalesEnquiryID,
                SalesEnquiryNo: model.SalesEnquiryNo,
                CustomerID: model.CustomerID,
                CustomerName: model.CustomerName,
              });

            this.productListArray.clear();
            response.Data.ProductList.Items.forEach(item => {
              const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
              productItemForm.patchValue({
                ProductID: item.ProductID,
                ProductName: item.ProductName,
                QuotedQty: item.RequestedQty,
                UOM: item.UOM
              });
              this.productListArray.push(productItemForm);
              const index = this.productListArray.length - 1;

              this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
            });

            this.tableDef.data = this.productListArray.value;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        error: (err) => {
          // this.alertService.showServerResponseAlert();
        }
      });
  }

  HandleComponentLoad(componentName: string) {
    if (this.componentRef) {
      this.DestroyComponent();
    }

    switch (componentName) {
      case 'VendorCreateComponent':
        return this.CreateVendorComponent();
      case 'CurrencyCreateComponent':
        return this.CreateCurrencyComponent();
      case 'ProductCreateComponent':
        return this.CreateProductComponent();
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  }

  LoadDynamicComponent(model: any) {
    setTimeout(() => {
      this.componentRef?.instance.openSidebar(true, false, model);
      this.componentRef?.instance.closeSidebarEvent.subscribe(() => {
        this.DestroyComponent();
      });
    })
  }

  DestroyComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

  async CreateVendorComponent() {
    const { CreateComponent } = await import('../../../settings/company-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: CompanyMaster = this.formService.createNullObject<CompanyMaster>();
    this.LoadDynamicComponent(model);
  }

  async CreateCurrencyComponent() {
    const { CreateComponent } = await import('../../../../admin/settings/currency-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: CurrencyMaster = this.formService.createNullObject<CurrencyMaster>();
    this.LoadDynamicComponent(model);
  }

  async CreateProductComponent() {
    const { CreateComponent } = await import('../../../../ims/settings/product-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ProductMaster = this.formService.createNullObject<ProductMaster>();
    this.LoadDynamicComponent(model);
  }

  PrintSalesQuotation(): void {
    this.disablePrintButton = true;
    this.route.params.subscribe(params => {
      const salesQuotationID = +params['id'];

      if (!salesQuotationID) return;

      this.isEditMode = true;
      const model = {
        SalesQuotationID: salesQuotationID
      };
      this.pageService.GeneratePdf(model).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error: (err) => {
          console.error('PDF generation failed', err);
        },
        complete: () => {
          this.disablePrintButton = false;
        }
      });
    });
  }
}
