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
import { Currency_SelectList } from '../../../../admin/settings/currency-master/currency-master';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';
import { Product_SelectList, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyRequest } from '../../../settings/company-master/company-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { SalesEnquiry_Detail, SalesEnquiry_SelectList, SalesEnquiryRequest } from '../../sales-enquiry/sales-enquiry';
import { SalesQuotation, SalesQuotation_Detail, SalesQuotationDetail } from '../sales-quotation';
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
  @ViewChild('taxableAmountBCColTemplate', { static: true }) taxableAmountBCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountBCColTemplate', { static: true }) taxAmountBCColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;

  selectedCustomerAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;

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
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

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
    this.salesEnquiryAutoCompleteDef = this.pageService.getSalesEnquiryAutoCompleteDef(this.formConfig, this.form);
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

  get isBasedOnSalesEnquiry(): boolean {
    return this.form.get('BasedOn')?.value === 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'IncotermID', targetList: 'incotermList' },
      { fieldName: 'BasedOn', targetList: 'basedOnList' }

    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.paymentTermList = data.paymentTermList.Data.Items;
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

  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/sales-quotation/index']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
  }

  onBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
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
    
  loadSalesEnquiry(event: string): void {
    try {
      const dto: SalesEnquiryRequest = {
        SearchBy: 1,
        SearchValue: event,
        PopulateType: 'AutoSuggest'
      }
      this.pageService.GetSalesEnquiryList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.salesEnquiryAutoCompleteDef.options = response.Data.Items;
            } else {
              this.salesEnquiryAutoCompleteDef.options = [];
              if (response.Message != "Record not found.") {
                // this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {
    }
  }

  onSelect_SalesEnquiry(event: SalesEnquiry_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    if (event.StatusID === 1 || event.StatusID === 2 || event.StatusID === 3) {
      if (event.SalesEnquiryID) {
        this.GetSalesEnquiryDetails(event.SalesEnquiryID);
      }
    } 
    else {
      this.alertService.showToast({
        text: "Cannot select this Sales Enquiry. Only enquiries with 'Received', 'Under Review', or 'Quotation Generated' status can be processed."
      });
      return;
    }
  }

  onClear_SalesEnquiry(): void {
    this.formService.resetFormValue<SalesQuotation>(this.formConfig, this.form);
    this.productListArray.clear();
    this.tableDef.data = [];
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('QuotedQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const salesTaxRate = group.get('TaxRate')?.value || 0;

    return [quantity * rate, quantity * rate * (salesTaxRate / 100)];
  }

  loadCustomer(event: string): void {
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

  OnCustomerSelect(event: Company_SelectList): void {
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }

  onClear_Customer(): void {
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

  getDetails(): void {
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
                  console.log(response);
                  const model: SalesQuotation_Detail = response.Data;

                  this.statusText = response.Data.StatusText;
                  this.statusHex = response.Data.StatusHex;
                  this.selectedCustomerAddress = model.CustomerAddress,

                  this.form.patchValue({
                    SalesQuotationID: model.SalesQuotationID,
                    SalesQuotationNo: model.SalesQuotationNo,
                    BasedOn: model.BasedOn,
                    SalesEnquiryID: model.SalesEnquiryID,
                    SalesEnquiryNo: model.SalesEnquiryNo,
                    CustomerID: model.CustomerID,
                    CustomerName: model.CustomerName,
                    SalesQuotationDate: DateUtils.toDate(response.Data.SalesQuotationDate!),
                    FCCurrencyID: model.FCCurrencyID,
                    IncotermID: model.IncotermID,
                    PaymentTermID: model.PaymentTermID,
                    ExchangeRateToBC: model.ExchangeRateToBC,
                    Narration: model.Narration,
                    IsRoundOff: model.IsRoundOff,
                    SubtotalAmountFC: model.SubtotalAmountFC,
                    TaxAmountFC: model.TaxAmountFC,
                    NetAmountFC: model.NetAmountFC,
                    ValidityDate: response.Data.ValidityDate ? DateUtils.toDate(response.Data.ValidityDate) : null
                  });

                  this.productListArray.clear();
                  response.Data.ProductList.Items.forEach(item => {
                    const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                    productForm.patchValue({
                      ProductID: item.ProductID,
                      ProductName: item.ProductName,
                      QuotedQty: item.QuotedQty,
                      RatePerUnitFC: item.RatePerUnitFC,
                      TaxRate: item.TaxRate,
                      TaxableAmountFC: item.TaxableAmountFC,
                      TaxAmountFC: item.TaxAmountFC
                    });
                    this.productListArray.push(productForm);
                  });

                  this.tableDef.data = this.productListArray.value;
                  this.productCalculation();
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
            SalesEnquiryID: model.SalesEnquiryID,
            CustomerID: model.CustomerID,
            CustomerName: model.CustomerName,
          });

          this.productListArray.clear();
          model.ProductList.Items.forEach(item => {
            const productForm = this.formService.createFormArrayItem(
              this.formConfig.ProductList.items
            );
            productForm.patchValue({
              ProductID: item.ProductID,
              ProductName: item.ProductName,
              QuotedQty: item.RequestedQty
            });
            this.productListArray.push(productForm);
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
