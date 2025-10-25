import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { Product_SelectList, ProductMaster, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyMaster, CompanyRequest } from '../../../settings/company-master/company-master';
import { ExportOrder, ExportOrder_Detail, ExportOrder_SelectList, ExportOrderRequest } from '../../export-order/export-order';
import { ProformaInvoice, ProformaInvoice_Detail, ProformaInvoice_SelectList, ProformaInvoiceRequest } from '../../proforma-invoice/proforma-invoice';
import { Document_SelectList, TaxInvoice, TaxInvoiceDetail } from '../tax-invoice';
import { TaxInvoiceService } from '../tax-invoice.service';
import { Currency_SelectList, CurrencyMaster } from '../../../../admin/settings/currency-master/currency-master';
import { TaxSlab_SelectList } from '../../../../admin/settings/tax-slab-master/tax-slab-master';

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
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<TaxInvoice>;

  tableDef!: TableDef<TaxInvoiceDetail>;

  taxSlabList: TaxSlab_SelectList[] = [];
  currencyList: Currency_SelectList[] = [];

  documentAutoCompleteDef!: AutoCompleteDef<Document_SelectList>;
  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  basedOnList: StaticList[] = [];
  
  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: TaxInvoiceService,
    private formService: FormService,
    private alertService: AlertNotificationService,
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
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%" },
        { data: "SalesQty", label: "Sales Qty", width: "8%", customTemplate: this.salesQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "RatePerUnitBC", label: "Rate", width: "8%", customTemplate: this.ratePerUnitFCColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "10%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "14%", customTemplate: this.taxableAmountFCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountFCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    this.getDetails();
  }
  
  get isBasedOnDocument(): boolean {
    return this.form.get('BasedOn')?.value === 1 || this.form.get('BasedOn')?.value === 2;
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
  
  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/tax-invoice/index']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
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
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
    this.form.get('BasedOn')?.patchValue(basedOnValue);

    this.productListArray.clear();
    this.tableDef.data = [];
  }

  loadDocument(event: string): void {
    try {
      const basedOn = this.form.get('BasedOn')?.value;
      if(basedOn == 1){
        const dto: ProformaInvoiceRequest = {
          SearchBy: 1,
          SearchValue : event,
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
                if (response.Message != "Record not found.") {
                  this.alertService.showServerResponseAlert(response);
                }
              }
            },
          });
        }
      else if(basedOn == 2){
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

  onSelect_Document(event: Document_SelectList): void {
    this.productListArray.clear();
    this.tableDef.data = [];
    const basedOn = this.form.get('BasedOn')?.value;
    if (event.DocumentID) {
      if(basedOn == 1) {
        this.GetProformaInvoice(event.DocumentID);
      }
      else if(basedOn == 2) {
        this.GetExportOrder(event.DocumentID);
      }
    }

    this.form.patchValue({BasedOn: basedOn});
  }

  onClear_Document(): void {
    this.formService.resetFormValue<TaxInvoice>(this.formConfig, this.form);
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
              if (response.Message != "Record not found.") {
                this.alertService.showServerResponseAlert(response);
              }
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
      // const salesAmountFC = Number((taxableAmountFC + taxAmountFC).toFixed(3));

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
              const model: TaxInvoice = {
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

  createRecord(model: TaxInvoice): void {
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

  updateRecord(model: TaxInvoice): void {
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

  getDetails(): void {
    this.route.params.subscribe((params) => {
      const taxInvoiceID = +params['id'];
      if (taxInvoiceID) {
        this.isEditMode = true;
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
                    const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                    productForm.patchValue(item);
                    this.productListArray.push(productForm);
                  });

                  this.tableDef.data = this.productListArray.value;
                  const { ProductList, ...formValues } = response.Data;
                  const data = {
                    ...formValues,
                    DocumentNo: response.Data.BasedOn === 1 ? response.Data.ProformaInvoiceNo : response.Data.ExportOrderNo,
                    TaxInvoiceDate: DateUtils.toDate(response.Data.TaxInvoiceDate!),
                    ExchangeRateDate: DateUtils.toDate(response.Data.ExchangeRateDate!)
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

  // GetInvoiceItemDetails(model: TaxInvoice): void {
  //   this.pageService.GetInvoiceItemDetails(model.TaxInvoiceID!)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
  //           response.Data.Items.forEach(item => {
  //             const patchedModel = {
  //               ...item,
  //               ProductName: item.Product!.ProductName,
  //             };
  //             const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //             productForm.patchValue(patchedModel);
  //             this.productListArray.push(productForm);
  //           });
  //           this.tableDef.data = this.productListArray.value;
  //           this.selectedCustomerAddress = model.Customer?.BillingAddress!;
  //           const patchedModel = {
  //             ...model,
  //             TaxInvoiceDate: DateUtils.toDate(model.TaxInvoiceDate),
  //             ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate),
  //             CustomerName: model.Customer?.CompanyName
  //           };
  //           this.form.patchValue(patchedModel);

  //           if (model.BasedOn === 1) {
  //             this.form.patchValue({
  //               ProformaInvoiceNo: model.DocumentNo
  //             });
  //           } 
  //           else if (model.BasedOn === 2) {
  //             this.form.patchValue({
  //               ExportOrderNo: model.DocumentNo
  //             });
  //           }
  //         }
  //         else {
  //           // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
  //         }
  //       },
  //     });
  // }

  GetProformaInvoice(proformaInvoiceID: number): void {
    try {
      this.pageService.GetProformaInvoiceDetails(proformaInvoiceID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response);
              const keysToPatch = Object.keys(this.formConfig).filter(
                k => !['TaxInvoiceNo', 'BasedOn','IsRoundOff', 'ExchangeRateToBC', 'Narration', 'ProductList'].includes(k)
              );

              const filteredModel = keysToPatch.reduce((acc, key) => {
                const typedKey = key as keyof ProformaInvoice_Detail;
                const value = response.Data[typedKey] ?? undefined;
                (acc as any)[typedKey] = value;
                return acc;
              }, {} as Partial<ProformaInvoice_Detail>);

              this.selectedCustomerAddress= response.Data.CustomerAddress ?? '';
              this.form.patchValue({ ...filteredModel,
                CustomerID: response.Data.CustomerID,
                CustomerName: response.Data.CustomerName,
                DocumentID: response.Data.ProformaInvoiceID,
                DocumentNo: response.Data.ProformaInvoiceNo
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
              const { ProductList, BasedOn, IsRoundOff, ExchangeRateToBC, ...formValues } = response.Data;
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

  // GetProformaInvoiceItemDetails(model: ProformaInvoice): void {
  //   this.pageService.GetProformaInvoiceItemDetails(model.ProformaInvoiceID!)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
            
  //           this.selectedCustomerAddress = model.Customer?.BillingAddress ?? '';
  //           response.Data.Items.forEach(item => {
  //             const patchedModel = {
  //               ...item,
  //               ProductName: item.Product!.ProductName,
  //             };
  //             const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //             productForm.patchValue(patchedModel);
  //             this.productListArray.push(productForm);
  //           });
  //           this.tableDef.data = this.productListArray.value;
          
  //           const { BasedOn, ...filteredModel } = model;

  //           const patchedModel = {
  //             ...filteredModel,
  //             ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate),
  //             DocumentID: model.ProformaInvoiceID,
  //             DocumentNo: model.ProformaInvoiceNo,
  //             CustomerID: model.Customer?.CompanyID, 
  //             CustomerName: model.Customer?.CompanyName
  //           };

  //           this.form.patchValue(patchedModel);
  //         }
  //         else {
  //           this.alertService.showServerResponseAlert(response);
  //         }
  //       },
  //     });
  // }

  GetExportOrder(exportOrderID: number): void {
    try {
      this.pageService.GetExportOrderDetails(exportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response);
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

              // Create the document option for autocomplete
              const documentOption: Document_SelectList = {
                DocumentNo: response.Data.ExportOrderNo,
                CustomerName: response.Data.CustomerName,
                DocumentID: response.Data.ExportOrderID  // Add other required fields
              };

            // Set the autocomplete options
            this.documentAutoCompleteDef.options = [documentOption];
          
              // Destructure to ignore BasedOn and capture rest of properties
              const { ProductList, BasedOn, IsRoundOff, ExchangeRateDate, ExchangeRateToBC,  Narration, ...filteredModel } = response.Data;

              const patchedModel = {
                ...filteredModel,
                DocumentID: response.Data.ExportOrderID,
                DocumentNo: documentOption  // Set the entire object, not just the string
              };
              
              this.form.patchValue({ CustomerID: response.Data.CustomerID, CustomerName: response.Data.CustomerName });

              console.log('Final model before patching:', patchedModel); // Debug log
              this.selectedCustomerAddress = response.Data.CustomerAddress!;
              this.form.patchValue(patchedModel);

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

  // GetExportOrderItemDetails(model: ExportOrder): void {
  //   this.pageService.GetExportOrderItemDetails(model.ExportOrderID!)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
  //           response.Data.Items.forEach(item => {
  //             const patchedModel = {
  //               ...item,
  //               ProductName: item.Product!.ProductName,
  //             };
  //             const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
  //             productForm.patchValue(patchedModel);
  //             this.productListArray.push(productForm);
  //           });
  //           this.tableDef.data = this.productListArray.value;
          
  //           // Destructure to ignore BasedOn and capture rest of properties
  //           const { BasedOn, Narration, ...filteredModel } = model;

  //           const patchedModel = {
  //             ...filteredModel,
  //             ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate),
  //             DocumentID: model.ExportOrderID,
  //             DocumentNo: model.ExportOrderNo
  //           };
  //           this.form.patchValue({ CustomerID: model.Customer?.CountryID, CustomerName: model.Customer?.CompanyName });
  //           this.form.patchValue(patchedModel);
  //         }
  //         else {
  //           // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
  //         }
  //       },
  //     });
  // }

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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
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
