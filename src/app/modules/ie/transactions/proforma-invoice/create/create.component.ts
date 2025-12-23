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
import { ExportOrder_Detail, ExportOrder_SelectList, ExportOrderRequest } from '../../export-order/export-order';
import { ProformaInvoice, ProformaInvoiceDetail } from '../proforma-invoice';
import { ProformaInvoiceService } from '../proforma-invoice.service';

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
  @ViewChild('salesQtyColTemplate', { static: true }) salesQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  selectedCustomerAddress: string = '';
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode = false;
  isSubmitted = false;
  isFromExportOrder = false;
  isTaxAlreadyExists = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ProformaInvoice>;
  tableDef!: TableDef<ProformaInvoiceDetail>;

  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  basedOnList: StaticList[] = [];

  exportOrderAutoCompleteDef!: AutoCompleteDef<ExportOrder_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

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
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    // this.getDetails();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const id = paramMap.get('id');
        const exportOrderID = paramMap.get('exportOrderID');
        console.log("Export Order ID or ProformaInvoiceID from route paramMap:", exportOrderID, id);

        if (id) {
          this.loadProformaInvoice(+id);
          return;
        }
        else if (exportOrderID) {
          this.isFromExportOrder = true;
          this.GetExportOrder(+exportOrderID);
          return;
        }

        this.isEditMode = false;
      });
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
    this.loadStaticLists([
      { fieldName: 'BasedOn', targetList: 'basedOnList' }
    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.taxSlabList = data?.taxSlabList?.Data?.Items ?? [];
          this.currencyList = data?.currencyList?.Data?.Items ?? [];
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

  onClickNavigateToTaxInvoice(proformaInvoiceID: number): void {
    if (proformaInvoiceID) {
      this.router.navigate([`ie/tax-invoice/from-proforma/${proformaInvoiceID}`]);
    } else {
      return;
    }
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
      this.GetExportOrder(event.ExportOrderID);
    }
  }

  onClear_ExportOrder(): void {
    this.formService.resetFormValue<ProformaInvoice>(this.formConfig, this.form);
    this.productListArray.clear();
    this.tableDef.data = [];
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
            }
          },
        });
    } catch (error) {

    }
  }

  onSelect_Customer(event: Company_SelectList): void {
    if (event.CompanyID) {
      this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
      this.selectedCustomerAddress = event?.BillingAddress || '';
    }
  }

  onClear_Customer(): void {
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
      UOM: event.UOM,
      SalesTaxRate: event.PurTaxRate
    });

    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;
  }

  productCalculation(): void {
    var subtotalAmount: number = 0;
    var taxAmount: number = 0;
    var netAmount: number = 0;

    const freightCharge = this.form.get('FreightChargeFC')?.value || 0;
    const bankCharges = this.form.get('BankChargesFC')?.value || 0;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const quantity = group.get('SalesQty')?.value || 0;
      const salesTaxRate = group.get('SalesTaxRate')?.value || 0;

      const taxableAmountFC = quantity * rate;
      const taxAmountFC = (taxableAmountFC * salesTaxRate) / 100;

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        SalesAmountFC: taxableAmountFC + taxAmountFC
      }, { emitEvent: true });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += (taxableAmountFC + taxAmountFC);
    });

    netAmount += (freightCharge + bankCharges);

    this.form.patchValue({ NetAmountFC: netAmount, SubtotalAmountFC: subtotalAmount, TaxAmountFC: taxAmount }, { emitEvent: true });
  }

  convertAmountsToBC(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.form.patchValue({
      SubtotalAmountBC: this.form.get('SubtotalAmountFC')?.value * exchangeRate,
      TaxAmountBC: this.form.get('TaxAmountFC')?.value * exchangeRate,
      InsuranceAmountBC: this.form.get('InsuranceAmountFC')?.value * exchangeRate,
      BankChargesBC: this.form.get('BankChargesFC')?.value * exchangeRate,
      NetAmountBC: this.form.get('NetAmountFC')?.value * exchangeRate
    }, { emitEvent: true });

    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = Number(((group.get('RatePerUnitFC')?.value) || 0).toFixed(3));
      const taxableAmountFC = Number(((group.get('TaxableAmountFC')?.value) || 0).toFixed(3));
      const taxAmountFC = Number(((group.get('TaxAmountFC')?.value) || 0).toFixed(3));
      const salesAmountFC = Number(((group.get('SalesAmountFC')?.value) || 0).toFixed(3));

      group.patchValue({
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        SalesAmountBC: Number((salesAmountFC * exchangeRate).toFixed(3)),
      }, { emitEvent: true });
    });

    const subtotalAmountFC = this.getproductTaxableAmountFC();
    const taxAmountFC = this.getproductTaxAmountFCSum();
    const isRoundOff = this.form.get('IsRoundOff')?.value === true;
    const netAmountFC = this.form.get('NetAmountFC')?.value;

    this.form.patchValue({
      SubtotalAmountFC: Number(subtotalAmountFC.toFixed(3)),
      SubtotalAmountBC: Number((subtotalAmountFC * exchangeRate).toFixed(3)),
      FreightChargeBC: this.form.get('FreightChargeFC')?.value * exchangeRate,
      TaxAmountFC: Number(taxAmountFC.toFixed(3)),
      TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
      NetAmountBC: isRoundOff ? Math.round(netAmountFC * exchangeRate) : (netAmountFC * exchangeRate),
      CoinAdjustment: isRoundOff ? Number(((netAmountFC * exchangeRate)) - Math.round(netAmountFC * exchangeRate)).toFixed(3) : 0
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
    this.pageService
      .CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.IsSuccess) {
            this.alertService.showServerResponseAlert(response);
            return;
          }

          this.alertService.showAlert({
            type: 'success',
            text: response.Message,
            timer: 5000,
          });

          if (this.isFromExportOrder) {
            setTimeout(() => {
              this.router.navigate(['/ie/proforma-invoice/index']);
            }, 2000);
          } else {
            setTimeout(() => {
              this.ngOnInit();
            }, 2000);
          }
        },
        error: () => {
          this.isSubmitted = false;
        },
        complete: () => {
          this.isSubmitted = false;
        },
      });
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

  private loadProformaInvoice(id: number): void {
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

            this.selectedCustomerAddress = response.Data.CustomerAddress!;
            this.statusText = response.Data.StatusText!;
            this.statusHex = response.Data.StatusHex!;
            this.isTaxAlreadyExists = response.Data.IsTaxAlreadyExists;

            response.Data.ProductList.Items.forEach(item => {
              const productForm = this.formService.createFormArrayItem(
                this.formConfig.ProductList.items
              );
              productForm.patchValue(item);
              this.productListArray.push(productForm);
            });

            this.tableDef.data = this.productListArray.value;

            const { ProductList, ...formValues } = response.Data;

            this.form.patchValue({
              ...formValues,
              ProformaInvoiceDate: DateUtils.toDate(response.Data.ProformaInvoiceDate!),
              ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!)
            });
          }
        });
    }
    catch (error) {

    }
  }

  // getDetails(): void {
  //   this.route.params.subscribe((params) => {
  //     const proformaInvoiceID = +params['id'];
  //     if (proformaInvoiceID) {
  //       this.isEditMode = true;
  //       try {
  //         this.pageService.GetDetails(proformaInvoiceID)
  //           .pipe(takeUntil(this.destroy$))
  //           .subscribe({
  //             next: (response) => {
  //               if (response.IsSuccess) {
  //                 console.log(response);
  //                 this.selectedCustomerAddress = response.Data.CustomerAddress!;
  //                 this.statusText = response.Data.StatusText!;
  //                 this.statusHex = response.Data.StatusHex!;
  //                 response.Data.ProductList.Items.forEach(item => {
  //                   const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //                   productForm.patchValue(item);
  //                   this.productListArray.push(productForm);
  //                 });

  //                 this.tableDef.data = this.productListArray.value;
  //                 const { ProductList, ...formValues } = response.Data;
  //                 const data = {
  //                   ...formValues,
  //                   ProformaInvoiceDate: DateUtils.toDate(response.Data.ProformaInvoiceDate!),
  //                   ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!)
  //                 }

  //                 this.form.patchValue(data);
  //               } else {
  //                 this.alertService.showServerResponseAlert(response);
  //               }
  //             },
  //           });
  //       }
  //       catch (error) {

  //       }
  //     }
  //   });
  // }

  // private loadExportOrder(exportOrderID: number): void {
  //   this.form.patchValue({ BasedOn: 1 });
  //   this.GetExportOrder(exportOrderID);
  // }


  // getExportOrderDetails(): void {
  //   this.route.params.subscribe((params) => {
  //     const exportOrderID = +params['exportOrderID'];
  //     console.log("Export Order ID from route:", exportOrderID);
  //     if (exportOrderID) {
  //       this.form.patchValue({ BasedOn: 1 });
  //       this.GetExportOrder(exportOrderID);}
  //   });
  // }

  GetExportOrder(exportOrderID: number): void {
    debugger;
    try {
      this.pageService.GetExportOrderDetails(exportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              const keysToPatch = Object.keys(this.formConfig).filter(
                k => !['ProformaInvoiceNo', 'BasedOn', 'IsRoundOff', 'ExchangeRateToBC', 'ProductList'].includes(k)
              );

              const filteredModel = keysToPatch.reduce((acc, key) => {
                const typedKey = key as keyof ExportOrder_Detail;
                const value = response.Data[typedKey] ?? undefined;
                (acc as any)[typedKey] = value;
                return acc;
              }, {} as Partial<ExportOrder_Detail>);

              this.selectedCustomerAddress = response.Data.CustomerAddress ?? '';
              this.form.patchValue({
                ...filteredModel,
                CustomerID: response.Data.CustomerID,
                CustomerName: response.Data.CustomerName,
                SalesQuotationNo: response.Data.SalesQuotationNo
              });

              this.productListArray.clear();

              response.Data.ProductList.Items.forEach(item => {
                const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productForm.patchValue({
                  ProductID: item.ProductID,
                  ProductName: item.ProductName,
                  SalesQty: item.SalesQty,
                  UOM: item.UOM,
                  RatePerUnitFC: item.RatePerUnitFC,
                  SalesTaxRate: item.SalesTaxRate
                });
                this.productListArray.push(productForm);
              });

              this.tableDef.data = this.productListArray.value;
              const { SalesQuotationNo, ProductList, BasedOn, IsRoundOff, ExchangeRateToBC, Narration, ...formValues } = response.Data;
              this.selectedCustomerAddress = response.Data.CustomerAddress ?? '';
              this.form.patchValue(formValues);

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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
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

  printInvoice(): void {
    this.route.params.subscribe(params => {
      const proformaInvoiceID = +params['id'];

      if (!proformaInvoiceID) return;

      this.isEditMode = true;
      const model = {
        ProformaInvoiceID: proformaInvoiceID,
        PrintTemplateID: 1
      };
      this.pageService.GeneratePdf(model).subscribe({
        next: (blob) => {
          console.log('PDF generated successfully', blob);
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error: (err) => {
          console.error('PDF generation failed', err);
        }
      });
    });
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
