import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
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
import { ExportOrder_SelectList, ExportOrderRequest } from '../../export-order/export-order';
import { ProformaInvoice_Detail, ProformaInvoice_SelectList, ProformaInvoiceRequest } from '../../proforma-invoice/proforma-invoice';
import { Document_SelectList, TaxInvoice, TaxInvoiceDetail } from '../tax-invoice';
import { TaxInvoiceService } from '../tax-invoice.service';
import { Port_SelectList, PortMaster, PortRequest } from '../../../settings/port-master/port-master';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { GetExchangeRateRequest } from '../../../../../shared/models/currency';
import { CurrencyExchangeService } from '../../../../../shared/services/currency-exchange.service';

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
  @ViewChild('salesQtyColTemplate', { static: true }) salesQtyColTemplate!: TemplateRef<any>;
  @ViewChild('ratePerUnitFCColTemplate', { static: true }) ratePerUnitFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountFCColTemplate', { static: true }) taxableAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountFCColTemplate', { static: true }) taxAmountFCColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;
  loaderService = inject(LoaderService);

  selectedCustomerAddress: string = '';
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode = false;
  isSubmitted = false;
  isFromProformaInvoice = false;
  isFromExportOrder = false;
  disablePrintButton = false;

  form!: FormGroup;
  formConfig!: FormConfigType<TaxInvoice>;
  tableDef!: TableDef<TaxInvoiceDetail>;

  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];

  documentAutoCompleteDef!: AutoCompleteDef<Document_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  loadingPortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  dischargePortAutoCompleteDef!: AutoCompleteDef<Port_SelectList>;
  productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[] = [];

  basedOnList: StaticList[] = [];
  shipmentModeList: StaticList[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: TaxInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private currencyExchangeService: CurrencyExchangeService,
    private navContextService: NavContextService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<TaxInvoice>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.documentAutoCompleteDef = this.pageService.getDocumentAutoCompleteDef(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.loadingPortAutoCompleteDef = this.pageService.getLoadingPortAutoCompleteDef(this.formConfig, this.form);
    this.dischargePortAutoCompleteDef = this.pageService.getDischargePortAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%", customTemplate: this.productAutoCompleteColTemplate },
        { data: "SalesQty", label: "Sales Qty", width: "8%", customTemplate: this.salesQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "RatePerUnitFC", label: "Rate", width: "8%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "10%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountFC", label: "Taxable Amount", width: "10%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountFC", label: "Tax Amount", width: "10%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "8%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    }

    this.LoadDropdownList();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        const taxInvoiceID = Number(paramMap.get('id'));
        if (taxInvoiceID) {
          this.isEditMode = true;
          this.GetDetails(taxInvoiceID);
          return;
        }
        else if (this.navContextService.source) {
          if (this.navContextService.source == 'export-order') {
            this.GetExportOrder(this.navContextService.sourceId!);
            return;
          }
          else if (this.navContextService.source == 'proforma-invoice') {
            this.GetProformaInvoice(this.navContextService.sourceId!);
            return;
          }
        }

        this.isEditMode = false;
        if (this.productListArray.length === 0) {
          this.AddProductRow();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isBasedOnDocument(): boolean {
    return this.form.get('BasedOn')?.value === 1 || this.form.get('BasedOn')?.value === 2;
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
  }

  LoadDropdownList(): void {
    this.LoadStaticLists([
      { fieldName: 'BasedOn', targetList: 'basedOnList' },
      { fieldName: 'ShipmentMode', targetList: 'shipmentModeList' }
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
        ControllerName: 'TaxInvoice',
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
      this.router.navigate(['/ie/tax-invoice/index']);
    } catch (error) { }
  }

  ResetForm(): void {
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
  }

  OnClickRemoveProductItem(index: number): void {
    if (this.productListArray.at(index).value.ProductName !== null) {
      this.alertService.showConfirmation({
        text: `Do you really want to remove <b>${this.productListArray.at(index).value.ProductName}</b>?`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.productListArray.removeAt(index);
          this.productAutoCompleteDef.splice(index, 1);
          this.tableDef.data = this.productListArray.value;
          this.ProductCalculation();
          if (this.productListArray.length == 0) {
            this.AddProductRow();
          }
        }
      });
    } else {
      this.productListArray.removeAt(index);
      this.productAutoCompleteDef.splice(index, 1);
      this.tableDef.data = this.productListArray.value;
      this.ProductCalculation();
      if (this.productListArray.length == 0) {
        this.AddProductRow();
      }
    }
  }

  OnBasedOnChange(): void {
    const basedOnValue = this.form.get('BasedOn')?.value;
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];

    if (basedOnValue === 3) {
      this.AddProductRow();
    }
  }

  LoadDocument(event: string): void {
    try {
      const basedOn = this.form.get('BasedOn')?.value;
      if (basedOn == 1) {
        const dto: ProformaInvoiceRequest = {
          SearchBy: 1,
          SearchValue: event,
          PopulateType: 'AutoSuggest'
        }
        this.pageService.GetProformaInvoiceList(dto)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.documentAutoCompleteDef.options = response.Data.Items.map(
                  (item: ProformaInvoice_SelectList): Document_SelectList => ({
                    DocumentID: item.ProformaInvoiceID,
                    DocumentNo: item.ProformaInvoiceNo,
                    CustomerName: item.CustomerName
                  })
                );
              } else {
                this.documentAutoCompleteDef.options = [];
              }
            },
          });
      }
      else if (basedOn == 2) {
        const dto: ExportOrderRequest = {
          ExportOrderNo: event,
          PopulateType: 'AutoSuggest'
        }
        this.pageService.GetExportOrderList(dto)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.documentAutoCompleteDef.options = response.Data.Items.map(
                  (item: ExportOrder_SelectList): Document_SelectList => ({
                    DocumentID: item.ExportOrderID,
                    DocumentNo: item.ExportOrderNo,
                    CustomerName: item.CustomerName
                  })
                );
              } else {
                this.documentAutoCompleteDef.options = [];
                if (response.Message != "Record not found.") {
                  this.alertService.showServerResponseAlert(response);
                }
              }
            },
          });
      }
    } catch (error) {
    }
  }

  OnSelect_Document(event: Document_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    const basedOn = this.form.get('BasedOn')?.value;
    if (event.DocumentID) {
      if (basedOn == 1) {
        this.form.patchValue({ ProformInvoiceID: this.form.get('DocumentID')?.value });
        this.GetProformaInvoice(event.DocumentID);
      }
      else if (basedOn == 2) {
        this.form.patchValue({ ExportOrderID: this.form.get('DocumentID')?.value });
        this.GetExportOrder(event.DocumentID);
      }
    }

    this.form.patchValue({ BasedOn: basedOn });
  }

  OnClear_Document(): void {
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
    this.selectedCustomerAddress = '';
    this.productListArray.clear();
    this.tableDef.data = [];
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
    if (event.CompanyID) {
      this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
      this.selectedCustomerAddress = event?.BillingAddress || '';
    }
  }

  OnClear_Customer(): void {
    this.form.get('CustomerID')?.patchValue(null);
    this.form.get('CustomerName')?.patchValue(null);
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
            this.form.patchValue({ ExchangeRateToBC: response.Data.Conversion_Rate.toFixed(3) });
          }
        },
      });
  }

  LoadLoadingPort(event: string): void {
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

  LoadDischargePort(event: string): void {
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

  OnClear_LoadingPort(): void {
    this.form.get('LoadingPortID')?.patchValue(null);
    this.form.get('LoadingPortName')?.patchValue(null);
  }

  OnClear_DischargePort(): void {
    this.form.get('DischargePortID')?.patchValue(null);
    this.form.get('DischargePortName')?.patchValue(null);
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
      UOM: event.UOM
    });

    this.tableDef.data = this.productListArray.value
  }

  OnClear_Product(index: number): void {
    const row = this.productListArray.at(index) as FormGroup;
    row.patchValue({ ProductID: null, ProductName: null, UOM: null });

    this.tableDef.data = this.productListArray.value;
  }

  AddProductRow(): void {
    const productItemForm =
      this.formService.createFormArrayItem(this.formConfig.ProductList.items);

    this.productListArray.push(productItemForm);
    const index = this.productListArray.length - 1;

    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
    this.tableDef.data = this.productListArray.value;
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

      const taxableAmountFC = Number((quantity * rate).toFixed(3));
      const taxAmountFC = Number(((taxableAmountFC * salesTaxRate) / 100).toFixed(3));

      group.patchValue({
        TaxableAmountFC: Number(taxableAmountFC.toFixed(3)),
        TaxAmountFC: Number(taxAmountFC.toFixed(3)),
        SalesAmountFC: Number((taxableAmountFC + taxAmountFC).toFixed(3))
      }, { emitEvent: true });

      subtotalAmount += taxableAmountFC;
      taxAmount += taxAmountFC;
      netAmount += (taxableAmountFC + taxAmountFC);
    });

    netAmount += (freightCharge + bankCharges);

    this.form.patchValue({ NetAmountFC: netAmount, SubtotalAmountFC: subtotalAmount, TaxAmountFC: taxAmount }, { emitEvent: true });
  }

  ConvertAmountsToBC(): void {
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

    const subtotalAmountFC = this.GetproductTaxableAmountFC();
    const taxAmountFC = this.GetproductTaxAmountFCSum();
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

  GetproductTaxableAmountFC(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxableAmountFC')?.value || 0;
      return sum + value;
    }, 0);
  }

  GetproductTaxAmountFCSum(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxAmountFC')?.value || 0;
      return sum + value;
    }, 0);
  }

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
              const model: TaxInvoice = {
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

  CreateRecord(model: TaxInvoice): void {
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

  UpdateRecord(model: TaxInvoice): void {
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
              setTimeout(() => {
                this.router.navigate(['/ie/tax-invoice/index']);
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

  GetDetails(taxInvoiceID: number): void {
    try {
      this.pageService.GetDetails(taxInvoiceID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.selectedCustomerAddress = response.Data.CustomerAddress!;
              this.statusText = response.Data.StatusText!;
              this.statusHex = response.Data.StatusHex!;

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
                DocumentNo: response.Data.BasedOn === 1 ? response.Data.ProformaInvoiceNo : response.Data.ExportOrderNo,
                TaxInvoiceDate: DateUtils.toDate(response.Data.TaxInvoiceDate!),
                ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!),
                ReferenceDate: DateUtils.toDate(response.Data.ReferenceDate!)
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

  GetProformaInvoice(proformaInvoiceID: number): void {
    try {
      this.pageService.GetProformaInvoiceDetails(proformaInvoiceID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.productListArray.clear();
              response.Data.ProductList.Items.forEach(item => {
                const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productItemForm.patchValue({
                  ProductID: item.ProductID,
                  ProductName: item.ProductName,
                  SalesQty: item.SalesQty,
                  UOM: item.UOM,
                  RatePerUnitFC: item.RatePerUnitFC,
                  SalesTaxRate: item.SalesTaxRate
                });
                this.productListArray.push(productItemForm);
                const index = this.productListArray.length - 1;

                this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
              });

              this.tableDef.data = this.productListArray.value;
              const { ProductList, BasedOn, IsRoundOff, ExchangeRateDate, ExchangeRateToBC, ...formValues } = response.Data;
              this.selectedCustomerAddress = response.Data.CustomerAddress ?? '';
              formValues.ReferenceDate = DateUtils.toDate(formValues.ReferenceDate)!
              this.form.patchValue({
                ...formValues,
                DocumentNo: formValues.ExportOrderNo,
                BasedOn: 1
              });

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

  GetExportOrder(exportOrderID: number): void {
    try {
      this.pageService.GetExportOrderDetails(exportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.productListArray.clear();
              response.Data.ProductList.Items.forEach(item => {
                const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productItemForm.patchValue({
                  ProductID: item.ProductID,
                  ProductName: item.ProductName,
                  SalesQty: item.SalesQty,
                  UOM: item.UOM,
                  RatePerUnitFC: item.RatePerUnitFC,
                  SalesTaxRate: item.SalesTaxRate
                });
                this.productListArray.push(productItemForm);
                const index = this.productListArray.length - 1;

                this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
              });

              this.tableDef.data = this.productListArray.value;

              // Create the document option for autocomplete
              const documentOption: Document_SelectList = {
                DocumentNo: response.Data.ExportOrderNo,
                CustomerName: response.Data.CustomerName,
                DocumentID: response.Data.ExportOrderID  // Add other required fields
              };

              // Set the autocomplete options
              this.documentAutoCompleteDef.options = [documentOption];

              // Destructure to ignore BasedOn and capture rest of properties
              const { ProductList, BasedOn, IsRoundOff, ExchangeRateDate, ExchangeRateToBC, Narration, ...filteredModel } = response.Data;

              const patchedModel = {
                ...filteredModel,
                BasedOn: 2,
                DocumentID: response.Data.ExportOrderID,
                DocumentNo: documentOption  // Set the entire object, not just the string
              };

              this.form.patchValue({ CustomerID: response.Data.CustomerID, CustomerName: response.Data.CustomerName });
              this.selectedCustomerAddress = response.Data.CustomerAddress!;
              this.form.patchValue(patchedModel);
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
      case 'PortCreateComponent':
        return this.CreatePortComponent();
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

  async CreatePortComponent() {
    const { CreateComponent } = await import('../../../settings/port-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: PortMaster = this.formService.createNullObject<PortMaster>();
    this.LoadDynamicComponent(model);
  }

  PrintTaxInvoice(): void {
    try {
      this.disablePrintButton = true;
      this.route.params.subscribe(params => {
        const taxInvoiceID = +params['id'];

        if (!taxInvoiceID) return;

        this.isEditMode = true;
        const model = {
          TaxInvoiceID: taxInvoiceID
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
    catch (ex) {

    }
  }
}
