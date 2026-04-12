import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFileUploadComponent } from "../../../../../shared/components/z-form-controls/z-file-upload/z-file-upload.component";
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ZTableComponent } from '../../../../../shared/components/z-table/z-table.component';
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
import { Port_SelectList, PortMaster, PortRequest } from '../../../settings/port-master/port-master';
import { ExportOrderDocumentTemplate } from '../../export-order-document/export-order-document';
import { ExportOrderPaymentTemplate } from '../../export-order-payment/export-payment';
import { SalesQuotation_SelectList, SalesQuotationRequest } from '../../sales-quotation/sales-quotation';
import { ExportOrder, ExportOrderDetail, ExportOrderDocumentList, ExportOrderPaymentList } from '../export-order';
import { ExportOrderService } from '../export-order.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZTableComponent, ZFileUploadComponent],
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
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  //Export Order Document Table Related Template
  @ViewChild('documentUploadDateTemplate', { static: true }) documentUploadDateTemplate!: TemplateRef<any>;
  @ViewChild('isDocumentVerifiedTemplate', { static: true }) isDocumentVerifiedTemplate!: TemplateRef<any>;
  @ViewChild('documentActionColTemplate', { static: true }) documentActionColTemplate!: TemplateRef<any>;

  //Export Order Payment Table Related Template
  @ViewChild('paymentDateTemplate', { static: true }) paymentDateTemplate!: TemplateRef<any>;
  @ViewChild('paymentActionColTemplate', { static: true }) paymentActionColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  todayDate = new Date(new Date().setHours(23, 59, 59, 999));

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
  IsPOUploaded = false;
  isPackingListAvailable = false;
  isAddProductBtnLoading: boolean = false;
  isExportOrderPrintLoading = false;
  isPackingListPrintLoading = false;
  uploadingInvoice = false;
  disablePrintButton = false;

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
    this.form = this.formService.createFormGroup<ExportOrder>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.salesQuotationAutoCompleteDef = this.pageService.getSalesQuotationAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.loadingPortAutoCompleteDef = this.pageService.getLoadingPortAutoCompleteDef(this.formConfig, this.form);
    this.dischargePortAutoCompleteDef = this.pageService.getDischargePortAutoCompleteDef(this.formConfig, this.form);
    this.exportOrderDocumentTableDef = this.pageService.getExportOrderDocumentTableDef({ SerialNoTemplate: this.serialNoColTemplate, IsVerfiedTemplate: this.isDocumentVerifiedTemplate, UpdateDateTemplate: this.documentUploadDateTemplate, ActionTemplate: this.documentActionColTemplate } as ExportOrderDocumentTemplate);
    this.exportOrderPaymentTableDef = this.pageService.getExportOrderPaymentTableDef({ SerialNoTemplate: this.serialNoColTemplate, PaymentDateTemplate: this.paymentDateTemplate, ActionTemplate: this.paymentActionColTemplate } as ExportOrderPaymentTemplate);
    this.tableDef = {
      tableHeader: "Product List",
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "20%", customTemplate: this.productAutoCompleteColTemplate },
        { data: "SalesQty", label: "Sales Qty", width: "10%", customTemplate: this.salesQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "HSCode", label: "HS Code", width: "8%" },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "12%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "12%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "11%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "6%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const exportOrderID = Number(paramMap.get('id'));

        if (exportOrderID) {
          this.GetDetails(exportOrderID);
          return;
        }
        else if (this.navContextService.source) {
          this.GetSalesQuotation(this.navContextService.sourceId!);
          return;
        }

        this.isEditMode = false;
        if (this.productListArray.length === 0) {
          this.AddProductRow();
        }
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
      this.router.navigate(['/ie/export-order']);
    } catch (error) { }
  }

  onClickAddProformaInvoice(exportOrderID: number): void {
    if (exportOrderID) {
      this.navContextService.set('export-order', exportOrderID);
      this.router.navigate([`ie/proforma-invoice/create`]);
    }
  }

  onClickNavigateToTaxInvoice(exportOrderID: number): void {
    if (exportOrderID) {
      this.navContextService.set('export-order', exportOrderID);
      this.router.navigate([`ie/tax-invoice/create`]);
    }
  }

  resetForm(): void {
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  PrintExportOrder(): void {
    try {
      const exportOrderID = Number(this.route.snapshot.paramMap.get('id'));
      if (!exportOrderID) return;

      this.isExportOrderPrintLoading = true;
      this.isEditMode = true;
      this.pageService.GeneratePdf({ exportOrderID }).subscribe({
        next: (blob) => {
          window.open(window.URL.createObjectURL(blob));
        },
        error: (err) => {
          this.alertService.showAlert({
            type: 'error',
            text: `'PDF generation failed' + ${err}`,
            timer: 3000
          })
        },
        complete: () => {
          this.isExportOrderPrintLoading = false;
        }
      });
    }
    catch (ex) {
      this.isExportOrderPrintLoading = false;
    }
  }

  PrintPackingList(): void {
    try {
      const exportOrderID = Number(this.route.snapshot.paramMap.get('id'));
      if (!exportOrderID) return;

      this.isPackingListPrintLoading = true;
      this.isEditMode = true;
      this.pageService.GeneratePackingListPdf({ exportOrderID }).subscribe({
        next: (blob) => {
          window.open(window.URL.createObjectURL(blob));
        },
        error: (err) => {
          this.alertService.showAlert({
            type: 'error',
            text: `'PDF generation failed' + ${err}`,
            timer: 3000
          })
        },
        complete: () => {
          this.isPackingListPrintLoading = false;
        }
      });
    }
    catch (ex) {
      this.isPackingListPrintLoading = false;
    }
  }

  onClickRemoveProductItem(index: number): void {
    if (this.productListArray.at(index).value.ProductName !== null) {
      this.alertService.showConfirmation({
        text: `Do you really want to remove <b>${this.productListArray.at(index).value.ProductName}<b>?`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.productListArray.removeAt(index);
          this.productAutoCompleteDef.splice(index, 1);
          this.tableDef.data = this.productListArray.value;
          if (this.productListArray.length == 0) {
            this.AddProductRow();
          }
          this.ProductCalculation();
          return
        }
      });
    }
    else {
      this.productListArray.removeAt(index);
      this.productAutoCompleteDef.splice(index, 1);
      this.tableDef.data = this.productListArray.value;
      if (this.productListArray.length == 0) {
        this.AddProductRow();
      }
      this.ProductCalculation();
    }
  }

  onBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];

    if (basedOnValue === 2) {
      this.AddProductRow();
    }
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
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<ExportOrder>(this.formConfig, this.form);
    this.selectedCustomerAddress = null;
    this.productListArray.clear();
    this.tableDef.data = [];
    this.form.get('BasedOn')?.patchValue(basedOnValue);
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
      HSCode: event.HSCode,
      SalesTaxRate: event.PurTaxRate
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

    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig, productItemForm);
    this.tableDef.data = this.productListArray.value;

    this.isAddProductBtnLoading = false;
  }

  ProductCalculation(): void {
    var subtotalAmount: number = 0;
    var taxAmount: number = 0;
    var netAmount: number = 0;

    const freightCharge = this.form.get('FreightChargeFC')?.value || 0;
    const bankCharges = this.form.get('BankChargesFC')?.value || 0;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const rate = group.get('RatePerUnitFC')?.value || 0;
      const quantity = group.get('SalesQty')?.value || 0;
      const salesTaxRate = group.get('SalesTaxRate')?.value || 0;

      const taxableAmountFC = Number((rate * quantity).toFixed(3));
      const taxAmountFC = Number(((taxableAmountFC * salesTaxRate) / 100).toFixed(3));
      const salesAmountFC = Number((taxableAmountFC + taxAmountFC).toFixed(3));

      group.patchValue({
        TaxableAmountFC: taxableAmountFC,
        TaxAmountFC: taxAmountFC,
        SalesAmountFC: salesAmountFC
      }, { emitEvent: false });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += salesAmountFC;
    });
    netAmount += Number((freightCharge + bankCharges).toFixed(3));

    this.form.patchValue({
      SubtotalAmountFC: Number(subtotalAmount.toFixed(3)),
      NetAmountFC: Number(netAmount.toFixed(3)),
      TaxAmountFC: Number(taxAmount.toFixed(3))
    }, { emitEvent: false });
  }

  convertAmountsToBC(): void {
    // 1️⃣ Get Exchange Rate
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    // 2️⃣ Convert Product List Items (FC → BC)
    this.productListArray.controls.forEach((group: FormGroup) => {
      const ratePerUnitFC = Number(((group.get('RatePerUnitFC')?.value) || 0).toFixed(3));
      const taxableAmountFC = Number(((group.get('TaxableAmountFC')?.value) || 0).toFixed(3));
      const taxAmountFC = Number(((group.get('TaxAmountFC')?.value) || 0).toFixed(3));
      const salesAmountFC = Number(((group.get('SalesAmountFC')?.value) || 0).toFixed(3));

      group.patchValue({
        RatePerUnitBC: Number((ratePerUnitFC * exchangeRate).toFixed(3)),
        TaxableAmountBC: Number((taxableAmountFC * exchangeRate).toFixed(3)),
        TaxAmountBC: Number((taxAmountFC * exchangeRate).toFixed(3)),
        SalesAmountBC: Number((salesAmountFC * exchangeRate).toFixed(3))
      }, { emitEvent: false });
    });

    const subtotalAmountFC = this.form.get('SubtotalAmountFC')?.value || 0;
    const taxAmountFC = this.form.get('TaxAmountFC')?.value || 0;
    const netAmountFC = this.form.get('NetAmountFC')?.value || 0;
    const isRoundOff = this.form.get('IsRoundOff')?.value === true;

    // 4️⃣ Calculate BC Values and Coin Adjustment
    const subtotalAmountBC = subtotalAmountFC * exchangeRate;
    const taxAmountBC = taxAmountFC * exchangeRate;
    const netAmountBC = netAmountFC * exchangeRate;

    const roundedNetBC = Math.round(netAmountBC);
    const coinAdjustment = isRoundOff ? Number((netAmountBC - roundedNetBC).toFixed(3)) : 0;

    //Convert other charges to BC
    const insuranceBC = ((this.form.get('InsuranceAmountFC')?.value) || 0) * exchangeRate;
    const freightBC = ((this.form.get('FreightChargeFC')?.value) || 0) * exchangeRate;
    const bankChargesBC = ((this.form.get('BankChargesFC')?.value) || 0) * exchangeRate;

    // 5️⃣ Patch All Summary Fields (Once)
    this.form.patchValue({
      SubtotalAmountBC: Number(subtotalAmountBC.toFixed(3)),
      TaxAmountBC: Number(taxAmountBC.toFixed(3)),
      InsuranceAmountBC: Number(insuranceBC.toFixed(3)),
      FreightChargeBC: Number(freightBC.toFixed(3)),
      BankChargesBC: Number(bankChargesBC.toFixed(3)),
      NetAmountBC: isRoundOff ? roundedNetBC : Number(netAmountBC.toFixed(3)),
      CoinAdjustment: coinAdjustment
    }, { emitEvent: false });

    // 6️⃣ Debug Log to Verify Calculations only for development, should be removed in production
    if (this.form.get('ProductList')?.value.reduce((sum: number, item: any) => sum + (item.TaxableAmountBC || 0), 0) !== this.form.get('SubtotalAmountBC')?.value) {
      console.log(
        "Discrepancy in SubtotalAmountBC Calculation!, Backend Should Verify This. Product List total:",
        this.form.get('ProductList')?.value.reduce((sum: number, item: any) => sum + (item.TaxableAmountBC || 0), 0),
        " Patched SubtotalAmountBC:", this.form.get('SubtotalAmountBC')?.value
      );
    }
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
    this.ProductCalculation();
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
              this.resetForm();
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

  GetDetails(exportOrderID: number): void {
    this.isEditMode = true;
    try {
      this.pageService.GetDetails(exportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log(response.Data);
            if (!response.IsSuccess) {
              this.alertService.showServerResponseAlert(response);
              return;
            }

            this.selectedCustomerAddress = response.Data.CustomerAddress!;
            this.statusText = response.Data.StatusText!;
            this.statusHex = response.Data.StatusHex!;
            this.IsDocumentAlreadyExists = response.Data.IsDocumentAlreadyExists!;
            this.IsPOUploaded = response.Data.IsPOUploaded!;
            this.isPackingListAvailable = response.Data.IsPackingListAvailable;
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

            this.form.patchValue(data);
            this.OnCurrencyChange();
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
              this.selectedCustomerAddress = response.Data.CustomerAddress;
              response.Data.ProductList.Items.forEach(item => {
                const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productItemForm.patchValue({
                  ProductID: item.ProductID,
                  ProductName: item.ProductName,
                  SalesQty: item.QuotedQty,
                  UOM: item.UOM,
                  HSCode: item.HSCode,
                  RatePerUnitFC: item.RatePerUnitFC,
                  SalesTaxRate: item.TaxRate
                });

                this.productListArray.push(productItemForm);
                const index = this.productListArray.length - 1;
                this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig, productItemForm);
              });

              this.tableDef.data = this.productListArray.value;
              const { ProductList, BasedOn, IsRoundOff, ExchangeRateToBC, Narration, ...formValues } = response.Data;
              this.form.patchValue(formValues);
              this.form.get('BasedOn')?.setValue(1);
              this.OnCurrencyChange();
              this.ProductCalculation();
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  // uploadInvoiceDocument(exportOrderID: number): void {
  //   this.navContextService.set('export-order-document-upload', exportOrderID);
  //   this.router.navigate([`/ie/export-order/upload-document`]);
  // }

  uploadPO(event: File | File[]): void {
    const file = Array.isArray(event) ? event[0] : event;
    if (!file || this.uploadingInvoice || !this.isEditMode) return;

    const formData = new FormData();
    formData.append('DocumentFile', file);
    formData.append('ExportOrderID', this.form.get("ExportOrderID")?.value);
    console.log("FormData prepared for upload:", formData);
    this.uploadingInvoice = true;
    try {
      this.pageService.UploadPODocument(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
              this.ngOnInit();
            } else {
              this.alertService.showServerResponseAlert(response);
              this.uploadingInvoice = false;
            }
          },
        });
    }
    catch (error) {
      this.uploadingInvoice = false;
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
                  this.exportOrderDocumentTableDef.data = [];
                  this.exportOrderDocumentTableDef.data = response.Data.Items ?? [];
                  this.isLoadDocumentVisible = false
                } else {
                  this.exportOrderDocumentTableDef.data = [];
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

  printPackingDetail(): void {
    this.disablePrintButton = true;
    this.route.params.subscribe(params => {
      const exportOrderID = +params['id'];

      if (!exportOrderID) return;

      this.isEditMode = true;
      const model = {
        ExportOrderID: exportOrderID
      };
      this.pageService.GeneratePackingListPdf(model).subscribe({
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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}