import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { MenuItem } from '../../../../../shared/components/z-menu/z-menu';
import { ZMenuComponent } from '../../../../../shared/components/z-menu/z-menu.component';
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
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList, ExportOrder_IndexTableSort, ExportOrderBillRegulation, ExportOrderCancelRequest } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { PackingListComponent } from '../packing-list/packing-list.component';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, DataViewModule, ZDataviewComponent, PackingListComponent, ReactiveFormsModule, ZFormControlsModule, ZMenuComponent, ButtonModule, FormsModule, CheckboxModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @Output() selectionChange = new EventEmitter<ExportOrder_IndexTableList[]>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  @ViewChild(PackingListComponent) createDialog?: PackingListComponent;

  componentRef?: ComponentRef<any>;
  dataViewDef!: DataViewDef<ExportOrder_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  selectedExportOrders: ExportOrder_IndexTableList[] = [];
  selectAll = false;
  showPackingListDialog = false;

  menuCache = new Map<number, MenuItem[]>();

  // menuItems: MenuItem[] = [
  //   {
  //     label: 'Options:',
  //     items: [{ label: 'Shipping Detail', icon: 'pi pi-plus', command: (row: any) => this.handleComponentLoad('ShippingCreateComponent', row) },
  //     { label: 'Bill Regulation', icon: 'pi pi-money-bill', command: (row: any) => this.handleComponentLoad('BillCreateComponent', row), disabled:  },
  //     { label: 'Document', icon: 'pi pi-file-pdf', command: (row: any) => this.handleComponentLoad('DocumentCreateComponent', row) },
  //     { label: 'Payment', icon: 'pi pi-dollar', command: (row: any) => this.handleComponentLoad('PaymentCreateComponent', row) },
  //     { label: 'Tracking', icon: 'pi pi-at', command: (row: any) => this.handleComponentLoad('TrackingCreateComponent', row) },
  //     { label: 'Letter of Credit', icon: 'pi pi-envelope', command: (row: any) => this.handleComponentLoad('LetterOfCreditCreateComponent', row) }]
  //   }
  // ];

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
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
    this.loadDropdownList();
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
      { columnName: 'ShipmentMode', targetList: 'shipmentModeList' },
      { columnName: 'StatusID', targetList: 'statusList' }
    ]);
  }

  getStatusText(item: ExportOrder_IndexTableList): string {
    if (item.StatusText && `${item.StatusText}`.trim().length > 0) {
      return item.StatusText;
    }

    const status = this.statusList.find(x => x.iValue === item.StatusID);
    if (status) {
      return status.Text;
    }

    if (item.StatusID != null) {
      return `Status ${item.StatusID}`;
    }

    return 'Unknown';
  }

  getStatusColor(item: ExportOrder_IndexTableList): string {
    return item.StatusHex || '#111111';
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
    this.showPackingListDialog = false;
    this.loadData();
  }
  
  onClickAddPackingDetails(exportOrderID: number, exportOrderPackingListID: number | null): void {
    try {
      if (exportOrderPackingListID) {
        this.pageService
          .GetPackingListDetails(exportOrderPackingListID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.showPackingListDialog = true;
                setTimeout(() => {
                  this.createDialog?.openDialogBox({ isEditMode: true, packingList: response.Data, productList: null });
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
      else if (exportOrderID) {
        this.pageService
          .GetExportOrderProductDetails(exportOrderID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.showPackingListDialog = true;
                setTimeout(() => {
                  this.createDialog?.openDialogBox({ isEditMode: false, packingList: null, productList: response.Data });
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) { }
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      const filterConfig = this.pageService.getFormConfig_DataTableFilter();
      this.formService.resetFormValue<ExportOrder_IndexTableFilter>(filterConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      const sortingConfig = this.pageService.getFormConfig_DataTableSort();
      this.formService.resetFormValue<ExportOrder_IndexTableSort>(sortingConfig, formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      this.menuCache.clear();
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
          const model: ExportOrderCancelRequest = {
            ExportOrderID: row.ExportOrderID,
            ReasonToCancel: result.Message
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

  onSelectionChange(item: ExportOrder_IndexTableList) {
    if (item._selected) {
      this.selectedExportOrders.push(item);
    } else {
      this.selectedExportOrders =
        this.selectedExportOrders.filter(
          x => x.ExportOrderID !== item.ExportOrderID
        );
    }
    this.selectAll = this.selectedExportOrders.length === this.dataViewDef.data.length;
    // Emit selected items to parent index component
    this.selectionChange.emit(this.selectedExportOrders);
  }

  toggleSelectAll(event: any) {
    this.selectedExportOrders = [];
    this.dataViewDef.data.forEach((item: ExportOrder_IndexTableList) => {
      item._selected = event.checked;
      if (event.checked) {
        this.selectedExportOrders.push(item);
      }
    });
    // Emit selected items to parent index component
    this.selectionChange.emit(this.selectedExportOrders);
  }

  clearSelection() {
    this.dataViewDef.data.forEach(x => x._selected = false);
    this.selectedExportOrders = [];
    this.selectAll = false;
    this.selectionChange.emit([]);
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

  buildMenuOptions(item: ExportOrder_IndexTableList): MenuItem[] {
    const menuItems: MenuItem[] = [];
    if (item.StatusID < 5) {
      menuItems.push(
        {
          label: 'Shipping Details',
          icon: 'pi pi pi-plus',
          command: () => this.handleComponentLoad('ShippingCreateComponent', item)
        },
      )
    }
    if (item.StatusID == 5) {
      menuItems.push(
        {
          label: 'Bill Regulation',
          icon: 'pi pi-file-pdf',
          command: () => this.handleComponentLoad('BillCreateComponent', item)
        },
      )
    }

    menuItems.push(
      {
        label: 'Document',
        icon: 'pi pi-file-arrow-up',
        command: () => this.handleComponentLoad('DocumentCreateComponent', item)
      },
      {
        label: 'Payment',
        icon: 'pi pi-dollar',
        command: () => this.handleComponentLoad('PaymentCreateComponent', item)
      },
      {
        label: 'Tracking',
        icon: 'pi pi-at',
        command: () => this.handleComponentLoad('TrackingCreateComponent', item)
      },
      {
        label: 'Letter of Credit',
        icon: 'pi pi-envelope',
        command: () => this.handleComponentLoad('LetterOfCreditCreateComponent', item)
      },
      {
        label: item.ExportOrderPackingListID ? 'Update Packing Details' : 'Add Packing Details',
        icon: 'pi pi-box',
        command: () => this.onClickAddPackingDetails(item.ExportOrderID, item.ExportOrderPackingListID)
      }
    )

    return menuItems;
  }

  getMenuOptions(item: ExportOrder_IndexTableList): MenuItem[] {
    return this.buildMenuOptions(item);
  }

  // getMenuOptions(item: ExportOrder_IndexTableList): MenuItem[] {
  //   console.log(item);
  //   if (!this.menuCache.has(item.ExportOrderID)) {
  //     this.menuCache.set(item.ExportOrderID, this.buildMenuOptions(item));
  //   }
  //   return this.menuCache.get(item.ExportOrderID)!;
  // }
}
