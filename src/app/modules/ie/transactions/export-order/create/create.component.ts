import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ZTableComponent } from '../../../../../shared/components/z-table/z-table.component';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { Product_SelectList, ProductRequest } from '../../../../ims/settings/product-master/product-master';
import { Company_SelectList, CompanyRequest } from '../../../settings/company-master/company-master';
import { Port_SelectList, PortRequest } from '../../../settings/port-master/port-master';
import { ExportOrder, ExportOrderDetail, ExportOrderDocumentList, ExportOrderPaymentList } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { TaxSlab_SelectList, TaxSlabMaster } from '../../../../admin/settings/TaxSlabMaster/tax-slab-master';
import { ExportOrderDocumentTemplate } from '../../export-order-document/export-order-document';
import { PaymentTerm_SelectList } from '../../../settings/payment-term-master/payment-term-master';
import { ExportOrderPaymentTemplate } from '../../export-order-payment/export-payment';

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
  @ViewChild('ratePerUnitColTemplate', { static: true }) ratePerUnitColTemplate!: TemplateRef<any>;
  @ViewChild('taxRateColTemplate', { static: true }) taxRateColTemplate!: TemplateRef<any>;
  @ViewChild('removeProductItemColTemplate', { static: true }) removeProductItemColTemplate!: TemplateRef<any>;
  @ViewChild('taxableAmountBCColTemplate', { static: true }) taxableAmountBCColTemplate!: TemplateRef<any>;
  @ViewChild('taxAmountBCColTemplate', { static: true }) taxAmountBCColTemplate!: TemplateRef<any>;
  
  //Export Order Document Table Related Template
  @ViewChild('documentUploadDateTemplate', { static: true }) documentUploadDateTemplate!: TemplateRef<any>;
  @ViewChild('isDocumentVerifiedTemplate', { static: true }) isDocumentVerifiedTemplate!: TemplateRef<any>;
  @ViewChild('documentActionColTemplate', { static: true }) documentActionColTemplate!: TemplateRef<any>;
  
  //Export Order Payment Table Related Template
  @ViewChild('paymentDateTemplate', { static: true }) paymentDateTemplate!: TemplateRef<any>;
  @ViewChild('paymentActionColTemplate', { static: true }) paymentActionColTemplate!: TemplateRef<any>;

  selectedCustomerAddress!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isLoadDocumentVisible: boolean = true;
  isLoadPaymentVisible: boolean = true;

  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrder>;
  tableDef!: TableDef<ExportOrderDetail>;
  exportOrderDocumentTableDef!: TableDef<ExportOrderDocumentList>
  exportOrderPaymentTableDef!: TableDef<ExportOrderPaymentList>

  customerList: Company_SelectList[] = [];
  paymentTermList: PaymentTerm_SelectList[] = [];
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
    { Text: 'Processing', iValue: 1, cValue: '#28a745' },
    { Text: 'Ready to Ship', iValue: 2, cValue: '#dc3545' }
  ];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ExportOrder>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.exportOrderDocumentTableDef = this.pageService.getExportOrderDocumentTableDef({SerialNoTemplate: this.serialNoColTemplate ,IsVerfiedTemplate: this.isDocumentVerifiedTemplate, UpdateDateTemplate: this.documentUploadDateTemplate, ActionTemplate: this.documentActionColTemplate} as ExportOrderDocumentTemplate);
    this.exportOrderPaymentTableDef = this.pageService.getExportOrderPaymentTableDef({SerialNoTemplate: this.serialNoColTemplate, PaymentDateTemplate: this.paymentDateTemplate, ActionTemplate: this.paymentActionColTemplate} as ExportOrderPaymentTemplate);
    this.tableDef = {
      columnDef: [
        {data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate},
        {data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%"},
        {data: "SalesQty", label: "Sales Qty", width: "10%", customTemplate: this.salesQtyColTemplate},
        {data: "RatePerUnitBC", label: "Rate", width: "10%", customTemplate: this.ratePerUnitColTemplate},
        {data: "TaxRate", label: "Tax Rate", width: "15%", customTemplate: this.taxRateColTemplate},
        {data: "TaxableAmountBC", label: "Taxable Amount", width: "15%", customTemplate: this.taxableAmountBCColTemplate},
        {data: "TaxAmountBC", label: "Tax Amount", width: "15%", customTemplate: this.taxAmountBCColTemplate},
        {data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.removeProductItemColTemplate},
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

  loadDropdownList(): void  {
    this.loadStaticLists([
      { fieldName: 'Incoterm', targetList: 'incotermList' },
      { fieldName: 'ShipmentMode', targetList: 'shipmentModeList' },
    ]);
    this.pageService.GetMasterDropdownLists()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        this.paymentTermList = data.paymentTermList.Data.Items;
        this.taxSlabList = data.taxSlabList.Data.Items;
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

  onTaxSlabChange(): void{
    console.log(this.form.value);
  }
  
  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/export-order/dataview']);
    } catch (error) {}
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

        console.log(this.tableDef.data);
        console.log(this.productListArray.value);
      }
    });
  }

  getAmount(index: number): number[] {
    const group = this.productListArray.at(index);
    const quantity = group.get('SalesQty')?.value || 0;
    const rate = group.get('RatePerUnitBC')?.value || 0;
    const salesTaxRate = group.get('SalesTaxRate')?.value || 0;
    
    return [quantity * rate, quantity * rate * (salesTaxRate / 100)];
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
      SalesTaxRate: event.PurTaxRate
    });

    // this.productListArray = [...this.productListArray, productItemForm];
    this.productListArray.push(productItemForm);
    this.tableDef.data = this.productListArray.value;

    // console.log(this.form.value);
    // console.log(this.productListArray.value);
    // console.log(this.tableDef.data);
    
    // const data: ExportOrder_ProductDetail = {
    //   ProductID: event.ProductID, ProductName: event.ProductName, SalesQty: null, RatePerUnitBC: null, TaxRate: event.PurTaxRate
    // }
    // this.tableDef.data.push(data);
  }

  productCalculation(): void {
    const exchangeRate = this.form.get('ExchangeRateToBC')?.value || 1;

    this.productListArray.controls.forEach((group: FormGroup) => {
      const quantity = group.get('SalesQty')?.value || 0;
      const rate = group.get('RatePerUnitBC')?.value || 0;
      const salestaxRate = group.get('SalesTaxRate')?.value || 0;

      const taxableAmountBC = quantity * rate;
      const taxAmountBC = (taxableAmountBC * salestaxRate) / 100;

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
    this.form.patchValue({CustomerID: event.CompanyID, CustomerName: event.CompanyName});
    this.selectedCustomerAddress = event?.BillingAddress || '';
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
            this.portList = response.Data.Items;
          } else if(response.Status == "Info") {
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
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    try {
      if(this.form.value.ProductList.length === 0) {
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
            setTimeout(() => {
              this.router.navigate(['/ie/export-order/dataview']);
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
      const exportOrderID = +params['id'];
      if (exportOrderID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(exportOrderID)
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

  GetOrderItemDetails(model: ExportOrder): void {
    this.route.params.subscribe((params) => {
      const ExportOrderID = +params['id'];
      this.pageService.GetOrderItemDetails(ExportOrderID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.loadPortList();
            response.Data.Items.forEach(item => {
              const patchedModel = {
                ...item,
                ProductName: item.Product!.ProductName,
              };
              const productForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
              productForm.patchValue(patchedModel);
              this.productListArray.push(productForm);
            });
            this.tableDef.data = this.productListArray.value;
            this.selectedCustomerAddress = model.Customer?.BillingAddress!;
            const patchedModel = {
              ...model,
              CustomerID: model.Customer?.CompanyID,
              CustomerName: model.Customer?.CompanyName,
              ExportOrderDate: DateUtils.toDate(model.ExportOrderDate),
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
    if(row.DocumentPath && row.DocumentPath.trim() !== '') {
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

  formatDate(date: Date){
    return DateUtils.formatDate(date);
  }
}