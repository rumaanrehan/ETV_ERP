import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductMaster, ProductMaster_IndexTableFilter, ProductMaster_IndexTableList } from '../product-master';
import { ProductMasterService } from '../product-master.service';
import { CreateComponent } from '../create/create.component';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('productCodeTemplate', { static: true }) productCodeTemplate!: TemplateRef<any>;
  @ViewChild('productActiveStatusTemplate', { static: true }) productActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<ProductMaster_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageService: ProductMasterService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) {}

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
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "3%" },
      { data: 'ProductCode', label: 'Code', hideVisToggle: true, filterable: true, width: "5%", customTemplate: this.productCodeTemplate },
      { data: 'ProductName', label: 'Product Name', filterable: true },
      { data: 'ItemCategoryName', label: 'Item Category', width: "10%", filterable: true },
      { data: 'GenericItemName', label: 'Generic Item', width: "10%", filterable: true },
      { data: 'ManufacturerName', label: 'Manufacturer Name', width: "10%", filterable: true },
      { data: 'UOMName', label: 'UOM Name', width: "10%", filterable: true },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "5%", customTemplate: this.productActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ProductMaster>());
    }
  }

  onClickEditDetails(productID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && productID) {
        this.pageService.GetDetails(productID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response.Data);
              this.createSidebar.openSidebar(activeStatus, true, response.Data);
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
      }
    }
    catch (error) {

    }
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try {
      const model: DataTableParams<ProductMaster_IndexTableFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value,
      };

      this.pageService.PopulateGrid(this.formService.transformFormData(model))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            console.log(response.Data);
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          }
          else {
            this.tableDef.data = [];
            this.tableDef.totalRecords = 0;
            this.alertService.showServerResponseToast(response);
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        }
      });
    } catch (error) {

    }
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService
      .showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${ row.ProductName }</b>"?`,})
        .then((result) => {
        if (result.isConfirmed) {
          const model: ProductMaster = {
            ...row,
            ActionType: ActionType,
            ReasonToUpdate: result.value,
          };

          this.pageService
          .DeleteReactivate(model)
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
            },
          });
        }
      });
    } catch (error) {

    }
  }
}
