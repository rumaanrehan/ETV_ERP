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
import { Product_SelectList, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyRequest } from '../../../settings/company-master/company-master';
import { Port_SelectList, PortRequest } from '../../../settings/port-master/port-master';
import { ImportOrder, ImportOrderDetail } from '../import-order';
import { ImportOrderService } from '../import-order.service';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';
import { Currency_SelectList } from '../../../../admin/settings/currency-master/currency-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';

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
  @ViewChild('purchaseQtyColTemplate', { static: true }) purchaseQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitColTemplate', { static: true }) ratePerUnitColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  //
  selectedVendorAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode = false;
  isSubmitted = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ImportOrder>;
  tableDef!: TableDef<ImportOrderDetail>;

  //Master Dropdown Lists
  customerList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];
  portList: Port_SelectList[] = [];

  //Common Dropdown Lists
  basedOnList: StaticList[] = [];
  statusList: StaticList[] = [];
  incotermList: StaticList[] = [];
  shipmentModeList: StaticList[] = [];

  // AutoComplete Definitions    
  // purchaseQuotationAutoCompleteDef!: AutoCompleteDef<PurchaseQuotation_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  loadingPortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  dischargePortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ImportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ImportOrder>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    // this.salesPurchaseAutoCompleteDef = this.pageService.getPurchaseQuotationAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.loadingPortAutoCompleteDef = this.pageService.getLoadingPortAutoCompleteDef(this.formConfig, this.form);
    this.dischargePortAutoCompleteDef = this.pageService.getDischargePortAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      tableHeader: "Product List",
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "4%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "22%" },
        { data: "PurchaseQty", label: "Purchase Qty", width: "10%", customTemplate: this.purchaseQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "RatePerUnitFC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitColTemplate },
        { data: "PurchaseTaxRate", label: "Tax Rate", width: "12%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountFC", label: "Taxable Amount", width: "14%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountFC", label: "Tax Amount", width: "14%", customTemplate: this.taxAmountFCColTemplate },
        { data: "ActionCol", label: "", hideVisToggle: true, width: "7%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    }
    this.updateActionColumnState();

    this.loadDropdownList();
    this.getDetails();

    // this.route.paramMap
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(paramMap => {
    //     const id = paramMap.get('id');
    //     const salesQuotationID = paramMap.get('salesQuotationID');

    //     if (id) {
    //       this.loadExportOrder(+id);
    //       return;
    //     }
    //     else if (salesQuotationID) {
    //       this.isFromSalesQuotation = true;
    //       this.GetSalesQuotation(+salesQuotationID);
    //       return;
    //     }

    //     this.isEditMode = false;
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isBasedOnPurchaseQuotation(): boolean {
    return this.form.get('BasedOn')?.value === 1;
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'Incoterm', targetList: 'incotermList' },
      { fieldName: 'ShipmentMode', targetList: 'shipmentModeList' },
      { fieldName: 'BasedOn', targetList: 'basedOnList' },
      { fieldName: 'StatusID', targetList: 'statusList' }
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
      this.router.navigate(['/ie/import-order/index']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<ImportOrder>(this.formConfig, this.form);
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
  
  onBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<ImportOrder>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
    this.updateActionColumnState();
  }
  
  loadPurchaseQuotation(event: string): void {
    return;
    // try {
    //   const dto: PurchaseQuotationRequest = {
    //     PurchaseQuotationNo: event,
    //     PopulateType: 'AutoSuggestForImportOrder'
    //   }
    //   this.pageService.GetPurchaseQuotationList(dto)
    //     .pipe(takeUntil(this.destroy$)).subscribe({
    //       next: (response) => {
    //         if (response.IsSuccess) {
    //           this.purchaseQuotationAutoCompleteDef.options = response.Data.Items;
    //         } else {
    //           this.purchaseQuotationAutoCompleteDef.options = [];
    //         }
    //       },
    //     });
    // } catch (error) {
    // }
  }
  
  // onSelect_PurchaseQuotation(event: PurchaseQuotation_SelectList): void {
  //   this.productListArray.clear();
  //   this.tableDef.data = [];
  //   if (event.StatusID <= 5) {
  //     this.form.patchValue({ PurchaseQuotationID: event.PurchaseQuotationID, PurchaseQuotationNo: event.PurchaseQuotationNo });
  //     this.GetPurchaseQuotation(event.PurchaseQuotationID);
  //   }
  //   else {
  //     this.alertService.showToast({
  //       text: "This Purchase Quotation has already been processed. An import order cannot be created.",
  //       timer: 5000
  //     });
  //     this.form.patchValue({
  //       PurchaseEnquiryID: null,
  //       PurchaseEnquiryNo: null,
  //     });
  //     return;
  //   }
  // }
  
  onClear_PurchaseQuotation(): void {
    this.formService.resetFormValue<ImportOrder>(this.formConfig, this.form);
    this.selectedVendorAddress = null;
    this.productListArray.clear();
    this.tableDef.data = [];
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('PurchaseQty')?.value || 0;
    const rate = group.get('RatePerUnitFC')?.value || 0;
    const purchaseTaxRate = group.get('PurchaseTaxRate')?.value || 0;

    return [quantity * rate, quantity * rate * (purchaseTaxRate / 100)];
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
            }
          },
        });
    } catch (error) {

    }
  }

  onClear_Company(): void {
    this.form.get('CompanyID')?.patchValue(null);
    this.form.get('CompanyName')?.patchValue(null);
    this.selectedVendorAddress = null;
  }

  loadLoadingPort(event: string): void {
    try {
      const shipmentModeID = this.form.get('ShipmentModeID')?.value;
      if (shipmentModeID) {
        const dto: PortRequest = {
          PortTypeID: this.form.get('ShipmentModeID')?.value,
          PortName: event,
          PopulateType: 'AutoSuggest'
        }
        this.pageService.GetPortList(dto)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.loadingPortAutoCompleteDef.options = response.Data.Items;
              } else {
                this.loadingPortAutoCompleteDef.options = [];
              }
            },
          });
      }
      else {
        this.alertService.showAlert({
          type: 'warning',
          title: 'Shipment Mode Missing',
          text: 'Please select a shipment mode before searching ports.'
        });
      }
    } catch (error) {

    }
  }

  loadDischargePort(event: string): void {
    try {
      const shipmentModeID = this.form.get('ShipmentModeID')?.value;
      if (shipmentModeID) {
        const dto: PortRequest = {
          PortTypeID: shipmentModeID,
          PortName: event,
          PopulateType: 'AutoSuggest'
        }
        this.pageService.GetPortList(dto)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.dischargePortAutoCompleteDef.options = response.Data.Items;
              } else {
                this.dischargePortAutoCompleteDef.options = [];
              }
            },
          });
      }
      else {
        this.alertService.showAlert({
          type: 'warning',
          title: 'Shipment Mode Missing',
          text: 'Please select a shipment mode before searching ports.'
        });
      }
    } catch (error) {

    }
  }

  onClear_LoadingPort(): void {
    this.form.get('LoadingPortID')?.patchValue(null);
    this.form.get('LoadingPortName')?.patchValue(null);
  }

  onClear_DischargePort(): void {
    this.form.get('DischargePortID')?.patchValue(null);
    this.form.get('DischargePortName')?.patchValue(null);
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
              // if (response.Message != "Record not found.") {
              //   this.alertService.showServerResponseAlert(response);
              // }
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
      PurchaseTaxRate: event.PurTaxRate
    });

    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;
  }

  productCalculation(): void {
    var subtotalAmount: number = 0;
    var taxAmount: number = 0;
    var netAmount: number = 0;

    const freightCharge = this.form.get('FreightAmountFC')?.value || 0;
    // const bankCharges = this.form.get('BankChargesFC')?.value || 0;
    // const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const quantity = group.get('PurchaseQty')?.value || 0;
      const purchasetaxRate = group.get('PurchaseTaxRate')?.value || 0;

      const taxableAmountFC = quantity * rate;
      const taxAmountFC = (taxableAmountFC * purchasetaxRate) / 100;

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        TotalAmountFC: taxableAmountFC + taxAmountFC
      }, { emitEvent: true });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += (taxableAmountFC + taxAmountFC);
    });
    netAmount += freightCharge;

    // After updating all rows, update the totals
    // const subtotalAmountBC = this.getproductTaxableAmountBC();
    // const taxAmountBC = this.getproductTaxAmountBCSum();

    this.form.patchValue({ NetAmountFC: netAmount, SubtotalAmountFC: subtotalAmount, TaxAmountFC: taxAmount}, {emitEvent: true} );
  }

  // getproductTaxableAmountBC(): number {
  //   return this.productListArray.controls.reduce((sum, group) => {
  //     const value = group.get('TaxableAmountBC')?.value || 0;
  //     return sum + value;
  //   }, 0);
  // }

  // getproductTaxAmountBCSum(): number {
  //   return this.productListArray.controls.reduce((sum, group) => {
  //     const value = group.get('TaxAmountBC')?.value || 0;
  //     return sum + value;
  //   }, 0);
  // }

  convertAmountsToBC(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.form.patchValue({
      SubtotalAmountBC: this.form.get('SubtotalAmountFC')?.value * exchangeRate,
      TaxAmountBC: this.form.get('TaxAmountFC')?.value * exchangeRate,
      InsuranceAmountBC: this.form.get('InsuranceAmountFC')?.value * exchangeRate,
      // BankChargesBC: this.form.get('BankChargesFC')?.value * exchangeRate,
      NetAmountBC: this.form.get('NetAmountFC')?.value * exchangeRate
    }, { emitEvent: true });

    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = Number(((group.get('RatePerUnitFC')?.value) || 0).toFixed(3));
      const taxableAmountFC = Number(((group.get('TaxableAmountFC')?.value) || 0).toFixed(3));
      const taxAmountFC = Number(((group.get('TaxAmountFC')?.value) || 0).toFixed(3));
      const totalAmountFC = Number(((group.get('TotalAmountFC')?.value) || 0).toFixed(3));

      group.patchValue({
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        TotalAmountBC: Number((totalAmountFC * exchangeRate).toFixed(3))
      }, { emitEvent: true });
    });

    const subtotalAmountFC = this.getproductTaxableAmountFC();
    const taxAmountFC = this.getproductTaxAmountFCSum();
    const isRoundOff = this.form.get('IsRoundOff')?.value === true;
    const netAmountFC = this.form.get('NetAmountFC')?.value;

    this.form.patchValue({
      SubtotalAmountFC: Number(subtotalAmountFC.toFixed(3)),
      SubtotalAmountBC: Number((subtotalAmountFC * exchangeRate).toFixed(3)),
      FreightAmountBC: this.form.get('FreightAmountFC')?.value * exchangeRate,
      CustomDutyBC : this.form.get('CustomDutyFC')?.value * exchangeRate,
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

  OnSelect_Customer(event: Company_SelectList): void {
    this.form.patchValue({ VendorID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedVendorAddress = event?.BillingAddress || '';
  }

  OnLoadingPortSelect(event: Port_SelectList): void {
    this.form.patchValue({ LoadingPortID: event.PortID });
  }

  OnDischargePortSelect(event: Port_SelectList): void {
    this.form.patchValue({ DischargePortID: event.PortID });
  }

  onChangeShipmentMode(): void {
    // this.loadPortList();
  }

  // loadPortList(): void {
  //   try {
  //     const dto: PortRequest = {
  //       PortTypeID: this.form.get('ShipmentModeID')?.value,
  //       PopulateType: 'SelectList'
  //     }
  //     this.pageService.GetPortList(dto)
  //       .pipe(takeUntil(this.destroy$)).subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             this.portList = response.Data.Items;
  //           } else if (response.Status == "Info") {
  //             this.portList = [];
  //           }
  //           else {
  //             this.alertService.showServerResponseAlert(response);
  //           }
  //         },
  //       });
  //   } catch (error) {
  //   }
  // }

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
              const model: ImportOrder = {
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

  createRecord(model: ImportOrder): void {
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

  updateRecord(model: ImportOrder): void {
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
                this.router.navigate(['/ie/import-order/index']);
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
      const ImportOrderID = +params['id'];
      if (ImportOrderID) {
        this.isEditMode = true;
        try {
          this.pageService
            .GetDetails(ImportOrderID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (!response.IsSuccess) {
                  this.alertService.showServerResponseAlert(response);
                  return;
                }

                this.selectedVendorAddress = response.Data.VendorAddress!;
                this.statusText = response.Data.StatusText!;
                this.statusHex = response.Data.StatusHex!;
                response.Data.ProductList.Items.forEach(item => {
                  const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                  productForm.patchValue(item);
                  this.productListArray.push(productForm);
                });

                this.tableDef.data = this.productListArray.value;
                const { ProductList, ...formValues } = response.Data;
                const data = {
                  ...formValues,
                  ImportOrderDate: DateUtils.toDate(response.Data.ImportOrderDate!),
                  ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!),
                  BillOfEntryDate: DateUtils.toDate(response.Data.BillOfEntryDate!),
                  AirwayBillDate: DateUtils.toDate(response.Data.AirwayBillDate!)
                }

                // this.loadPortList();
                this.form.patchValue(data);
                this.updateActionColumnState();

                // if (response.IsSuccess) {
                //   this.GetOrderItemDetails(response.Data)
                // } else {
                //   this.alertService.showServerResponseAlert(response);
                // }
              },
            });
        }
        catch (error) {

        }
      }
    });
  }
  // This method is moved inside getDetails method
  // GetOrderItemDetails(model: ImportOrder) {
  //   this.route.params.subscribe((params) => {
  //     const ImportOrderID = +params['id'];
  //     this.pageService.GetOrderItemDetails(ImportOrderID)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (response) => {
  //           if (response.IsSuccess) {
  //             this.loadPortList();
  //             response.Data.Items.forEach(item => {
  //               const patchedModel = {
  //                 ...item,
  //                 ProductName: item.Product!.ProductName || '',
  //               };
  //               const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //               productForm.patchValue(patchedModel);
  //               this.productListArray.push(productForm);
  //             });
  //             this.tableDef.data = this.productListArray.value;
  //             this.selectedVendorAddress = model.Vendor?.BillingAddress!;
  //             const patchedModel = {
  //               ...model,
  //               VendorID: model.Vendor?.CompanyID,
  //               VendorName: model.Vendor?.CompanyName,
  //               ImportOrderDate: DateUtils.toDate(model.ImportOrderDate),
  //               ReferenceDate: DateUtils.toDate(model.ReferenceDate),
  //               ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate)
  //             };
  //             this.form.patchValue(patchedModel);
  //           }
  //           else {
  //             // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
  //           }
  //         },
  //       });
  //   });
  // }
  GetPurchaseQuotation(purchaseQuotationID: number): void {
    try {
      // this.pageService.GetPurchaseQuotationDetails(purchaseQuotationID)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: (response) => {
      //       if (response.IsSuccess) {
      //         const keysToPatch = Object.keys(this.formConfig).filter(
      //           k => !['ExportOrderNo', 'BasedOn', 'IsRoundOff', 'ExchangeRateToBC', 'Narration', 'ProductList'].includes(k)
      //         );

      //         const filteredModel = keysToPatch.reduce((acc, key) => {
      //           const typedKey = key as keyof PurchaseQuotation_Detail;
      //           const value = response.Data[typedKey] ?? undefined;
      //           (acc as any)[typedKey] = value;
      //           return acc;
      //         }, {} as Partial<PurchaseQuotation_Detail>);

      //         this.selectedVendorAddress = response.Data.CustomerAddress ?? '';
      //         this.form.patchValue({
      //           ...filteredModel,
      //           CustomerID: response.Data.CustomerID,
      //           CustomerName: response.Data.CustomerName,
      //           // SalesQuotationNo: response.Data.SalesQuotationNo
      //         });

      //         this.productListArray.clear();

      //         response.Data.ProductList.Items.forEach(item => {
      //           const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
      //           productForm.patchValue({
      //             ProductID: item.ProductID,
      //             ProductName: item.ProductName,
      //             SalesQty: item.QuotedQty,
      //             UOM: item.UOM,
      //             RatePerUnitFC: item.RatePerUnitFC,
      //             SalesTaxRate: item.TaxRate
      //           });
      //           this.productListArray.push(productForm);
      //         });

      //         this.tableDef.data = this.productListArray.value;
      //         const { SalesQuotationNo, ProductList, BasedOn, IsRoundOff, ExchangeRateToBC, Narration, ...formValues } = response.Data;
      //         this.selectedVendorAddress = response.Data.CustomerAddress ?? '';
      //         this.form.patchValue(formValues);

      //         this.productCalculation();
      //       } else {
      //         this.alertService.showServerResponseAlert(response);
      //       }
      //     },
      //   });
    }
    catch (error) {

    }
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }

  private updateActionColumnState(): void {
    const showActionColumn = !this.isBasedOnPurchaseQuotation;
    this.tableDef = {
      ...this.tableDef,
      columnDef: this.tableDef.columnDef.map((col) =>
        col.data === 'ActionCol'
          ? { ...col, visible: showActionColumn, width: showActionColumn ? '7%' : '0%' }
          : col
      )
    };
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
