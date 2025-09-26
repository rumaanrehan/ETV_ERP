import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SalesEnquiry, SalesEnquiryDetail } from "../sales-enquiry";
import { SalesEnquiryService } from "../sales-enquiry.service";
import { ActivatedRoute, Router } from "@angular/router";

import { Subject, takeUntil } from "rxjs";
import { ZFormControlsModule } from "../../../../../shared/components/z-form-controls/z-form-controls.module";
import { TableDef } from "../../../../../shared/components/z-table/z-table";
import { ZTableComponent } from "../../../../../shared/components/z-table/z-table.component";
import { FormConfigType } from "../../../../../shared/models/form.model";
import { StaticList } from "../../../../../shared/models/select-list";
import { AlertNotificationService } from "../../../../../shared/services/alert-notification.service";
import { FormService } from "../../../../../shared/services/form.service";
import { PageHeaderService } from "../../../../../shared/services/page-header.service";
import { Company_SelectList, CompanyRequest } from "../../../settings/company-master/company-master";
import { AutoCompleteDef } from "../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete";
import { Product_SelectList, ProductRequest } from "../../../../ims/settings/product-master/product-master";
import { DateUtils } from "../../../../../shared/utility/date-utils";

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
  @ViewChild('productNameColTemplate', { static: true }) productNameColTemplate!: TemplateRef<any>;
  @ViewChild('requestedQtyColTemplate', { static: true }) requestedQtyColTemplate!: TemplateRef<any>;
  @ViewChild('remarkColTemplate', { static: true }) remarkColTemplate!: TemplateRef<any>;

  selectedCustomerAddress!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isLoadDocumentVisible: boolean = true;
  isLoadPaymentVisible: boolean = true;

  form!: FormGroup;
  formConfig!: FormConfigType<SalesEnquiry>;
  tableDef!: TableDef<SalesEnquiryDetail>;
 

  customerList: Company_SelectList[] = [];

  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef!: AutoCompleteDef<Product_SelectList>;

  // currencyList: StaticList[] = [
  //   { Text: 'USD - US Dollar', iValue: 1, cValue: 'USD - US Dollar' },
  //   { Text: 'EUR - Euro', iValue: 2, cValue: 'EUR - Euro' },
  //   { Text: 'JPY - Japanese Yen', iValue: 3, cValue: 'JPY - Japanese Yen' },
  //   { Text: 'GBP - British Pound', iValue: 4, cValue: 'GBP - British Pound' },
  //   { Text: 'INR - Indian Rupee', iValue: 5, cValue: 'INR - Indian Rupee' }
  // ];
  statusList: StaticList[] = [
  { Text: 'Received', iValue: 1, cValue: '#6c757d' },         // Gray
  { Text: 'Under Review', iValue: 2, cValue: '#007bff' },     // Blue
  { Text: 'Quotation Generated', iValue: 3, cValue: '#28a745' }, // Green
  { Text: 'Closed - Successful', iValue: 4, cValue: '#17a2b8' }, // Teal/Info
  { Text: 'Closed - Lost', iValue: 5, cValue: '#ffc107' },    // Amber/Warning
  { Text: 'Closed - Cancelled', iValue: 6, cValue: '#dc3545' } // Red/Danger
];



  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<SalesEnquiry>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.productAutoCompleteDef = this.pageService.getProductMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "25%", customTemplate: this.productNameColTemplate },
        { data: "RequestedQty", label: "Requested Qty", width: "10%", customTemplate: this.requestedQtyColTemplate },
        { data: "Remark", label: "Remark", width: "15%", customTemplate: this.remarkColTemplate },
      ],
      data: this.productListArray.value
    }

    // this.loadDropdownList();
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }
    
  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/sales-enquiry/dataview']);
    } catch (error) { }
  }

  resetForm(): void {
    this.formService.resetFormValue<SalesEnquiry>(this.formConfig, this.form);
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
        // this.productCalculation();

        console.log(this.tableDef.data);
        console.log(this.productListArray.value);
      }
    });
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

    console.log(this.form.value);
    this.tableDef.data = this.productListArray.value;

    // console.log(this.form.value);
    // console.log(this.productListArray.value);
    // console.log(this.tableDef.data);

    // const data: ExportOrder_ProductDetail = {
    //   ProductID: event.ProductID, ProductName: event.ProductName, SalesQty: null, RatePerUnitBC: null, TaxRate: event.PurTaxRate
    // }
    // this.tableDef.data.push(data);
  }

  OnCustomerSelect(event: Company_SelectList): void {
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName });
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }
  
 
  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    // this.convertAmountsToBC();
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
              const model: SalesEnquiry = {
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
    
  createRecord(model: SalesEnquiry): void {
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
      
  updateRecord(model: SalesEnquiry): void {
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
                this.router.navigate(['/ie/sales-enquiry/dataview']);
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
      const EnquiryID = +params['id'];
      if (EnquiryID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(EnquiryID)
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
  
  GetOrderItemDetails(model: SalesEnquiry): void {
    this.route.params.subscribe((params) => {
      const EnquiryID = +params['id'];
      this.pageService.GetOrderItemDetails(EnquiryID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response.Data.Items);
              // this.loadPortList();
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
    
  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }

  getStatus(statusId: number | null | undefined): StaticList | undefined {
    return this.statusList.find(s => s.iValue === statusId);
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
   