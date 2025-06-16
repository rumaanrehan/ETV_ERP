import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { ZDataViewComponent } from '../../../../../shared/components/z-data-view/z-data-view.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-data-view/z-data-view';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ExportOrder, ExportOrder_IndexTableFilter, ExportOrder_IndexTableList } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { Router } from '@angular/router';

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
    this.router.navigate(['admin/export-order/create']);
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
              console.log(response.Data.Items);
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
  
  onClickEditDetails(exportOrderID: number) {
    if (exportOrderID) {
      this.router.navigate([`admin/export-order/edit/${exportOrderID}`]);
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

  populateStatus(statusID: number | null): string {
    console.log(statusID);
    switch (statusID) {
      case 1:  return 'processing';
      case 2:  return 'ready_to_ship';
      default: return 'Undefined';
    }
  }
}