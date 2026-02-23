import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Currency_SelectList, CurrencyMaster } from '../../../../admin/settings/currency-master/currency-master';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';
import { Product_SelectList, ProductMaster, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyMaster, CompanyRequest } from '../../../settings/company-master/company-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { PurchaseQuotation, PurchaseQuotationDetail, PurchaseQuotation_SelectList, PurchaseQuotation_Detail } from '../purchase-quotation';
import { PurchaseQuotationService } from '../purchase-quotation.service';
import { GetExchangeRateRequest } from '../../../../../shared/models/currency';
import { CurrencyExchangeService } from '../../../../../shared/services/currency-exchange.service';

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

  selectedVendorAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isAddProductBtnLoading: boolean = false;
  isFromPurchaseRequisition = false;
  isImportAlreadyExists = false;
  disablePrintButton: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<PurchaseQuotation>;
  tableDef!: TableDef<PurchaseQuotationDetail>;

  //Master Lists
  VendorList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  //Static Lists
  basedOnList: StaticList[] = [];
  incotermList: StaticList[] = [];

  //AutoComplete Definitions
  purchaseRequisitionAutoCompleteDef!: AutoCompleteDef<PurchaseQuotation_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  // productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;
  productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[] = [];


  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: PurchaseQuotationService,
    private formService: FormService,
        private currencyExchangeService: CurrencyExchangeService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<PurchaseQuotation>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.purchaseRequisitionAutoCompleteDef = this.pageService.getPurchaseRequisitionAutoCompleteDef(this.formConfig, this.form);
    // this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "20%", customTemplate: this.productAutoCompleteColTemplate },
        { data: "QuotedQty", label: "Quoted Qty", width: "10%", customTemplate: this.quotedQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "HSCode", label: "HS Code", width: "8%" },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "QuotedTaxRate", label: "Quoted Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    // this.getDetails();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const id = paramMap.get('id');
        const purchaseRequisitionID = paramMap.get('purchaseRequisitionID');

        if (id) {
          this.loadPurchaseQuotaion(+id);
          return;
        }
        else if (purchaseRequisitionID) {
          this.isFromPurchaseRequisition = true;
          this.GetPurchaseRequisitionDetails(+purchaseRequisitionID);
          return;
        }

        if (this.productListArray.length === 0) {
          this.AddProductRow();
        }
        this.isEditMode = false;
      });
  }

  get isBasedOnPurchaseRequisition(): boolean {
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
          this.paymentTermList = data.paymentTermList.Data?.Items ?? [];
          this.taxSlabList = data.taxSlabList.Data?.Items ?? [];
          this.currencyList = data.currencyList.Data?.Items ?? [];
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'PurchaseQuotation',
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
      this.router.navigate(['ie/purchase-quotation/index']);
    } catch (error) { }
  }

  onClickNavigateToImportOrder(PurchaseQuotationID: number): void {
    if (PurchaseQuotationID) {
      this.router.navigate([`ie/export-order/from-quotation/${PurchaseQuotationID}`]);
    } else {
      return;
    }
  }

  resetForm(): void {
    this.formService.resetFormValue<PurchaseQuotation>(this.formConfig, this.form);
  }

  onBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<PurchaseQuotation>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
    this.selectedVendorAddress = null;

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

  OnCurrencyChange(): void {
    const model: GetExchangeRateRequest = {
      ToCurrencyCode: this.currencyExchangeService.BASE_CURRENCY_ISO,
      CurrencyID: this.form.get('FCurrencyID')?.value
    }
    this.pageService.GetExchangeRate(model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            debugger;
            this.form.patchValue({ ExchangeRateToBC: response.Data.Conversion_Rate });
          }
        },
      });
  }
  // loadPurchaseRequisition(event: string): void {
  //   try {
  //     const dto: PurchasesRequisitionRequest = {
  //       SearchBy: 1,
  //       EnquiryNo: event,
  //       PopulateType: 'AutoSuggestForPurchaseQuotation'
  //     }
  //     this.pageService.GetPurchaseEnquiryList(dto)
  //       .pipe(takeUntil(this.destroy$)).subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             this.purchaseEnquiryAutoCompleteDef.options = response.Data.Items;
  //           } else {
  //             this.purchaseEnquiryAutoCompleteDef.options = [];
  //           }
  //         },
  //       });
  //   } catch (error) {
  //   }
  // }

  // onSelect_PurchaseQuotation(event: PurchaseQuotation_SelectList): void {
  //   this.productListArray.clear();
  //   this.tableDef.data = [];
  //   if (event.StatusID === 1 || event.StatusID === 2 || event.StatusID === 3) {
  //     if (event.QuotationID) {
  //       this.GetRequisitionIDDetails(event.RequisitionID);
  //     }
  //   }
  //   else {
  //     this.alertService.showToast({
  //       text: "This Purchase Enquiry has already been processed. A quotation cannot be created.",
  //       timer: 5000
  //     });
  //     this.form.patchValue({
  //       PurchaseEnquiryID: null,
  //       PurchaseEnquiryNo: null,
  //     });
  //     return;
  //   }
  // }

  onClear_PurchaseRequisition(): void {
    this.formService.resetFormValue<PurchaseQuotation>(this.formConfig, this.form);
    this.productListArray.clear();
    this.tableDef.data = [];
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('QuotedQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const purchaseTaxRate = group.get('TaxRate')?.value || 0;

    return [quantity * rate, quantity * rate * (purchaseTaxRate / 100)];
  }

  loadVendor(event: string): void {
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

  onSelect_Vendor(event: Company_SelectList): void {
    this.form.patchValue({ VendorID: event.CompanyID, VendorName: event.CompanyName });
    this.selectedVendorAddress = event?.BillingAddress || '';
  }

  onClear_Vendor(): void {
    this.form.get('VendorID')?.patchValue(null);
    this.form.get('VendorName')?.patchValue(null);
    this.selectedVendorAddress = null;
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

  // onSelect_Product(event: Product_SelectList): void {
  //   this.form.get('ProductID')?.patchValue(null);
  //   this.form.get('ProductName')?.patchValue(null);

  //   if (this.tableDef.data.some(p => p.ProductID === event.ProductID)) {
  //     this.alertService.showToast({
  //       text: "Product already exists in the table"
  //     });

  //     return;
  //   }

  //   const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //   productItemForm.patchValue({
  //     ProductID: event.ProductID,
  //     ProductName: event.ProductName,
  //     UOM: event.UOM,
  //     PurchaseTaxRate: event.PurTaxRate
  //   });

  //   // this.productListArray = [...this.productListArray, productItemForm];
  //   this.productListArray.push(productItemForm);
  //   this.tableDef.data = this.productListArray.value;

  //   // const data: ExportOrder_ProductDetail = {
  //   //   ProductID: event.ProductID, ProductName: event.ProductName, SalesQty: null, RatePerUnitBC: null, TaxRate: event.PurTaxRate
  //   // }
  //   // this.tableDef.data.push(data);
  // }

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
      const quantity = group.get('QuotedQty')?.value || 0;
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const taxRate = group.get('TaxRate')?.value || 0;

      const taxableAmountFC = quantity * rate;
      const taxAmountFC = taxableAmountFC * taxRate / 100;
      const totalAmountFC = Number((taxableAmountFC + taxAmountFC).toFixed(3));

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        TotalAmountFC: totalAmountFC
      }, { emitEvent: true });

      netAmount += totalAmountFC;

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
      const totalAmountFC = Number((group.get('QuotationAmountFC')?.value || 0).toFixed(3));

      group.patchValue({
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        TotalAmountBC: Number((totalAmountFC * exchangeRate).toFixed(3))
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
              const model: PurchaseQuotation = {
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

  createRecord(model: PurchaseQuotation): void {
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
              this.selectedVendorAddress = null;
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

  updateRecord(model: PurchaseQuotation): void {
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
              this.selectedVendorAddress = null;
              setTimeout(() => {
                this.router.navigate(['/ie/purchase-quotation/index']);
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
                  this.selectedVendorAddress = response.Data.VendorAddress;
                  this.statusText = response.Data.StatusText;
                  this.statusHex = response.Data.StatusHex;
                  this.isImportAlreadyExists = response.Data.IsImportAlreadyExists;
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
                    SalesQuotationDate: DateUtils.toDate(response.Data.PurchaseQuotationDate!),
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

  GetPurchaseRequisitionDetails(purchaseRequisitionID: number): void {
    this.pageService.GetPurchaseRequisitionDetails(purchaseRequisitionID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            const model: PurchaseQuotation_Detail = response.Data;

            this.selectedVendorAddress = model.VendorAddress,
              this.form.patchValue({
                PurchaseRequisitionID: model.PurchaseRequisitionID,
                PurchaseRequisitionNo: model.PurchaseRequisitionNo,
                VendorID: model.VendorID,
                VendorName: model.VendorName,
              });

            this.productListArray.clear();
            model.ProductList.Items.forEach(item => {
              const productForm = this.formService.createFormArrayItem(
                this.formConfig.ProductList.items
              );
              productForm.patchValue({
                ProductID: item.ProductID,
                ProductName: item.ProductName,
                QuotedQty: item.QuotedQty,
                UOM: item.UOM,
                  HSCode: item.HSCode,
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

  private loadPurchaseQuotaion(id: number): void {
    this.isEditMode = true;

    try {
      this.pageService.GetDetails(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!response.IsSuccess) {
              this.alertService.showServerResponseAlert(response);
              return;
            }
            const model: PurchaseQuotation_Detail = response.Data;
            
            this.statusText = response.Data.StatusText;
            this.statusHex = response.Data.StatusHex;
            this.selectedVendorAddress = model.VendorAddress,
            this.isImportAlreadyExists = response.Data.IsImportAlreadyExists;

            this.form.patchValue({
              PurchaseQuotationID: model.PurchaseQuotationID,
              PurchaseQuotationNo: model.PurchaseQuotationNo,
              BasedOn: model.BasedOn,
              VendorName: model.VendorName,
              PurchaseQuotationDate: DateUtils.toDate(response.Data.PurchaseQuotationDate!),
              VendorID: model.VendorID,
              VendorAddress: model.VendorAddress,
              FCurrencyID: model.FCurrencyID,
              IncotermID: model.IncotermID,
              PaymentTermID: model.PaymentTermID,
              ExchangeRateToBC: model.ExchangeRateToBC,
              ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!),
              Narration: model.Narration,
              IsRoundOff: model.IsRoundOff,
              SubtotalAmountFC: model.SubtotalAmountFC,
              TaxAmountFC: model.TaxAmountFC,
              NetAmountFC: model.NetAmountFC,
              ValidityDate: response.Data.ValidityDate ? DateUtils.toDate(response.Data.ValidityDate) : null
            });

            this.productListArray.clear();
            response.Data.ProductList.Items.forEach(item => {
              const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
              productItemForm.patchValue(item);
              this.productListArray.push(productItemForm);
              const index = this.productListArray.length - 1;

              this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
            });

            this.tableDef.data = this.productListArray.value;
            this.ProductCalculation();
          }
        });
    }
    catch (error) { }
  }

  handleComponentLoad(componentName: string) {
    if (this.componentRef) {
      this.destroyComponent();
    }

    switch (componentName) {
      case 'VendorCreateComponent':
        return this.createVendorComponent();
      case 'CurrencyCreateComponent':
        return this.createCurrencyComponent();
      case 'ProductCreateComponent':
        return this.createProductComponent();
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  }

  loadDynamicComponent(model: any) {
    setTimeout(() => {
      this.componentRef?.instance.openSidebar(true, false, model);
      this.componentRef?.instance.closeSidebarEvent.subscribe(() => {
        this.destroyComponent();
      });
    })
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
      UOM: event.UOM
    });

    this.tableDef.data = this.productListArray.value
  }

  HandleComponentLoad(componentName: string) {
    if (this.componentRef) {
      this.destroyComponent();
    }

    switch (componentName) {
      case 'VendorCreateComponent':
        return this.createVendorComponent();
      case 'CurrencyCreateComponent':
        return this.createCurrencyComponent();
      case 'ProductCreateComponent':
        return this.createProductComponent();
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  }
  OnClear_Product(index: number): void {
    const row = this.productListArray.at(index) as FormGroup;
    row.patchValue({ ProductID: null, ProductName: null, UOM: null });

    this.tableDef.data = this.productListArray.value;
  }


  destroyComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

  async createVendorComponent() {
    const { CreateComponent } = await import('../../../settings/company-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: CompanyMaster = this.formService.createNullObject<CompanyMaster>();
    this.loadDynamicComponent(model);
  }

  async createCurrencyComponent() {
    const { CreateComponent } = await import('../../../../admin/settings/currency-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: CurrencyMaster = this.formService.createNullObject<CurrencyMaster>();
    this.loadDynamicComponent(model);
  }

  async createProductComponent() {
    const { CreateComponent } = await import('../../../../ims/settings/product-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ProductMaster = this.formService.createNullObject<ProductMaster>();
    this.loadDynamicComponent(model);
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
  PrintPurchaseQuotation(): void {
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


