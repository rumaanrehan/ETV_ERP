import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { PurchaseQuotation_IndexTableList, PurchaseQuotation_IndexTableFilter, PurchaseQuotation_IndexTableSort, PurchaseQuotation } from '../purchase-quotation';
import { PurchaseQuotationService } from '../purchase-quotation.service';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<PurchaseQuotation_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<PurchaseQuotation_IndexTableFilter>
  sortingForm!: FormGroup;
  sortingFormConfig!: FormConfigType<PurchaseQuotation_IndexTableSort>

  statusList: StaticList[] = []
  basedOnList: StaticList[] = []

  sortFieldList: any[] = [
    { value: "PurchaseQuotationDate", text: "Quotation Date" },
    { value: "StatusID", text: "Status" },
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: PurchaseQuotationService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<PurchaseQuotation_IndexTableFilter>(this.filterFormConfig);
    this.sortingFormConfig = this.pageService.getFormConfig_DataTableSort();
    this.sortingForm = this.formService.createFormGroup<PurchaseQuotation_IndexTableSort>(this.sortingFormConfig);
    this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);

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
        ControllerName: 'PurchaseQuotation',
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
    this.router.navigate(['ie/purchase-quotation/create']);
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<PurchaseQuotation_IndexTableFilter>(this.filterFormConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<PurchaseQuotation_IndexTableSort>(this.sortingFormConfig, formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      const model: DataViewParams<PurchaseQuotation_IndexTableFilter, PurchaseQuotation_IndexTableSort> = {
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

  onClickEditDetails(QuotationID: number) {
    if (QuotationID) {
      this.router.navigate([`ie/purchase-quotation/edit/${QuotationID}`]);
    }
  }

  onClickCancel(quotationID: number) {
    this.alertService
      .showConfirmationWithInput({
        text: 'Do you want to cancel?',
        inputPlaceholder: 'Reason to cancel'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.pageService.CancelQuotation(quotationID, result.value)
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
