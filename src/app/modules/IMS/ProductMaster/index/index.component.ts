import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList } from '../product-master';
import { ProductMasterService } from '../product-master.service';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
import { FormService } from '../../../../shared/services/form.service';
import { ZDataTable } from '../../../../shared/components/z-datatable/z-datatable.component';

@Component({
  selector: 'app-index-product-master',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [CommonModule, ZDataTable],
  providers: [FormValidationService],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('productCodeTemplate', { static: true }) productCodeTemplate!: TemplateRef<any>;
  @ViewChild('productNameTemplate', { static: true }) productNameTemplate!: TemplateRef<any>;
  @ViewChild('isActiveTemplate', { static: true }) isActiveTemplate!: TemplateRef<any>;
  @ViewChild('createdByTemplate', { static: true }) createdByTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<ProductMaster_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;
  constructor(
    private pageService: ProductMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'IMS_ProductMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ProductCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ProductMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false,
    };
    
    this.tableDef.columnDef = [
      {data: 'ProductID', visible: false, orderable: false},
      {data: 'ProductCode', label: 'Product Code', customTemplate: this.productCodeTemplate},
      {data: 'ProductName', label: 'Product Name'},
      {data: 'UnitPrice', label: 'Unit Price', cssClass: 'text-right'},
      {data: 'CostPrice', label: 'Cost Price',cssClass: 'text-right'},
      {data: 'NetWeight', label: 'Net Weight'},
      {data: 'GrossWeight', label: 'Gross Weight'},
      {data: 'PurTaxRate', label: 'Purchase Tax Rate'},
      {data: 'IsActive', label: 'Status', cssClass: 'text-center'},
      {data: '', orderable: false, cssClass: 'text-center',customTemplate: this.actionColTemplate},
    ]
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton() {
    this.router.navigate(['/Admin/ProductMaster/Create']);
  }

  onClickEditDetails(ProductID: number) {
    if (ProductID) {
      this.router.navigate([`/JobPost/Edit/${ProductID}`]);
    }
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try{
      const model: DataTableParams<ProductMaster_IndexTableFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value
      };

      this.pageService
      .PopulateGrid(this.formService.transformFormData(model))
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
    }catch (error) {

    }
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${row.ProductName
            }</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ProductMaster = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.pageService.DeleteProduct(model)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  this.loadData();
                  if (response.IsSuccess) {
                    this.alertService.showAlert({
                      type: 'success',
                      text: response.Message,
                      timer: 5000,
                    });
                  } else {
                    this.alertService.showServerResponseAlert(response);
                  }
                }
              });
          }
        });
    } catch (error) {
      
    }
  }
}
