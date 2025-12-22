import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-data-view/z-data-view';
import { ZDataViewComponent } from '../../../../../shared/components/z-data-view/z-data-view.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SalesQuotation, SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableList } from '../sales-quotation';
import { SalesQuotationService } from '../sales-quotation.service';
import { ApiListResponse } from '../../../../../shared/models/api-response';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataViewComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<SalesQuotation_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<SalesQuotation_IndexTableFilter>

  statusList: StaticList[] = []
  basedOnList: StaticList[] = []

  sortFieldList: any[] = [
    { value: "SalesQuotationDate", text: "Quotation Date" },
    { value: "StatusID", text: "Status" },
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesQuotationService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<SalesQuotation_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
    this.dataViewDef = {
      tableKey: 'IE_SalesQuotation_IndexDataView',
      defaultSortColumn: { sortField: 'QuotationNo', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'BasedOn', targetList: 'basedOnList' }

    ]);
    // this.pageService.GetMasterDropdownLists()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (data) => {
    //       this.paymentTermList = data.paymentTermList.Data.Items;
    //       this.taxSlabList = data.taxSlabList.Data.Items;
    //       this.currencyList = data.currencyList.Data.Items;
    //     },
    //   });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof DataviewComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'SalesQuotation',
        FieldName: fieldName,
      });
    });

    forkJoin(sources)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          listConfigs.forEach(({ targetList }) => {
            if (response[targetList]?.IsSuccess) {
              (this[targetList] as StaticList[]) = response[targetList].Data.Items || [];
            } else {
              (this[targetList] as StaticList[]) = [];
            }
          });
        },
      });
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onClickPageHeaderAddButton() {
    this.router.navigate(['ie/sales-quotation/create']);
  }

  loadData() {
    try {
      const model: DataViewParams<SalesQuotation_IndexTableFilter> = {
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

  onClickEditDetails(salesQuotationID: number) {
    if (salesQuotationID) {
      this.router.navigate([`ie/sales-quotation/edit/${salesQuotationID}`]);
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
          const model: SalesQuotation = {
            ...row,
            ReasonToUpdate: result.Message
          }

          this.pageService.CancelQuotation(model)
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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}
