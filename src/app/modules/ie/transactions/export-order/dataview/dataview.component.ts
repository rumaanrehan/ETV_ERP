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
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { CreateComponent } from './../../export-order-payment/create/create.component';
import { ExportOrderPayment } from '../../export-order-payment/export-payment';
import { LetterOfCredit } from '../../letter-of-credit/letter-of-credit';

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

  dataViewDef!: DataViewDef<ExportOrder_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;
  
  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<ExportOrder_IndexTableFilter>

  statusList: StaticList[] = [
    {iValue: 0, Text: "All", cValue: ""},
    {iValue: 1, Text: "processing", cValue: ""},
    {iValue: 2, Text: "ready_to_ship", cValue: ""},
  ]

  sortFieldList: any[] = [
    {value: "StatusID", text: "Status"}
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<ExportOrder_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
    this.dataViewDef = {
      tableKey: 'Admin_ExportOrder_IndexDataView',
      defaultSortColumn: { sortField: 'ExportOrderNo', sortOrder: 1 },
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
    this.router.navigate(['ie/export-order/create']);
  }

  loadData() {
    try {
      const model: DataViewParams<ExportOrder_IndexTableFilter> = {
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
              const data = response.Data.Items.map(item => ({
                ...item,
                ExportOrderDate: DateUtils.formatDate(item.ExportOrderDate),
                ReferenceDate: DateUtils.formatDate(item.ReferenceDate),
              }));
              this.dataViewDef.data = data;
              this.dataViewDef.totalRecords = response.Data.TotalRecords;
            }
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
  
  onClickEditDetails(exportOrderID: number) {
    if (exportOrderID) {
      this.router.navigate([`ie/export-order/edit/${exportOrderID}`]);
    }
  }

  onClickCancel(model: ExportOrder) {
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

  async createPaymentComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../export-order-payment/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ExportOrderPayment = this.formService.createNullObject<ExportOrderPayment>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createLCComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../letter-of-credit/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: LetterOfCredit = this.formService.createNullObject<LetterOfCredit>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
  }
}