import { CommonModule } from "@angular/common";
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { FormArray, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AutoCompleteDef } from "../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete";
import { ZFormControlsModule } from "../../../../../shared/components/z-form-controls/z-form-controls.module";
import { TableDef } from "../../../../../shared/components/z-table/z-table";
import { ZTableComponent } from "../../../../../shared/components/z-table/z-table.component";
import { FormConfigType } from "../../../../../shared/models/form.model";
import { AlertNotificationService } from "../../../../../shared/services/alert-notification.service";
import { FormService } from "../../../../../shared/services/form.service";
import { PageHeaderService } from "../../../../../shared/services/page-header.service";
import { DateUtils } from "../../../../../shared/utility/date-utils";
import { Product_SelectList, ProductMaster, ProductRequest } from "../../../../ims/settings/product-master/product-master";
import { Company_SelectList, CompanyMaster, CompanyRequest } from "../../../settings/company-master/company-master";
import { SalesEnquiry } from "../sales-enquiry";
import { SalesEnquiryService } from "../sales-enquiry.service";
import { NavContextService } from "../../../../../core/services/nav-context.service.service";

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
  @ViewChild('requestedQtyColTemplate', { static: true }) requestedQtyColTemplate!: TemplateRef<any>;
  @ViewChild('remarkColTemplate', { static: true }) remarkColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  selectedCustomerAddress!: string | null;
  statusText!: string | null;
  statusHex!: string | null;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  isQuotationAlreadyExists: boolean = false;
  disablePrintButton: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<SalesEnquiry>;
  tableDef!: TableDef<FormGroup>;

  customerList: Company_SelectList[] = [];

  companyMasterAutoCompleteDef!: AutoCompleteDef<Company_SelectList>;
  productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[] = [];

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<SalesEnquiry>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.companyMasterAutoCompleteDef = this.pageService.getCompanyMasterAutoCompleteDef(this.formConfig, this.form);
    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", label: "Product", width: "25%", customTemplate: this.productAutoCompleteColTemplate },
        { data: "RequestedQty", label: "Requested Qty", width: "10%", customTemplate: this.requestedQtyColTemplate },
        { data: "UOM", label: "UOM", width: "7%" },
        { data: "HSCode", label: "HS Code", width: "8%" },
        { data: "Remarks", label: "Remark", width: "25%", customTemplate: this.remarkColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "5%", customTemplate: this.actionColTemplate },
      ],
      data: this.productListArray.value
    }

    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderBackButton(): void {
    try {
      this.router.navigate(['/ie/sales-enquiry/index']);
    } catch (error) { }
  }

  onClickNavigateToSalesQuotation(salesEnquiryID: number): void {
    if (salesEnquiryID) {
      this.navContextService.set('sales-enquiry', salesEnquiryID);
      this.router.navigate([`ie/sales-quotation/create`]);
    }
  }

  resetForm(): void {
    this.formService.resetFormValue<SalesEnquiry>(this.formConfig, this.form);
  }

  get productListArray(): FormArray<FormGroup> {
    return this.form.get('ProductList') as FormArray<FormGroup>;
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
            this.addProductRow();
          }
          return
        }
      });
    }
    else {
      this.productListArray.removeAt(index);
      this.productAutoCompleteDef.splice(index, 1);
      this.tableDef.data = this.productListArray.value;
      if (this.productListArray.length == 0) {
        this.addProductRow();
      }
    }
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
    this.form.patchValue({ CustomerID: event.CompanyID, CustomerName: event.CompanyName, ContactName: event.CompanyContactName, ContactPhone: event.CompanyPhoneNo, ContactEmail: event.CompanyEmailID });
    this.selectedCustomerAddress = event?.BillingAddress || '';
  }

  onClear_Customer(): void {
    this.form.get('CustomerID')?.patchValue(null);
    this.form.get('CustomerName')?.patchValue(null);
    this.form.get('ContactName')?.patchValue(null);
    this.form.get('ContactEmail')?.patchValue(null);
    this.form.get('ContactPhone')?.patchValue(null);
    this.selectedCustomerAddress = null;
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
      UOM: event.UOM
    });

    this.tableDef.data = this.productListArray.value
  }

  OnClear_Product(index: number): void {
    const row = this.productListArray.at(index) as FormGroup;
    row.patchValue({ ProductID: null, ProductName: null, UOM: null });

    this.tableDef.data = this.productListArray.value;
  }

  addProductRow(): void {
    const productItemForm = this.formService.createFormArrayItem(this.formConfig.ProductList.items);
    this.productListArray.push(productItemForm);
    const index = this.productListArray.length - 1;

    this.productAutoCompleteDef[index] = this.pageService.getProductAutoCompleteDef(this.formConfig.ProductList.items, productItemForm);
    this.tableDef.data = this.productListArray.value;
  }

  onSubmit(): void {
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

  updateRecord(model: SalesEnquiry): void {
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
                this.router.navigate(['/ie/sales-enquiry/index']);
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
      const enquiryID = +params['id'];
      if (enquiryID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(enquiryID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.selectedCustomerAddress = response.Data.CustomerAddress;
                  this.statusText = response.Data.StatusText;
                  this.statusHex = response.Data.StatusHex;
                  this.isQuotationAlreadyExists = response.Data.IsQuotationAlreadyExists;
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
                    EnquiryDate: DateUtils.toDate(response.Data.EnquiryDate!),
                    ExpectedDeliveryDate: DateUtils.toDate(response.Data.ExpectedDeliveryDate!)
                  }

                  this.form.patchValue(data);
                } else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
        catch (error) { }
      }
      else {
        if (this.productListArray.length === 0) {
          this.addProductRow();
        }
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
      case 'ProductCreateComponent':
        return this.createProductComponent();
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  }

  loadDynamicComponent(model: any): void {
    setTimeout(() => {
      this.componentRef?.instance.openSidebar(true, false, model);
      this.componentRef?.instance.closeSidebarEvent.subscribe(() => {
        this.destroyComponent();
      });
    })
  }

  destroyComponent(): void {
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

  async createProductComponent() {
    const { CreateComponent } = await import('../../../../ims/settings/product-master/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ProductMaster = this.formService.createNullObject<ProductMaster>();
    this.loadDynamicComponent(model);
  }

  printSalesEnquiry(): void {
    this.disablePrintButton = true;
    this.route.params.subscribe(params => {
      const salesEnquiryID = +params['id'];

      if (!salesEnquiryID) return;

      this.isEditMode = true;
      const model = {
        SalesEnquiryID: salesEnquiryID
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
