import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Port_SelectList, PortMaster, PortRequest } from '../../../settings/port-master/port-master';
import { ExportOrderDocumentTemplate } from '../../export-order-document/export-order-document';
import { ExportOrderPaymentTemplate } from '../../export-order-payment/export-payment';
import { SalesQuotation_Detail, SalesQuotation_SelectList, SalesQuotationRequest } from '../../sales-quotation/sales-quotation';
import { ExportOrder, ExportOrderDetail, ExportOrderDocumentList, ExportOrderPaymentList } from '../export-order';
import { ExportOrderService } from '../export-order.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZTableComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('productAutoCompleteColTemplate', { static: true }) productAutoCompleteColTemplate!: TemplateRef<any>;
  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('salesQtyColTemplate', { static: true }) salesQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;

  //Export Order Document Table Related Template
  @ViewChild('documentUploadDateTemplate', { static: true }) documentUploadDateTemplate!: TemplateRef<any>;
  @ViewChild('isDocumentVerifiedTemplate', { static: true }) isDocumentVerifiedTemplate!: TemplateRef<any>;
  @ViewChild('documentActionColTemplate', { static: true }) documentActionColTemplate!: TemplateRef<any>;

  //Export Order Payment Table Related Template
  @ViewChild('paymentDateTemplate', { static: true }) paymentDateTemplate!: TemplateRef<any>;
  @ViewChild('paymentActionColTemplate', { static: true }) paymentActionColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  selectedCustomerAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isLoadDocumentVisible: boolean = true;
  isLoadPaymentVisible: boolean = true;
  isFromSalesQuotation = false;
  IsDocumentAlreadyExists = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrder>;
  tableDef!: TableDef<ExportOrderDetail>;
  exportOrderDocumentTableDef!: TableDef<ExportOrderDocumentList>
  exportOrderPaymentTableDef!: TableDef<ExportOrderPaymentList>

  customerList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  basedOnList: StaticList[] = [];
  statusList: StaticList[] = [];
  incotermList: StaticList[] = [];
  shipmentModeList: StaticList[] = [];

  salesQuotationAutoCompleteDef!: AutoCompleteDef<SalesQuotation_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  loadingPortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  dischargePortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ExportOrder>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.salesQuotationAutoCompleteDef = this.pageService.getSalesQuotationAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.loadingPortAutoCompleteDef = this.pageService.getLoadingPortAutoCompleteDef(this.formConfig, this.form);
    this.dischargePortAutoCompleteDef = this.pageService.getDischargePortAutoCompleteDef(this.formConfig, this.form);
    this.exportOrderDocumentTableDef = this.pageService.getExportOrderDocumentTableDef({ SerialNoTemplate: this.serialNoColTemplate, IsVerfiedTemplate: this.isDocumentVerifiedTemplate, UpdateDateTemplate: this.documentUploadDateTemplate, ActionTemplate: this.documentActionColTemplate } as ExportOrderDocumentTemplate);
    this.exportOrderPaymentTableDef = this.pageService.getExportOrderPaymentTableDef({ SerialNoTemplate: this.serialNoColTemplate, PaymentDateTemplate: this.paymentDateTemplate, ActionTemplate: this.paymentActionColTemplate } as ExportOrderPaymentTemplate);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%", customTemplate: this.productAutoCompleteColTemplate },
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
        const salesQuotationID = paramMap.get('salesQuotationID');

        if (id) {
          this.loadExportOrder(+id);
          return;
        }
        else if (salesQuotationID) {
          this.isFromSalesQuotation = true;
          this.GetSalesQuotation(+salesQuotationID);
          return;
        }

        this.isEditMode = false;
      });
  }

  get isBasedOnSalesQuotation(): boolean {
    return this.form.get('BasedOn')?.value === 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
            const targetResponse = response?.[targetList];
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
      this.router.navigate(['/ie/export-order/index']);
    } catch (error) { }
  }

  onClickAddProformaInvoice(exportOrderID: number): void {
    if (exportOrderID) {
      this.router.navigate([`ie/proforma-invoice/from-export/${exportOrderID}`]);
    } else {
      return;
    }
  }

  onClickNavigateToTaxInvoice(exportOrderID: number): void {
    if (exportOrderID) {
      this.router.navigate([`ie/tax-invoice/from-export/${exportOrderID}`]);
    } else {
      return;
    }
  }

  resetForm(): void {
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
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
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
  }

  loadSalesQuotation(event: string): void {
    try {
      const dto: SalesQuotationRequest = {
        SalesQuotationNo: event,
        PopulateType: 'AutoSuggestForExportOrder'
      }
      this.pageService.GetSalesQuotationList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.salesQuotationAutoCompleteDef.options = response.Data.Items;
            } else {
              this.salesQuotationAutoCompleteDef.options = [];
            }
          },
        });
    } catch (error) {
    }
  }

  onSelect_SalesQuotation(event: SalesQuotation_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    if (event.StatusID <= 5) {
      this.form.patchValue({ SalesQuotationID: event.SalesQuotationID, SalesQuotationNo: event.SalesQuotationNo });
      this.GetSalesQuotation(event.SalesQuotationID);
    }
    else {
      this.alertService.showToast({
        text: "This Sales Quotation has already been processed. An export order cannot be created.",
        timer: 5000
      });
      this.form.patchValue({
        SalesEnquiryID: null,
        SalesEnquiryNo: null,
      });
      return;
    }
  }

  onClear_SalesQuotation(): void {
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
    this.selectedCustomerAddress = null;
    this.productListArray.clear();
    this.tableDef.data = [];
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('SalesQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const salesTaxRate = group.get('SalesTaxRate')?.value || 0;

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
            }
          },
        });
    } catch (error) {

    }
  }

  onClear_Customer(): void {
    this.form.get('CustomerID')?.patchValue(null);
    this.form.get('CustomerName')?.patchValue(null);
    this.selectedCustomerAddress = null;
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

  onSearch_Product(event: string, rowIndex: number): void {
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

  // onSelect_Product(event: Product_SelectList, index: number): void {
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
  //     SalesTaxRate: event.PurTaxRate
  //   });

  //   this.productListArray.push(productItemForm);
  //   this.tableDef.data = this.productListArray.value;
  // }

  onSelect_Product(event: Product_SelectList, index: number): void {
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
      SalesTaxRate: event.PurTaxRate
    });

    this.tableDef.data = this.productListArray.value
  }

  addProductRow(): void {
    const productItemForm =
      this.formService.createFormArrayItem(this.formConfig.ProductList.items);

    this.productListArray.push(productItemForm);
    const index = this.productListArray.length - 1;

    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig, productItemForm);
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
        SalesAmountBC: Number((salesAmountFC * exchangeRate).toFixed(3))
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

  onSelect_Customer(event: Company_SelectList): void {
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedCustomerAddress = event?.BillingAddress || '';
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
              this.selectedCustomerAddress = null;
              setTimeout(() => {
                this.router.navigate(['/ie/export-order/index']);
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

  private loadExportOrder(id: number): void {
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
            this.IsDocumentAlreadyExists = response.Data.IsDocumentAlreadyExists!;
            response.Data.ProductList.Items.forEach(item => {
              const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
              productItemForm.patchValue(item);
              this.productListArray.push(productItemForm);
              const index = this.productListArray.length - 1;

              this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig, productItemForm)
            });

            this.tableDef.data = this.productListArray.value;
            const { ProductList, ...formValues } = response.Data;
            const data = {
              ...formValues,
              ExportOrderDate: DateUtils.toDate(response.Data.ExportOrderDate!),
              ReferenceDate: DateUtils.toDate(response.Data.ReferenceDate!),
              ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!)
            }

            // this.loadPortList();
            this.form.patchValue(data);
          }
        });
    }
    catch (error) { }
  }

  GetSalesQuotation(salesQuotationID: number): void {
    try {
      this.pageService.GetSalesQuotationDetails(salesQuotationID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              const keysToPatch = Object.keys(this.formConfig).filter(
                k => !['ExportOrderNo', 'BasedOn', 'IsRoundOff', 'ExchangeRateToBC', 'Narration', 'ProductList'].includes(k)
              );

              const filteredModel = keysToPatch.reduce((acc, key) => {
                const typedKey = key as keyof SalesQuotation_Detail;
                const value = response.Data[typedKey] ?? undefined;
                (acc as any)[typedKey] = value;
                return acc;
              }, {} as Partial<SalesQuotation_Detail>);

              this.selectedCustomerAddress = response.Data.CustomerAddress ?? '';
              this.form.patchValue({
                ...filteredModel,
                CustomerID: response.Data.CustomerID,
                CustomerName: response.Data.CustomerName,
                // SalesQuotationNo: response.Data.SalesQuotationNo
              });

              // this.productListArray.clear();

              response.Data.ProductList.Items.forEach(item => {
                const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productItemForm.patchValue({
                  ProductID: item.ProductID,
                  ProductName: item.ProductName,
                  SalesQty: item.QuotedQty,
                  UOM: item.UOM,
                  RatePerUnitFC: item.RatePerUnitFC
                });
                this.productListArray.push(productItemForm);
                const index = this.productAutoCompleteDef.length - 1;

                this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig, productItemForm);
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

  onClickLoadDocuments(): void {
    this.route.params.subscribe((params) => {
      const exportOrderID = +params['id'];
      if (exportOrderID) {
        try {
          this.pageService.LoadDocument(exportOrderID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.exportOrderDocumentTableDef.data = response.Data.Items;
                  this.isLoadDocumentVisible = false
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

  onClickViewDocumentItem(row: ExportOrderDocumentList): void {
    if (row.DocumentPath && row.DocumentPath.trim() !== '') {
      this.pageService.GetDocument(row.DocumentPath)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const fileURL = URL.createObjectURL(response);
            window.open(fileURL, '_blank');
          },
          error: (err) => {
            if (err.status === 404) {
              this.alertService.showAlert({ type: 'error', text: 'File not found.' });
            } else {
              this.alertService.showAlert({ type: 'error', text: 'Download failed.' });
            }
          }
        });
    }
  }

  onClickDownloadDocumentItem(row: ExportOrderDocumentList): void {
    if (row.DocumentPath && row.DocumentPath.trim() !== '') {
      this.pageService.GetDocument(row.DocumentPath)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const blob = new Blob([response], { type: response.type });
            const fileURL = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = fileURL;
            a.download = row.DocumentPath.split(/[/\\]/).pop() || 'downloaded-file'
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(fileURL);
          },
          error: (err) => {
            if (err.status === 404) {
              this.alertService.showAlert({ type: 'error', text: 'File not found.' });
            } else {
              this.alertService.showAlert({ type: 'error', text: 'Download failed.' });
            }
          }
        });
    }
  }

  onClickRemoveDocumentItem(row: any): void {
    this.alertService.showConfirmationWithInput({
      text: 'Do you really want to remove this document?',
      inputPlaceholder: 'Reason to delete'
    }).then((result) => {
      if (result.isConfirmed) {
        const dto: ExportOrderDocumentList = {
          ...row,
          ReasonToDelete: result.value
        }
        this.pageService.DeleteDocument(dto)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.alertService.showAlert({
                  type: 'success',
                  text: response.Message,
                  timer: 5000,
                });
                this.onClickLoadDocuments();
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    });
  }

  onClickLoadPayments(): void {
    this.route.params.subscribe((params) => {
      const exportOrderID = +params['id'];
      if (exportOrderID) {
        try {
          this.pageService.LoadPayment(exportOrderID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.exportOrderPaymentTableDef.data = response.Data.Items;
                  this.isLoadPaymentVisible = false;
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

  onClickRemovePaymentItem(row: any): void {
    this.alertService.showConfirmationWithInput({
      text: 'Do you really want to remove this payment?',
    }).then((result) => {
      if (result.isConfirmed) {
        const dto: ExportOrderPaymentList = {
          ...row,
          ReasonToCancel: result.value
        }
        this.pageService.DeletePayment(dto)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.alertService.showAlert({
                  type: 'success',
                  text: response.Message,
                  timer: 5000,
                });
                this.onClickLoadPayments();
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    });
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
      case 'PortCreateComponent':
        return this.createPortComponent();
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

  async createPortComponent() {
    const { CreateComponent } = await import('../../../settings/port-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: PortMaster = this.formService.createNullObject<PortMaster>();
    this.loadDynamicComponent(model);
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }

  //   private logInvalidControls(form: FormGroup | FormArray, parentKey: string = ''): void {
  //     Object.keys(form.controls).forEach(key => {
  //       const control = form.get(key);
  //       const controlPath = parentKey ? `${parentKey}.${key}` : key;

  //       if (control instanceof FormGroup || control instanceof FormArray) {
  //         this.logInvalidControls(control, controlPath);
  //       } else if (control && control.invalid) {
  //         console.warn(
  //           `❌ Invalid Control: ${controlPath}`,
  //           control.errors
  //         );
  //       }
  //     });
  //   }
}