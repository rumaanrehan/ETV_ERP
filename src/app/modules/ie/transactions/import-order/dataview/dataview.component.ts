import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-data-view/z-data-view';
import { ZDataViewComponent } from '../../../../../shared/components/z-data-view/z-data-view.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { LetterOfCredit } from '../../letter-of-credit/letter-of-credit';
import { ImportOrder, ImportOrder_IndexTableFilter, ImportOrder_IndexTableList } from '../import-order';
import { ImportOrderDocument } from '../import-order-document/import-order-document';
import { ImportOrderPayment } from '../import-order-payment/import-order-payment';
import { ImportOrderTracking } from '../import-order-tracking/import-order-tracking';
import { ImportOrderService } from '../import-order.service';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, DataViewModule, ZDataViewComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<ImportOrder_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;
  
  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<ImportOrder_IndexTableFilter>

  statusList: StaticList[] = [
    {iValue: 0, Text: "All", cValue: ""},
    {iValue: 1, Text: "processing", cValue: ""},
    {iValue: 2, Text: "ready_to_ship", cValue: ""}
  ]

  sortFieldList: any[] = [
    {value: "StatusID", text: "Status"}
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ImportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<ImportOrder_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
    this.dataViewDef = {
      tableKey: 'Admin_ImportOrder_IndexDataView',
      defaultSortColumn: { sortField: 'ImportOrderNo', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onClickPageHeaderAddButton() {
    this.router.navigate(['ie/import-order/create']);
  }

  loadData() {
    try {
      const model: DataViewParams<ImportOrder_IndexTableFilter> = {
        first: this.dataViewEvent.first,
        last: this.dataViewEvent.rows,
        sortField: this.dataViewEvent.sortField,
        sortOrder: this.dataViewEvent.sortOrder,
        filters: this.filterForm.value
      };
      this.pageService.PopulateGrid(this.formService.transformFormData(model))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              console.log(response.Data.Items);
              this.dataViewDef.data = response.Data.Items;
              this.dataViewDef.totalRecords = response.Data.TotalRecords;
            }
            // if (response.IsSuccess) {
            //   console.log(response.Data.Items)
            //   const data = response.Data.Items.map(item => ({
            //     ...item,
            //     ImportOrderDate: DateUtils.formatDate(item.ImportOrderDate),
            //     ReferenceDate: DateUtils.formatDate(item.ReferenceDate),
            //   }));
            //   this.dataViewDef.data = data;
            //   this.dataViewDef.totalRecords = response.Data.TotalRecords;
            // }
            else {
              this.dataViewDef.data = [];
              this.dataViewDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.dataViewDef.loading = false;
          }
        });
    }
    catch (error) {

    }
  }
  
  onClickEditDetails(importOrderID: number) {
    if (importOrderID) {
      this.router.navigate([`ie/import-order/edit/${importOrderID}`]);
    }
  }

  onClickCancel(model: ImportOrder) {
    this.alertService
    .showConfirmation({
      text: 'Do you want to cancel?',
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.pageService
        .CancelOrder(model)
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
  }

  populateStatus(statusID: number): string {
    switch (statusID) {
      case 1: 
        return 'Processing';
      case 2:
        return 'Ready to ship';
      case 3:
        return 'Cancelled';
      default:
        return 'Undefined';
    }
  }

  handleComponentLoad(componentName: string, model: any) {
    if (this.componentRef) {
      this.destroyComponent();
    }

    switch (componentName) {
      case 'PaymentCreateComponent':
        return this.createPaymentComponent(model);
      case 'LetterOfCreditCreateComponent':
        return this.createLCComponent(model);
      case 'TrackingCreateComponent':
        return this.createTrackingComponent(model);
      case 'DocumentCreateComponent':
        return this.createDocumentComponent(model);
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  }

  loadDynamicComponent(model: any){
    setTimeout(() => {
      this.componentRef?.instance.openSidebar(true, false, model);
      this.componentRef?.instance.closeSidebarEvent.subscribe(() => {
        this.loadData();
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

  async createPaymentComponent(row: ImportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../import-order-payment/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ImportOrderPayment = this.formService.createNullObject<ImportOrderPayment>();
    model.ImportOrderID = row.ImportOrderID;
    model.ImportOrderNo = row.ImportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createLCComponent(row: ImportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../letter-of-credit/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: LetterOfCredit = this.formService.createNullObject<LetterOfCredit>();
    // model.ImportOrderID = row.ImportOrderID;
    // model.ImportOrderNo = row.ImportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createTrackingComponent(row: ImportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../import-order-tracking/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ImportOrderTracking = this.formService.createNullObject<ImportOrderTracking>();
    model.ImportOrderID = row.ImportOrderID;
    model.ImportOrderNo = row.ImportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createDocumentComponent(row: ImportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../import-order-document/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ImportOrderDocument = this.formService.createNullObject<ImportOrderDocument>();
    model.ImportOrderID = row.ImportOrderID;
    model.ImportOrderNo = row.ImportOrderNo;
    this.loadDynamicComponent(model);
  }

  formatDateToIndian(dateStr: any) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}