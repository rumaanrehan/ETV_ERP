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
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountBCColTemplate', { static: true }) taxableAmountBCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountBCColTemplate', { static: true }) taxAmountBCColTemplate!: TemplateRef<any>;

  selectedVendorAddress!: string | null;

  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ImportOrder>;
  tableDef!: TableDef<ImportOrderDetail>;

  customerList: Company_SelectList[] = [];
  taxSlabList: TaxSlab_SelectList[] = [];
  portList: Port_SelectList[] = [];

  incotermList: StaticList[] = [];
  shipmentModeList: StaticList[] = [];

  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  currencyList: StaticList[] = [
    { Text: 'USD - US Dollar', iValue: 1, cValue: 'USD - US Dollar' },
    { Text: 'EUR - Euro', iValue: 2, cValue: 'EUR - Euro' },
    { Text: 'JPY - Japanese Yen', iValue: 3, cValue: 'JPY - Japanese Yen' },
    { Text: 'GBP - British Pound', iValue: 4, cValue: 'GBP - British Pound' },
    { Text: 'INR - Indian Rupee', iValue: 5, cValue: 'INR - Indian Rupee' }
  ];

  statusList: StaticList[] = [
    { Text: 'Processing', iValue: 1, cValue: '' },
    { Text: 'Ready to Ship', iValue: 2, cValue: '' }
  ];

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
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%" },
        { data: "PurchaseQty", label: "Purchase Qty", width: "10%", customTemplate: this.purchaseQtyColTemplate },
        { data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitColTemplate },
        { data: "TaxRate", label: "Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate },
        { data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountBCColTemplate },
        { data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountBCColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate },
      ],
      data: this.productListArray.value
    }

    this.loadDropdownList();
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTaxSlabChange(): void {
    console.log(this.form.value);
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'IncotermID', targetList: 'incotermList' },
      { fieldName: 'ShipmentModeID', targetList: 'shipmentModeList' },
    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.taxSlabList = data.taxSlabList.Data.Items;
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof CreateComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'ImportOrder',
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

        console.log(this.tableDef.data);
        console.log(this.productListArray.value);
      }
    });
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('PurchaseQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
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
              console.log(response.Data.Items);
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

  onClear_Company(): void {
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
      PurchaseTaxRate: event.PurTaxRate
    });

    // this.productListArray = [...this.productListArray, productItemForm];
    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;

    // console.log(this.form.value);
    // console.log(this.productListArray.value);
    // console.log(this.tableDef.data);

    // const data: ExportOrder_ProductDetail = {
    //   ProductID: event.ProductID, ProductName: event.ProductName, PurchaseQty: null, RatePerUnitBC: null, TaxRate: event.PurTaxRate
    // }
    // this.tableDef.data.push(data);
  }

  productCalculation(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const quantity = group.get('PurchaseQty')?.value || 0;
      const rate = group.get('RatePerUnitBC')?.value || 0;
      const purchasetaxRate = group.get('PurchaseTaxRate')?.value || 0;

      const taxableAmountBC = quantity * rate;
      const taxAmountBC = (taxableAmountBC * purchasetaxRate) / 100;

      group.patchValue({
        TaxAmountBC: taxAmountBC,
        TaxAmountFC: taxAmountBC / exchangeRate,
        RatePerUnitFC: rate / exchangeRate,
        TaxableAmountBC: taxableAmountBC,
        TaxableAmountFC: taxableAmountBC / exchangeRate
      }, { emitEvent: true });
    });

    // After updating all rows, update the totals
    const subtotalAmountBC = this.getproductTaxableAmountBC();
    const taxAmountBC = this.getproductTaxAmountBCSum();

    this.form.patchValue({
      SubtotalAmountBC: subtotalAmountBC,
      TaxAmountBC: taxAmountBC,
      SubtotalAmountFC: subtotalAmountBC / exchangeRate,
      TaxAmountFC: taxAmountBC / exchangeRate
    });
  }

  getproductTaxableAmountBC(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxableAmountBC')?.value || 0;
      return sum + value;
    }, 0);
  }

  getproductTaxAmountBCSum(): number {
    return this.productListArray.controls.reduce((sum, group) => {
      const value = group.get('TaxAmountBC')?.value || 0;
      return sum + value;
    }, 0);
  }

  OnCustomerSelect(event: Company_SelectList): void {
    this.form.patchValue({ VendorID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedVendorAddress = event?.BillingAddress || '';
  }

  onChangeShipmentMode(): void {
    this.loadPortList();
  }

  loadPortList(): void {
    try {
      const dto: PortRequest = {
        PortTypeID: this.form.get('ShipmentModeID')?.value,
        PopulateType: 'SelectList'
      }
      this.pageService.GetPortList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response.Data.Items);
              this.portList = response.Data.Items;
            } else if (response.Status == "Info") {
              this.portList = [];
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {
    }
  }

  onSubmit(): void {
    console.log(this.form.errors, this.form);
    if (this.isSubmitted) return;

    this.isSubmitted = true;
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
                if (response.IsSuccess) {
                  this.GetOrderItemDetails(response.Data)
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

  GetOrderItemDetails(model: ImportOrder) {
    this.route.params.subscribe((params) => {
      const ImportOrderID = +params['id'];
      this.pageService.GetOrderItemDetails(ImportOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.loadPortList();
              response.Data.Items.forEach(item => {
                const patchedModel = {
                  ...item,
                  ProductName: item.Product!.ProductName || '',
                };
                const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
                productForm.patchValue(patchedModel);
                this.productListArray.push(productForm);
              });
              this.tableDef.data = this.productListArray.value;
              this.selectedVendorAddress = model.Vendor?.BillingAddress!;
              const patchedModel = {
                ...model,
                VendorID: model.Vendor?.CompanyID,
                VendorName: model.Vendor?.CompanyName,
                ImportOrderDate: DateUtils.toDate(model.ImportOrderDate),
                ReferenceDate: DateUtils.toDate(model.ReferenceDate),
                ExchangeRateDate: DateUtils.toDate(model.ExchangeRateDate)
              };
              this.form.patchValue(patchedModel);
            }
            else {
              // this.alertService.showServerResponseAlert(paymentInstallmentResponse);
            }
          },
        });
    });
  }
}