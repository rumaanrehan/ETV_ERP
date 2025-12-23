import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { Menu, MenuModule } from 'primeng/menu';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { DataTableFilterList, StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { ExportOrderDocument } from '../../export-order-document/export-order-document';
import { ExportOrderPayment } from '../../export-order-payment/export-payment';
import { ExportOrderShipping } from '../../export-order-shipping/export-order-shipping';
import { ExportOrderTracking } from '../../export-order-tracking/export-order-tracking';
import { LetterOfCredit } from '../../letter-of-credit/letter-of-credit';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_IndexTableSort, ExportOrderBillRegulation } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { ZMultiButtonMenuComponent } from '../../../../../shared/components/z-multi-button-menu/z-multi-button-menu.component';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { ZMenuComponent } from '../../../../../shared/components/z-menu/z-menu.component';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, DataViewModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule, ZMultiButtonMenuComponent, MenuModule, ButtonModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  componentRef?: ComponentRef<any>;
  dataViewDef!: DataViewDef<ExportOrder_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<ExportOrder_IndexTableFilter>
  sortingForm!: FormGroup;
  sortingFormConfig!: FormConfigType<ExportOrder_IndexTableSort>

  menuItems: MenuItem[] = [
    {
      label: 'Options:',
      items: [{ label: 'Shipping Detail', icon: 'pi pi-plus', command: (row: any) => this.handleComponentLoad('ShippingCreateComponent', row) },
      { label: 'Bill Regulation', icon: 'pi pi-money-bill', command: (row: any) => this.handleComponentLoad('BillCreateComponent', row) },
      { label: 'Document', icon: 'pi pi-file-pdf', command: (row: any) => this.handleComponentLoad('DocumentCreateComponent', row) },
      { label: 'Payment', icon: 'pi pi-dollar', command: (row: any) => this.handleComponentLoad('PaymentCreateComponent', row) },
      { label: 'Tracking', icon: 'pi pi-at', command: (row: any) => this.handleComponentLoad('TrackingCreateComponent', row) },
      { label: 'Letter of Credit', icon: 'pi pi-envelope', command: (row: any) => this.handleComponentLoad('LetterOfCreditCreateComponent', row) }]
    }
  ];

  basedOnList: DataTableFilterList[] = []
  incotermList: DataTableFilterList[] = []
  isDutyDrawableList: DataTableFilterList[] = []
  isRoDTEPList: DataTableFilterList[] = []
  shipmentModeList: DataTableFilterList[] = []
  statusList: StaticList[] = []

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
    this.sortingFormConfig = this.pageService.getFormConfig_DataTableSort();
    this.sortingForm = this.formService.createFormGroup<ExportOrder_IndexTableSort>(this.pageService.getFormConfig_DataTableSort());
    this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);

    // this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadDataTableLists([
      { columnName: 'BasedOn', targetList: 'basedOnList' },
      { columnName: 'Incoterm', targetList: 'incotermList' },
      { columnName: 'IsDutyDrawable', targetList: 'isDutyDrawableList' },
      { columnName: 'IsRoDTEP', targetList: 'isRoDTEPList' },
      { columnName: 'ShipmentMode', targetList: 'shipmentModeList' }
    ]);
  }

  loadDataTableLists(listConfigs: { columnName: string; targetList: keyof DataviewComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<DataTableFilterList>>> = {};

    listConfigs.forEach(({ columnName, targetList }) => {
      sources[targetList] = this.pageService.GetDataTableList({
        AreaName: 'IE',
        ControllerName: 'ExportOrder',
        TableName: 'IndexTable',
        ColumnName: columnName
      });
    });

    forkJoin(sources)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          listConfigs.forEach(({ targetList }) => {
            if (response[targetList]?.IsSuccess) {
              (this[targetList] as DataTableFilterList[]) = response[targetList].Data.Items || [];
            } else {
              (this[targetList] as DataTableFilterList[]) = [];
            }
          });
        },
      });
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onClickPageHeaderAddButton() {
    this.router.navigate(['ie/export-order/create']);
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<ExportOrder_IndexTableFilter>(this.filterFormConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<ExportOrder_IndexTableSort>(this.sortingFormConfig, formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      const model: DataViewParams<ExportOrder_IndexTableFilter, ExportOrder_IndexTableSort> = {
        first: this.dataViewEvent.first,
        last: this.dataViewEvent.rows,
        filters: this.filterForm.value,
        sortings: this.sortingForm.value
      };
      this.pageService.PopulateGrid(this.formService.transformFormData(model))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.dataViewDef.data = response.Data.Items;
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

  onClickEditDetails(exportOrderID: number): void {
    if (exportOrderID) {
      this.router.navigate([`ie/export-order/edit/${exportOrderID}`]);
    }
  }

  onClickCancel(row: any) {
    this.alertService
      .showConfirmationWithInput({
        text: 'Do you want to cancel?',
        inputPlaceholder: 'Reason to cancel'
      })
      .then((result) => {
        if (result.isConfirmed) {
          const model: ExportOrder = {
            ...row,
            ReasonToUpdate: result.Message
          }

          this.pageService.CancelOrder(model)
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

  handleComponentLoad(componentName: string, model: any) {
    if (this.componentRef) {
      this.destroyComponent();
    }

    switch (componentName) {
      case 'ShippingCreateComponent':
        return this.createShippingComponent(model);
      case 'BillCreateComponent':
        return this.createBillComponent(model);
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

  loadDynamicComponent(model: any) {
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

  async createShippingComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../export-order-shipping/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ExportOrderShipping = this.formService.createNullObject<ExportOrderShipping>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createBillComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../export-order-bill-regulation/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ExportOrderBillRegulation = this.formService.createNullObject<ExportOrderBillRegulation>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
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

  async createTrackingComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../export-order-tracking/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ExportOrderTracking = this.formService.createNullObject<ExportOrderTracking>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
  }

  async createDocumentComponent(row: ExportOrder_IndexTableList) {
    const { CreateComponent } = await import('./../../export-order-document/create/create.component');
    this.componentRef = this.container.createComponent(CreateComponent);
    const model: ExportOrderDocument = this.formService.createNullObject<ExportOrderDocument>();
    model.ExportOrderID = row.ExportOrderID;
    model.ExportOrderNo = row.ExportOrderNo;
    this.loadDynamicComponent(model);
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}