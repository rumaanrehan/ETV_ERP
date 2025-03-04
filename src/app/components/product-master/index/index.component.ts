import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Product, ProductModel, UpdateProductList } from '../product-master';
import { ProductService } from '../product.service';
import {
  IndexTableComponent,
  IndexTableParams,
} from '../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { FormService } from '../../../shared/services/form.service';
import { PageHeaderService } from '../../../shared/services/page-header.service';
import { Router } from '@angular/router';
import { Create_ProductMasterComponent } from '../create/create.component';
import { CommonModule } from '@angular/common';
// import { Create_ProductMasterComponent } from '../create/create.component';

@Component({
  selector: 'app-index-product-master',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, Create_ProductMasterComponent, CommonModule],
  providers: [FormValidationService],
})
export class Index_ProductMasterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showCreateSidebar = false;
  @ViewChild('pageHeaderActionTemplate', { static: true })
  pageHeaderActionTemplate!: TemplateRef<any>;
  // @ViewChild(Create_ProductMasterComponent) createSidebar!: Create_ProductMasterComponent;
  @ViewChild('createSidebar', { static: false })
  createSidebar!: Create_ProductMasterComponent;
  // @ViewChild('createSidebar', { static: false }) createSidebar!: Create_ProductMasterComponent;
  @ViewChild('productCodeTemplate', { static: true })
  productCodeTemplate!: TemplateRef<any>;
  @ViewChild('productNameTemplate', { static: true })
  productNameTemplate!: TemplateRef<any>;
  @ViewChild('productCategoryTemplate', { static: true })
  productCategoryTemplate!: TemplateRef<any>;
  @ViewChild('productDescriptionTemplate', { static: true })
  productDescriptionTemplate!: TemplateRef<any>;
  @ViewChild('unitTemplate', { static: true }) unitTemplate!: TemplateRef<any>;
  @ViewChild('manufacturerIdTemplate', { static: true })
  manufacturerIdTemplate!: TemplateRef<any>;
  @ViewChild('hsCodeTemplate', { static: true })
  hsCodeTemplate!: TemplateRef<any>;
  @ViewChild('unitPriceTemplate', { static: true })
  unitPriceTemplate!: TemplateRef<any>;
  @ViewChild('costPriceTemplate', { static: true })
  costPriceTemplate!: TemplateRef<any>;
  @ViewChild('taxSlabIdTemplate', { static: true })
  taxSlabIdTemplate!: TemplateRef<any>;
  @ViewChild('purTaxRateTemplate', { static: true })
  purTaxRateTemplate!: TemplateRef<any>;
  @ViewChild('reorderLevelTemplate', { static: true })
  reorderLevelTemplate!: TemplateRef<any>;
  @ViewChild('reorderQtyTemplate', { static: true })
  reorderQtyTemplate!: TemplateRef<any>;
  @ViewChild('measurementUnitTemplate', { static: true })
  measurementUnitTemplate!: TemplateRef<any>;
  @ViewChild('netWeightTemplate', { static: true })
  netWeightTemplate!: TemplateRef<any>;
  @ViewChild('grossWeightTemplate', { static: true })
  grossWeightTemplate!: TemplateRef<any>;
  @ViewChild('dimensionsTemplate', { static: true })
  dimensionsTemplate!: TemplateRef<any>;
  @ViewChild('packagingTypeTemplate', { static: true })
  packagingTypeTemplate!: TemplateRef<any>;
  @ViewChild('isActiveTemplate', { static: true })
  isActiveTemplate!: TemplateRef<any>;
  @ViewChild('createdByTemplate', { static: true })
  createdByTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true })
  actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<Product>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private router: Router,
    private productService: ProductService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false,
      columnDef: [
        {
          data: 'ProductId',
          // label: 'Product Code',
          customTemplate: this.productCodeTemplate,
          visible: false, orderable: false
        },
        {
          data: 'productCode',
          label: 'Product Code',
          customTemplate: this.productCodeTemplate,
        },
        { 
          data: 'productName',
          label: 'Product Name',
          customTemplate: this.productNameTemplate,
        },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // },
        {
          data: 'unitPrice',
          label: 'Unit Price',
          cssClass: 'text-right',
          customTemplate: this.unitPriceTemplate,
        },
        {
          data: 'costPrice',
          label: 'Cost Price',
          cssClass: 'text-right',
          customTemplate: this.costPriceTemplate,
        },
        {
          data: 'netWeight',
          label: 'Net Weight',
          customTemplate: this.netWeightTemplate,
        },
        {
          data: 'grossWeight',
          label: 'Gross Weight',
          customTemplate: this.grossWeightTemplate,
        },
        {
          data: 'purTaxRate',
          label: 'Purchase Tax Rate',
          customTemplate: this.purTaxRateTemplate,
        },
        // {
        //   data: 'reorderQty',
        //   label: 'Reorder Quantity',
        //   customTemplate: this.reorderQtyTemplate,
        // },
        {
          // orderable: false,
          data: 'isActive',
          label: 'Status',
          cssClass: 'text-center',
          customTemplate: this.isActiveTemplate,
        },
        {
          data: '',
          orderable: false,
          cssClass: 'text-center',
          customTemplate: this.actionColTemplate,
        },
      ],
    };
    // this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadProducts(this.tableParameters);
  }

  onCloseSidebar(): void {
    // this.showCreateSidebar = false;
    this.loadProducts(this.tableParameters);
  }

  loadProducts(tableParameters: TableLazyLoadEvent) {
    // this.tableDef.loading = true;

    this.productService
      .PopulateGrid(tableParameters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        },
      });
    }

  onClickPageHeaderAddButton() {
    console.log('Add Product Clicked');
    // console.log(this.createSidebar.isFormSidebarVisible);
    this.router.navigate(['/Admin/ProductMaster/Create']);
  }

  onClickEditDetails(productCode: string, ActiveStatus: boolean) {
    this.router.navigate([`/Admin/ProductMaster/Edit/${productCode}`]);
    // this.showCreateSidebar = true;
    // console.log('Edit Product:', productCode);
    // try {
    //   if (this.createSidebar && productCode) {
    //     this.productService
    //       .getDetails(productCode)
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe({
    //         next: (response) => {
    //           console.log(response);

    //           if (response.IsSuccess) {
    //             console.log(this.createSidebar);
    //             setTimeout(() => {
    //               const model: any = response.Data;
    //               this.createSidebar.openSidebar(ActiveStatus, true, model);
    //             });
    //           } else {
    //             this.alertService.showServerResponseAlert(response);
    //           }
    //         },
    //       });
    //   }
    // } catch (error) {}
  }

  onClickDelete(product: any) {
    console.log('I want to delete this: ' + product.ProductId);
    try {
      const ActionType = 'Delete';
      const inputPlaceholder = 'Reason to Delete';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${
            product.ProductName
          }</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: Product = {
              ...product,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.productService
              .DeleteProduct(product.ProductId)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  this.loadProducts(this.tableParameters);
                  if (response.IsSuccess) {
                    // this.loadProducts();//============
                    this.alertService.showAlert({
                      type: 'success',
                      text: response.Message,
                      timer: 5000,
                    });
                  } else {
                    this.alertService.showServerResponseAlert(response);
                  }
                },
                error: (err) => {
                  console.error('Error deleting product:', err);
                  this.alertService.showAlert({
                    type: 'error',
                    text: 'Failed to delete product. Please try again later.',
                    timer: 5000,
                  });
                },
              });
          }
        });
    } catch (error) {
      console.error('Error in onClickDelete:', error);
    }
  }
}
